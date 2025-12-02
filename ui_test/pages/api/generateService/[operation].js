import fetchWrapper from '../../../helpers/fetch-wrapper';

const API_ENDPOINT = "http://localhost:8083";
const GET = `${API_ENDPOINT}/api/get`;
const SAVE = `${API_ENDPOINT}/api/save`;
const DELETE = `${API_ENDPOINT}/api/delete`;
const UPDATE = `${API_ENDPOINT}/api/update`;

export default async function handler(req, res) {
  const { operation, id } = req.query
  if (req.method === 'POST') {
    try {
      let result = ""
      switch (operation) {
        case "get":
          console.log("-----------------------GET----------------------------  ")
          console.log("GET:  " + GET)
          console.log("body:  " + JSON.stringify(req.body))
          result = await (fetchWrapper.post(`${GET}`, JSON.stringify(req.body)));
          res.status(200).json(result);
          break;
        case "save":
          console.log("-----------------------SAVE----------------------------  ")
          console.log("SAVE:  " + SAVE)
          result = await (fetchWrapper.post(`${SAVE}`, JSON.stringify(req.body)));
          res.status(200).json(result);
          break;
        case "delete":
          console.log("-----------------------DELETE----------------------------  ")
          console.log("DELETE:  " + DELETE)
          result = await (fetchWrapper.post(`${DELETE}`, JSON.stringify(req.body)));
          res.status(200).json(result);
          break;
        case "update":
          console.log("-----------------------UPDATE----------------------------  ")
          console.log("UPDATE:  " + UPDATE)
          result = await (fetchWrapper.post(`${UPDATE}`, JSON.stringify(req.body)));
          res.status(200).json(result);
          break;
      }

    } catch (err) {
      res.status(500).json({ error: 'failed to load data', msg: err.message })
    }
  }
}