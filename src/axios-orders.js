import axios from "axios";

const instance = axios.create({
  baseURL: "https://burger-builder-224fe.firebaseio.com/"
});

export default instance;
