import axios from "axios";

// axios.defaults.baseURL = "http://localhost:5000"; // backend server
// axios.defaults.withCredentials = true; // send cookies (token)

// export default axios;

const instance = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
});

export default instance;

