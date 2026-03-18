import axios from "axios";

// axios.defaults.baseURL = "http://localhost:5000"; // backend server
// axios.defaults.withCredentials = true; // send cookies (token)

// export default axios;

const instance = axios.create({
    baseURL: "https://earnest-clafoutis-371f94.netlify.app",
    withCredentials: true,
});

export default instance;

