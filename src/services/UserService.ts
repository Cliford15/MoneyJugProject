import axios from "axios";

const REST_API_BASE_URL = "/api/users";

export const createUser = (user: any) => axios.post(REST_API_BASE_URL, user);