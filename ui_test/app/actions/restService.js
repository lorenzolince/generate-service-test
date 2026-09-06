"use server";

const API_ENDPOINT = process.env.API_ENDPOINT || "http://localhost:8080";
const GET_ALL = `${API_ENDPOINT}/api/getAllClient`;
const GET = `${API_ENDPOINT}/api/getClientById`;
const GET_NAME = `${API_ENDPOINT}/api/getClientByName`;
const SAVE = `${API_ENDPOINT}/api/insertClient`;
const SAVE_MULTIPLE = `${API_ENDPOINT}/api/insertMultipleClient`;
const DELETE = `${API_ENDPOINT}/api/deleteClient`;
const UPDATE = `${API_ENDPOINT}/api/updateClient`;

export async function getAllApi() {
    const headers = { "Content-Type": "application/json" };
    const response = await fetch(`${GET_ALL}`, {
        method: "POST",
        headers,
        body: null
    });
    const json = await response.json();
    return json.getAllClientOut; 
}


export async function getApi(id) {
    const data = { "pId": id }
    const headers = {
        "Content-Type": "application/json",
    };
     const response =  await fetch(`${GET}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data)
    })
    const json = await response.json();
    return json.pClient; 
}
export async function getApiByName(name) {
    const data = { "name": name }
    const headers = {
        "Content-Type": "application/json",
    };
     const response =  await fetch(`${GET_NAME}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data)
    })
    const json = await response.json();
    return json.getClientByNameQuery;
}
export async function saveApi(data) {
        const dataSave = {
            "pClient": data
        }
    const headers = {
        "Content-Type": "application/json",
    };
    return await fetch(`${SAVE}`, {
        method: "POST",
        headers,
        body: JSON.stringify(dataSave)
    }).then(r => {
        return r.status;
    });
}
export async function saveMultipleApi(data) {
    const headers = {
        "Content-Type": "application/json",
    };
    return await fetch(`${SAVE_MULTIPLE}`, {
        method: "POST",
        headers,
        body: data
    }).then(r => {
        return r.status;
    });
}
export async function deleteApi(id) {
    const data = { "pId": id };
    const headers = {
        "Content-Type": "application/json",
    };
    return await fetch(`${DELETE}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data)
    }).then(r => {
        return r.status;
    });
}
export async function updateApi(data) {
     const dataSave = {
            "pClient": data
        }
    const headers = {
        "Content-Type": "application/json",
    };
    return await fetch(`${UPDATE}`, {
        method: "POST",
        headers,
        body: JSON.stringify(dataSave)
    }).then(r => {
        return r.status;
    });
}



