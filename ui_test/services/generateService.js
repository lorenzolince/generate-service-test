import fetchWrapper from '../helpers/fetch-wrapper';
const GET = '/api/generateService/get';
const SAVE = '/api/generateService/save';

const loginService = {
    getApiService: async (data) => {
        return await (fetchWrapper.post(`${GET}`, JSON.stringify(data)));
    }, saveApiService: async (data) => {
        return await (fetchWrapper.post(`${SAVE}`, JSON.stringify(data)));
    },
}

export default loginService;
