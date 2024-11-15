// src/utils/request.js
import axios from 'axios';

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:9090', // 这里可以改成你的后端接口地址
  timeout: 5000, // 请求超时的时间
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理，比如加入 Token
    // 例如：config.headers['Authorization'] = 'Bearer ' + token
    config.headers['Content-Type']='application/json;charset=utf-8';
    return config;
  },
  error => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    let res=response.data;
    if(typeof res==='string'){//如果返回的是字符串进行解析
        res=res?JSON.parse(res):res
    }
    return res;
    // 对响应数据进行处理
    return response.data; // 这里可以直接返回后台数据（去掉外层的 {data: xxx}）
  },
  error => {
    // 响应错误处理
    console.error('err'+error);
    return Promise.reject(error);
  }
);

export default request;
