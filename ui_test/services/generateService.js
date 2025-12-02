import fetchWrapper from '../helpers/fetch-wrapper';
const GET = '/api/generateService/get';
const SAVE = '/api/generateService/save';
const DELETE = '/api/generateService/delete';
const UPDATE = '/api/generateService/update';
const generateService = {
    getApiService: async (data) => {
        return await (fetchWrapper.post(`${GET}`, JSON.stringify(data)));
    }, 
    saveApiService: async (data) => {
        return await (fetchWrapper.post(`${SAVE}`, JSON.stringify(data)));
    },
    Delete: async (data) => {
        return await (fetchWrapper.post(`${DELETE}`, JSON.stringify(data)));
    },
    Update: async (data) => {
        return await (fetchWrapper.post(`${UPDATE}`, JSON.stringify(data)));
    },
}

export default generateService;
