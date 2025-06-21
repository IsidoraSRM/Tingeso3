import httpClient from "../http-common";

const getAll = () => { 
    return httpClient.get("/tariff/all");
}

export default { getAll };