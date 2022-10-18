import axios from "axios";
export function login() {
  return axios.get("/posts/1");
  // return Promise.resolve({
  //   data: {
  //     token: "hahaha",
  //   },
  // });
}

export function getUserInfo() {}

export function logout() {}
