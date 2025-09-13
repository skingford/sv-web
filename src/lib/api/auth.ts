import { defHttp } from '../utils/alova';

export interface LoginReq {
	account: string;
	password: string;
	captcha?: string;
	captcha_id?: string;
}

export interface LoginResp {
	id: string;
	access_token: string;
}

export const login = (data: LoginReq) => {
	return defHttp.Post<LoginResp>('/auth/login', { data, meta: { ignoreToken: true } });
};
