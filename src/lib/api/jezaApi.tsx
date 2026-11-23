import axios from "axios";

export const jezaApi = axios.create({
  baseURL: "https://api.cbinformatica.net:9089",
  headers: {
    "Content-Type": "text/plain; charset=UTF-8; application/json",
    // "Content-Type": "application/json",
    Accept: "*",
  },
});
