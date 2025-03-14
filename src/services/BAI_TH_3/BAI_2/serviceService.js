import axios from "axios";
const API_URL = "http://localhost:5000/dich_vu";

export const getServices = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};
