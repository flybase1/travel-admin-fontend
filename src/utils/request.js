// 引入axios
import axios from "axios";
import store from "@/store";
import router from "@/router";
import { Message } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

/*import {XCStore} from "../store/XCStore.js"


const store = XCStore()*/
/*import store from "../store/XCStore.js"*/

let baseUrl = "http://localhost:9000/api";
// 创建axios实例
const httpService = axios.create({
  // url前缀-'http:xxx.xxx'
  // baseURL: process.env.BASE_API, // 需自定义
  baseURL: "http://localhost:9000/api",
  // 请求超时时间
  timeout: 100 * 1000, // 需自定义
});

//添加请求和响应拦截器
// 添加请求拦截器
httpService.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // console.log("store=" + store.getters.GET_TOKEN);
    // config.headers["token"] = store.getters.GET_TOKEN;
    // config.headers["Content-Type"] = "application/json";
    //console.log(sessionStorage.getItem("token"));
    config.headers.token = sessionStorage.getItem("token");
    /*console.log("store=" + store.GET_TOKEN)*/
    /*console.log("store="+store.GET_TOKEN)
                                                                                            config.headers.token=store.GET_TOKEN*/
    return config;
  },
  function (error) {
    //console.log("error:", error);
    // 对请求错误做些什么
    const res = error.response.data;
    console.log(res);
    if (res.code === 40102) {
      console.log(res.message);
      ElMessage.error(res.message);
    }
    return Promise.reject(error);
  }
);

// 添加响应拦截器
httpService.interceptors.response.use(
  function (response) {
    console.log("response:", response);
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    //console.log("response error==>", error.response);

    const res = error.response.data;
    console.log(res);
    if (res.code === 40102) {
      console.log(res.message);
      ElMessage.error(res.message);
      router.push("/login");
    }
    // if (error.response && error.response.status === 500) {
    //   Message.error("token已经过期,请先登录!");
    //   setTimeout(() => {
    //     // router.push("/login");
    //   }, 1000);
    //}
    // if (error.code === 500) {
    //   ElMessage.error(error.data.message);
    // }
    return Promise.reject(error);
  }
);

/*网络请求部分*/

/*
 *  get请求
 *  url:请求地址
 *  params:参数
 * */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: "get",
      params: params,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/*
 *  post请求
 *  url:请求地址
 *  params:参数
 * */
export function post(url, params = {}) {
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: "post",
      data: params,
    })
      .then((response) => {
        console.log(response);
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

export function put(url, params = {}) {
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: "put",
      data: params,
    })
      .then((response) => {
        console.log(response);
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

export function deleteR(url, params = {}) {
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: "delete",
      data: params,
    })
      .then((response) => {
        console.log(response);
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

/*
 *  文件上传
 *  url:请求地址
 *  params:参数
 * */
export function fileUpload(url, params = {}) {
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: "post",
      data: params,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getServerUrl() {
  return baseUrl;
}

export default {
  get,
  post,
  put,
  deleteR,
  fileUpload,
  getServerUrl,
};
