"use server";

const GRAPHQL_BASE_URL = "http://localhost:8080";
const ENDPOINT = `${GRAPHQL_BASE_URL}/graphql`;

export async function getAllApi() {
    const data = { "query": "mutation { getAllClient { getAllClientOut { id name email cellPhone address } } }" };
    const headers = { "Content-Type": "application/json" };
    const response = await fetch(`${ENDPOINT}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data)
    });
    const json = await response.json();
    return json.data.getAllClient.getAllClientOut;
}


export async function getApi(id) {
    const data = { "query": "mutation { getClientById(request:{pId: " + id + "}) { PClient { id name email cellPhone address } } }" };
    const headers = {
        "Content-Type": "application/json",
    };
    const response = await fetch(`${ENDPOINT}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data)
    })
    const json = await response.json();
    return json.data.getClientById.PClient;
}
export async function getApiByName(name) {
     const data = { "query": "mutation { getClientByName(request:{name: \"" + name + "\"}) { getClientByNameQuery { id name email cellPhone address } } }" };
    const headers = {
        "Content-Type": "application/json",
    };
    const response = await fetch(`${ENDPOINT}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data)
    })
    const json = await response.json();
    return json.data.getClientByName.getClientByNameQuery;
}
export async function saveApi(data) {
    const dataSave = { "query": "mutation { insertClient( request: { pClient: { id: 0 address: \"" + data.address + "\" cellPhone: \"" + data.cellPhone + "\" email: \"" + data.email + "\" name: \"" + data.name + "\" } } ) }" };
    const headers = {
        "Content-Type": "application/json",
    };
    return await fetch(`${ENDPOINT}`, {
        method: "POST",
        headers,
        body: JSON.stringify(dataSave)
    }).then(r => {
        return r.status;
    });
}
export async function saveMultipleApi(request) {

    const data = { "query": "mutation { insertMultipleClient( request: " + request + " ) }" };
    const headers = {
        "Content-Type": "application/json",
    };
    return await fetch(`${ENDPOINT}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data)
    }).then(r => {
        return r.status;
    });
}
export async function deleteApi(id) {
    const data = { "query": "mutation { deleteClient(request:{pId: " + id + "}) { deleteClientOut } }" };
    const headers = {
        "Content-Type": "application/json",
    };
    return await fetch(`${ENDPOINT}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data)
    }).then(r => {
        return r.status;
    });
}
export async function updateApi(data) {
   const dataSave = { "query": "mutation { updateClient( request: { pClient: { id: " + data.id + " address: \"" + data.address + "\" cellPhone: \"" + data.cellPhone + "\" email: \"" + data.email + "\" name: \"" + data.name + "\" } } ) }" };
    const headers = {
        "Content-Type": "application/json",
    };
    return await fetch(`${ENDPOINT}`, {
        method: "POST",
        headers,
        body: JSON.stringify(dataSave)
    }).then(r => {
        return r.status;
    });
}



