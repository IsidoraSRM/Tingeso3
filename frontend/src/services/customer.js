import { data } from "react-router-dom";
import httpClient from "../http-common";

const getAllCustomers = () => {
    return httpClient.get("/customers/all");
};
const createCustomer = data => {    
    return httpClient.post("/customers/create", data);
}


export default { getAllCustomers,createCustomer };