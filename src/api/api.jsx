
import axios from 'axios';

const api = "";            //接口固定地址
const tokens = localStorage.getItem("tokens");
// http://hd2020.py6.com


// 注册页面接口调用
export function _register(data) {
  return axios.post(api+'/merchant/Reg/index', data)
  // return axios.post('/merchant/Reg/index', data, {headers: {AppAuthorization: 'hikhkhkhkjhh'}})  加了token
}