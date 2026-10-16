const express = require('express');
const xml2js = require('xml2js');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));

const SOAP_URL = process.env.SOAP_URL || 'http://host.docker.internal:8085/service/endpoints';
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());

// ---------- Helpers XML ----------

function xesc(v) {
    if (v === undefined || v === null) return '';
    return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function tag(name, value) {
    return `<dom:${name}>${xesc(value)}</dom:${name}>`;
}

// ---------- Builders de request por categoria (mismo diseno que en Lua) ----------

function buildInner(opDef, body) {
    const { operationName, category, params } = opDef;
    const opTag = (inner) => `<dom:${operationName}Request>${inner}</dom:${operationName}Request>`;

    switch (category) {
        case 'empty':
            return `<dom:${operationName}Request/>`;

        case 'scalar':
            return opTag(tag(params.field, body[params.field]));

        case 'multiScalar':
            return opTag(params.fields.map(f => tag(f, body[f])).join(''));

        case 'nestedObj': {
            const obj = body[params.wrapper] || {};
            const inner = params.fields.map(f => tag(f, obj[f])).join('');
            return opTag(`<dom:${params.wrapper}>${inner}</dom:${params.wrapper}>`);
        }

        case 'repeatedObj': {
            const arr = body[params.wrapper] || [];
            const inner = arr.map(obj => {
                const fparts = params.fields.map(f => tag(f, obj[f])).join('');
                return `<dom:${params.wrapper}>${fparts}</dom:${params.wrapper}>`;
            }).join('');
            return opTag(inner);
        }

        case 'repeatedFlat': {
            const parts = [];
            for (const field of params.arrays) {
                const arr = body[field] || [];
                for (const v of arr) {
                    parts.push(tag(field, v));
                }
            }
            return opTag(parts.join(''));
        }

        case 'anytype': {
            // Se embebe el JSON tal cual (objeto o arreglo), como texto plano.
            const value = body[params.field];
            const jsonText = JSON.stringify(value !== undefined ? value : null);
            return opTag(tag(params.field, jsonText));
        }

        default:
            throw new Error(`Categoria desconocida: ${category}`);
    }
}

function buildSoapEnvelope(innerXml) {
    return (
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
        'xmlns:dom="http://test.app.com/domain">' +
        '<soapenv:Header/>' +
        '<soapenv:Body>' +
        innerXml +
        '</soapenv:Body>' +
        '</soapenv:Envelope>'
    );
}

// ---------- Parseo de la respuesta SOAP ----------

function stripPrefix(tagName) {
    const idx = tagName.indexOf(':');
    return idx >= 0 ? tagName.substring(idx + 1) : tagName;
}

async function parseXml(xmlText) {
    const parser = new xml2js.Parser({
        explicitArray: false,
        tagNameProcessors: [stripPrefix],
        attrNameProcessors: [stripPrefix],
        ignoreAttrs: true,
        trim: false,
    });
    return parser.parseStringPromise(xmlText);
}

function coerceFieldsDeep(node, numericFields, booleanFields) {
    if (Array.isArray(node)) {
        return node.map(item => coerceFieldsDeep(item, numericFields, booleanFields));
    }
    if (node !== null && typeof node === 'object') {
        const result = {};
        for (const [key, val] of Object.entries(node)) {
            let newVal = coerceFieldsDeep(val, numericFields, booleanFields);

            const isNumericField = numericFields.includes(key);
            const isBooleanField = booleanFields.includes(key);

            if (isNumericField) {
                newVal = coerceValueList(newVal, (s) => (s.trim() !== '' && !isNaN(Number(s)) ? Number(s) : s));
            } else if (isBooleanField) {
                newVal = coerceValueList(newVal, (s) => (s === 'true' ? true : s === 'false' ? false : s));
            }

            result[key] = newVal;
        }
        return result;
    }
    return node;
}

// Aplica una funcion de coercion tanto si el valor es un string escalar
// como si es un arreglo de strings (ej: pNumeros: ["1","2","3"]).
function coerceValueList(value, coerceFn) {
    if (Array.isArray(value)) {
        return value.map(v => (typeof v === 'string' ? coerceFn(v) : v));
    }
    if (typeof value === 'string') {
        return coerceFn(value);
    }
    return value;
}

function parseAnyTypeFields(node, fieldNames) {
    if (node === null || typeof node !== 'object') return node;
    for (const field of fieldNames) {
        if (typeof node[field] === 'string') {
            try {
                node[field] = JSON.parse(node[field]);
            } catch (e) {
                // se deja tal cual si no es JSON valido
            }
        }
    }
    return node;
}

// ---------- Handler generico ----------

app.post('/api/:operation', async (req, res) => {
    const opKey = req.params.operation;
    const opDef = config[opKey];

    if (!opDef) {
        return res.status(404).json({ error: `Operacion desconocida: ${opKey}` });
    }

    try {
        const innerXml = buildInner(opDef, req.body || {});
        const envelope = buildSoapEnvelope(innerXml);

        const soapResponse = await fetch(SOAP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': '""',
            },
            body: envelope,
        });

        const xmlText = await soapResponse.text();

        // Algunas operaciones (sin wsdl:output) responden con body vacio.
        if (opDef.emptyResponse || xmlText.trim() === '') {
            if (xmlText.trim() === '') {
                return res.json({});
            }
        }

        const parsed = await parseXml(xmlText);
        if (!parsed || !parsed.Envelope) {
            console.error(`Respuesta inesperada (no XML valido) en ${opKey}:`, xmlText.slice(0, 200));
            return res.status(502).json({ error: 'Respuesta invalida del backend SOAP' });
        }

        const body = parsed.Envelope.Body;

        // SOAP Fault
        if (body.Fault) {
            return res.status(500).json({
                error: 'SOAP Fault',
                faultcode: body.Fault.faultcode,
                faultstring: body.Fault.faultstring,
            });
        }

        const responseKey = `${opDef.operationName}Response`;
        let data = body[responseKey] || {};

        data = coerceFieldsDeep(data, opDef.numericFields, opDef.booleanFields);
        data = parseAnyTypeFields(data, opDef.anyTypeOutputFields);

        res.json(data);
    } catch (err) {
        console.error(`Error en ${opKey}:`, err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`soap-proxy escuchando en el puerto ${PORT}`);
    console.log(`Operaciones configuradas: ${Object.keys(config).length}`);
    console.log(`Backend SOAP: ${SOAP_URL}`);
});