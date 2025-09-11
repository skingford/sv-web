import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';

export const defHttp = createAlova({
	baseURL: 'https://stroller-client.wegui.cn',
	timeout: 60 * 1000,
	requestAdapter: adapterFetch(),
	beforeRequest(method) {
		console.log('beforeRequest:', method);
		if (!method.meta?.ignoreToken) {
			method.config.headers.authorization = 'xxx';
		}
	},
	responded: {
		onSuccess: async (response, method) => {
			console.log('onSuccess:', response, method);
			const respData = await response.json();
			if (response.status >= 400) {
				const { err_msg, err_code } = respData || {};
				const message = err_code ? `${err_msg}(${err_code})` : `${err_msg || response.statusText}`;
				// TODO: 优化
				alert(message);
				throw new Error(respData);
			}

			if (method.meta?.isDownload) {
				return response.blob();
			}

			return respData;
		},
		onError: (err, method) => {
			console.log('onError:', err, method);
		},

		onComplete: async (method) => {
			console.log('onComplete:', method);
		}
	}
});
