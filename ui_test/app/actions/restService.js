"use server";

const REST_BASE_URL = "http://localhost:8080";
const GET_ALL = `${REST_BASE_URL}/api/getAllClient`;
const GET = `${REST_BASE_URL}/api/getClientById`;
const GET_NAME = `${REST_BASE_URL}/api/getClientByName`;
const SAVE = `${REST_BASE_URL}/api/insertClient`;
const SAVE_MULTIPLE = `${REST_BASE_URL}/api/insertMultipleClient`;
const DELETE = `${REST_BASE_URL}/api/deleteClient`;
const UPDATE = `${REST_BASE_URL}/api/updateClient`;

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



