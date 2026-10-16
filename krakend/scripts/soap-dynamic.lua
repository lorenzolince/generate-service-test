-- soap-dynamic.lua
--
-- Builders genericos y reutilizables para los 45 metodos SOAP. Cada
-- funcion toma el JSON crudo que mando el cliente (via request.load():body())
-- y extrae los campos necesarios usando pattern-matching de Lua (sin
-- libreria JSON), para armar el XML interno del <dom:XxxRequest>.
--
-- Requiere que scripts/soap-raw.lua tambien este cargado (usa su funcion
-- soap_envelope para el sobre final).

-- ---------- Helpers de extraccion ----------

-- Extrae el VALOR crudo (como texto) de un campo escalar de nivel
-- superior dentro de un bloque JSON. Soporta string, numero, boolean,
-- null. No incluye comillas en el resultado.
local function get_scalar_raw(body, field)
    local s = body:match('"' .. field .. '"%s*:%s*"([^"]*)"')
    if s ~= nil then return s end
    local n = body:match('"' .. field .. '"%s*:%s*(%-?%d+%.?%d*)')
    if n ~= nil then return n end
    local t = body:match('"' .. field .. '"%s*:%s*(true)')
    if t ~= nil then return t end
    local f = body:match('"' .. field .. '"%s*:%s*(false)')
    if f ~= nil then return f end
    return nil
end

-- Extrae un OBJETO JSON completo ("{...}") asociado a un campo,
-- usando balanceo de llaves (%b{}) para respetar anidamiento.
local function get_object_raw(body, field)
    return body:match('"' .. field .. '"%s*:%s*(%b{})')
end

-- Extrae un ARREGLO JSON completo ("[...]") asociado a un campo,
-- usando balanceo de corchetes (%b[]).
local function get_array_raw(body, field)
    return body:match('"' .. field .. '"%s*:%s*(%b[])')
end

-- Separa los objetos "{...}" de nivel superior dentro de un arreglo
-- (sin corchetes externos), respetando anidamiento.
local function split_top_level_objects(inner_arr)
    local items = {}
    local pos = 1
    while true do
        local s, e = inner_arr:find('%b{}', pos)
        if not s then break end
        table.insert(items, inner_arr:sub(s, e))
        pos = e + 1
    end
    return items
end

-- Escapa & < > para texto dentro de un elemento XML.
local function xesc(s)
    if s == nil then return '' end
    s = s:gsub('&', '&amp;')
    s = s:gsub('<', '&lt;')
    s = s:gsub('>', '&gt;')
    return s
end

local function tag(name, value)
    return '<dom:' .. name .. '>' .. xesc(value) .. '</dom:' .. name .. '>'
end

-- ---------- Builders por categoria ----------

-- A) Sin input.
function soap_empty(opname)
    soap_envelope('<dom:' .. opname .. 'Request/>')
end

-- B) Un solo campo escalar.
function soap_scalar(opname, field)
    local r = request.load()
    local body = r:body()
    if body == nil or body == '' then body = '{}' end
    local v = get_scalar_raw(body, field)
    local inner = '<dom:' .. opname .. 'Request>' .. tag(field, v) .. '</dom:' .. opname .. 'Request>'
    soap_envelope(inner)
end

-- C) Varios campos escalares planos (mismo nivel, sin wrapper).
function soap_multi_scalar(opname, fields_csv)
    local r = request.load()
    local body = r:body()
    if body == nil or body == '' then body = '{}' end
    local parts = {}
    for field in fields_csv:gmatch('[^,]+') do
        local v = get_scalar_raw(body, field)
        table.insert(parts, tag(field, v))
    end
    local inner = '<dom:' .. opname .. 'Request>' .. table.concat(parts) .. '</dom:' .. opname .. 'Request>'
    soap_envelope(inner)
end

-- D) Un objeto anidado unico (ej: pPersona: {...}).
function soap_nested_obj(opname, wrapper, fields_csv)
    local r = request.load()
    local body = r:body()
    if body == nil or body == '' then body = '{}' end
    local objtext = get_object_raw(body, wrapper) or '{}'
    local parts = {}
    for field in fields_csv:gmatch('[^,]+') do
        local v = get_scalar_raw(objtext, field)
        table.insert(parts, tag(field, v))
    end
    local inner = '<dom:' .. opname .. 'Request><dom:' .. wrapper .. '>' ..
        table.concat(parts) .. '</dom:' .. wrapper .. '></dom:' .. opname .. 'Request>'
    soap_envelope(inner)
end

-- E) Arreglo de objetos repetidos (ej: pPersonas: [{...},{...}]).
function soap_repeated_obj(opname, wrapper, fields_csv)
    local r = request.load()
    local body = r:body()
    if body == nil or body == '' then body = '{}' end
    local arrtext = get_array_raw(body, wrapper) or '[]'
    local inner_arr = arrtext:sub(2, -2)
    local items = split_top_level_objects(inner_arr)
    local parts = {}
    for _, objtext in ipairs(items) do
        local fparts = {}
        for field in fields_csv:gmatch('[^,]+') do
            local v = get_scalar_raw(objtext, field)
            table.insert(fparts, tag(field, v))
        end
        table.insert(parts, '<dom:' .. wrapper .. '>' .. table.concat(fparts) .. '</dom:' .. wrapper .. '>')
    end
    local inner = '<dom:' .. opname .. 'Request>' .. table.concat(parts) .. '</dom:' .. opname .. 'Request>'
    soap_envelope(inner)
end

-- F) Uno o mas arreglos de escalares (ej: pNumeros:[..], pTextos:[..]).
function soap_repeated_flat(opname, arrays_csv)
    local r = request.load()
    local body = r:body()
    if body == nil or body == '' then body = '{}' end
    local parts = {}
    for field in arrays_csv:gmatch('[^,]+') do
        local arrtext = get_array_raw(body, field) or '[]'
        local inner_arr = arrtext:sub(2, -2)
        for token in (inner_arr .. ','):gmatch('([^,]*),') do
            local trimmed = token:match('^%s*(.-)%s*$')
            if trimmed ~= '' then
                local unquoted = trimmed:match('^"(.*)"$') or trimmed
                table.insert(parts, tag(field, unquoted))
            end
        end
    end
    local inner = '<dom:' .. opname .. 'Request>' .. table.concat(parts) .. '</dom:' .. opname .. 'Request>'
    soap_envelope(inner)
end

-- G) Pareja LOB (texto + archivo base64) - mismo patron que multi_scalar.
function soap_lob(opname, field1, field2)
    soap_multi_scalar(opname, field1 .. ',' .. field2)
end

-- H) Campo "anyType" (Struct/Json de paso libre) - se embebe el JSON
-- crudo (objeto o arreglo) tal cual, como texto plano dentro del tag.
function soap_anytype(opname, field)
    local r = request.load()
    local body = r:body()
    if body == nil or body == '' then body = '{}' end
    local raw = get_array_raw(body, field) or get_object_raw(body, field) or 'null'
    local inner = '<dom:' .. opname .. 'Request>' .. tag(field, raw) .. '</dom:' .. opname .. 'Request>'
    soap_envelope(inner)
end

-- PRUEBA: modifier/lua-endpoint (capa de transporte, distinta a proxy/backend)
function convertJson_endpoint_test(fieldName)
    local r = response.load()
    local ok, body = pcall(function() return r:body() end)
    if not ok then
        print("ENDPOINT-LEVEL: r:body() dio ERROR:", tostring(body))
        return
    end
    print("ENDPOINT-LEVEL: r:body() OK, tipo =", type(body), ", longitud =", body and #body or 0)
    if body == nil or body == '' then
        print("ENDPOINT-LEVEL: body vacio")
        return
    end

    local pattern = '"' .. fieldName .. '":"(.-[^\\])"'
    local replaced, count = body:gsub(pattern, function(escaped)
        local unescaped = escaped:gsub('\\"', '"')
        unescaped = unescaped:gsub('\\\\', '\\')
        return '"' .. fieldName .. '":' .. unescaped
    end)
    print("ENDPOINT-LEVEL: coincidencias =", count)
    if count > 0 then
        r:body(replaced)
        print("ENDPOINT-LEVEL: body reemplazado OK")
    end
end