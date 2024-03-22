import axios, { AxiosRequestConfig } from 'axios'
import { LOGIN_IN_URL, BASE_URL } from '../constant/Global'
import Base64 from "base-64";
import { message as GlobalMsg } from 'antd';
const serverConfig = {
	baseURL: BASE_URL,
	useTokenAuthorization: false,
}

const showStatus = (status: number) => {
	let message = ''
	switch (status) {
		case 400:
			message = '请求错误(400)'
			break
		case 401:
			message = '未授权，请重新登录(401)'
			break
		case 402:
			message = '拒绝访问(402)'
			break
		case 404:
			message = '请求出错(404)'
			break
		case 408:
			message = '请求超时(408)'
			break
		case 500:
			message = '服务器错误(500)'
			break
		case 501:
			message = '服务未实现(501)'
			break
		case 502:
			message = '网络错误(502)'
			break
		case 503:
			message = '服务不可用(503)'
			break
		case 504:
			message = '网络超时(504)'
			break
		case 505:
			message = 'HTTP版本不受支持(505)'
			break
		default:
			message = `连接出错(${status})!`
	}
	return `${message}，请检查网络或联系管理员！`
}

const request = axios.create({
	// 是否跨站点访问控制请求
	withCredentials: true,
	baseURL: serverConfig.baseURL,
	timeout: 15000,
	headers: {
		"Content-Type": "application/json",
		// "Channel": "filtest.filcoin.xyz:8900"
		"Channel": "analyzer.imfil.io"
	},
})


request.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		if (serverConfig.useTokenAuthorization) {
			// @ts-ignore
			config.headers["Authorization"] = localStorage.getItem("token");
		}
		if (config.method === "post") {
			// @ts-ignore
			config.headers["content-type"] = "application/x-ww-form-urlencoded";
			// config.data = qs.stringify(config.data); 
			// @ts-ignore
			config.requestType = "form";
		} else {
			// @ts-ignore
			config.headers["content-type"] = "application/json";
		}
		// 返回
		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);

request.interceptors.response.use(
	(res) => {
		return res.data;
	},
	(error) => {
		let message = "";
		if (error && error.response) {
			switch (error.response.status) {
				case 302:
					message = "接口重定向了! ";
					break;
				case 400:
					message = "参数不正确! ";
					break;
				case 401:
					message = "您未登录, 或者登录已经超时, 请先登录! ";
					// TODO: 暂时去掉自动登录功能 —— 2023/07/25
					if (window.location.pathname !== '/') {
						// GlobalMsg.error("Please log in first to access !")
						window.location.href = '/';
					}
					break;
				case 403:
					message = "您还没有权限操作! ";
					break;
				case 404:
					message = `请求地址出错: ${error.response.config.url}`;
					break;
				case 408:
					message = "请求超时! ";
					break;
				case 409:
					message = "系统已存在相同数据! ";
					break;
				case 500:
					message = "服务器内部错误! ";
					break;
				case 501:
					message = "服务未实现! ";
					break;
				case 502:
					message = "回答错误! ";
					break;
				case 503:
					message = "服务不可用";
					break;
				case 504:
					message = "服务暂时无法访问, 请稍后再试";
					break;
				case 505:
					message = "HTTP 版本不受支持! ";
					break;
				default:
					message = "异常问题, 请联系管理员! ";
					break;
			}
		}
		return Promise.reject(message);
	}
);

export default request