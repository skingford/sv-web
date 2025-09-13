import { defHttp } from '../utils/alova';

interface LoginReq {
	username: string;
	password: string;
	captcha?: string;
	captcha_id?: string;
}

interface LoginResp {
	id: string; // 用户ID
	access_token: string; // 访问令牌
	expires_in: number; // 过期时间,单位:秒
}

export const login = (data: LoginReq) => {
	return defHttp.Post<LoginResp>('/auth/login', { data, meta: { ignoreToken: true } });
};

export type { LoginReq, LoginResp };
