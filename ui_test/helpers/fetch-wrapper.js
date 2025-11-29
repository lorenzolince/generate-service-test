
const fetchWrapper = {
    getTkn: async (url, accessTkn) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + accessTkn,
                'Content-Type': 'application/json'
            },
        };
        return await fetch(url, requestOptions).then(handleResponse);
    }, postTkn: async (url, body, accessTkn) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: "Bearer " + accessTkn,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };
        return await fetch(url, requestOptions).then(handleResponse);
    },
    get: async (url) => {

        let requestOptions = {
            method: 'GET'
        };
        return await fetch(url, requestOptions).then(handleResponse);
    },
    post: async (url, body) => {

        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        };

        return await fetch(url, requestOptions).then(handleResponse);
    },
    put: async (url, body) => {
        let requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'STGB_ServiceName': 'OSB_SOA_GETRegexpPassword',
                'STGB_OperationName': 'getRexpPaaword',
                'STGB_Method': 'POST',
                'STGB_Version': '1'
            },
            body: JSON.stringify(body)
        };
        requestOptions.headers.append('Authorization', 'Basic' + base64.encode("StGeorge:StGeorgeB2022#"));
        return await fetch(url, requestOptions).then(handleResponse);
    },
    delete: async (url) => {
        let requestOptions = {
            method: 'DELETE'
        };
        return await fetch(url, requestOptions).then(handleResponse);
    },
    upload: async (url, data) => {
        let requestOptions = {
            method: 'POST',
            body: data
        };

        return await fetch(url, requestOptions).then(handleResponse);
    },
    downloadServerHeaders: async (url, body, headers) => {
        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: body
        };
        return await fetch(url, requestOptions);
    },
    downloadServer: async (url, body) => {
        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        };
        return await fetch(url, requestOptions);
    },
    download: async (url, filename) => {
        let requestOptions = {};
        return await fetch(url, requestOptions).then(function (t) {
            return t.blob().then((b) => {
                var a = document.createElement("a");
                a.href = URL.createObjectURL(b);
                a.setAttribute("download", filename);
                a.click();
            }
            );
        });
    },
    downloadZip: async (url, body) => {
        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        };
        return await fetch(url, requestOptions).then(function (response) {

            if (!response.ok) {
                return response.text().then(text => {
                    const data = text && JSON.parse(text);
                    return data.data;
                });
            }
            var content = response.headers.get('content-disposition')
            const parts = content.split(';');
            let filename = parts[1].split('=')[1];
            return response.blob().then((b) => {
                var a = document.createElement("a");
                a.href = URL.createObjectURL(b);
                a.setAttribute("download", filename);
                a.click();
                const data = { status: 200, messaje: "ok" }
                return data;
            }
            );
        });
    }
};

function handleResponse(response) {
    return response.text().then(text => {
        let data;
        try {

            data = text ? JSON.parse(text) : text;
        } catch (error) {
            console.error("No se pudo parsear la respuesta como JSON:", error);
            data = text;
        }

        if (!response.ok) {
            console.error("Error en la respuesta:", response.status, data);
            return {
                status: response.status,
                message: data.message,
                error: data.error
            };
        }
        if (data === null || data === "" || data === undefined) {
            return { status: 200, message: "ok" };
        }
        return data;
    });
}

export default fetchWrapper;