-- soap-raw.lua
--
-- Arma el sobre (envelope) SOAP 1.1 tomando el XML interno ya construido
-- (el contenido de <dom:XxxRequest>...</dom:XxxRequest>) y lo envuelve en
-- el Envelope/Header/Body estandar, agregando los headers HTTP que SOAP
-- necesita (Content-Type text/xml, SOAPAction).
--
-- Reutilizable para los 45 metodos: cada endpoint solo necesita pasar
-- el XML interno correspondiente a su propio Request.

function soap_envelope(inner_xml)
    local r = request.load()

    local envelope =
        '<?xml version="1.0" encoding="UTF-8"?>' ..
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' ..
        'xmlns:dom="http://test.app.com/domain">' ..
        '<soapenv:Header/>' ..
        '<soapenv:Body>' ..
        inner_xml ..
        '</soapenv:Body>' ..
        '</soapenv:Envelope>'

    r:method('POST')
    r:headers('Content-Type', 'text/xml; charset=utf-8')
    r:headers('SOAPAction', '""')
    r:body(envelope)
end