import axios from "axios";
const API_URL = "http://localhost:5000/nhan_vien";

export const getEmployees = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};
