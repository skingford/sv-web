import { defHttp } from '../utils/alova';
import type { LoginReq, LoginResp } from './types';

export const login = (data: LoginReq) => {
	return defHttp.Post<LoginResp>('/v1/auth/login', { ...data }, { meta: { ignoreToken: true } });
};
