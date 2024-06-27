import axios from "axios";

const API = axios.create({
  // baseURL: "https://kvh.serveo.net",
  // baseURL: "https://tb-server.onrender.com",
  baseURL: process.env.NEXT_PUBLIC_API ?? "http://localhost:5000",
  // baseURL: "https://travel-buddy-server-two.vercel.app",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token
      }`;
  }
  return req;
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);


class APIRequests {
  static async signIn(data) {
    return await API.post("/auth/login", data);
  }
  static async verifyOTP(data) {
    return await API.post("/auth/otp", data);
  }
  static async signUp(data) {
    return await API.post("/auth/register", data);
  }
  static async setHome(data) {
    return await API.post("/user/home", data);
  }
  static async getHome() {
    return await API.get("/user/home");
  }
  static async getAllUsers() {
    return await API.get("/user/");
  }
  static async sendFriendRequest(id) {
    return await API.post(`/user/friend/${id}`);
  }
  static async acceptFriendRequest(id) {
    return await API.post(`/user/friend/accept/${id}`);
  }
  static async sendChat(data) {
    return await API.post("/user/chat", data);
  }
  static async getChat(data) {
    return await API.post("/user/get/chat", data);
  }
}

export default APIRequests;