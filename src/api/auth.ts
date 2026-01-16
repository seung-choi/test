import $axios from '@/api/axios';
import { getOriginURL } from '@/api/API_URL';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { LoginFormAPI, LoginResponseAPI } from '@/types/api/auth.type';

export type { LoginFormAPI, LoginResponseAPI };

export const postLogin = async (data: LoginFormAPI): Promise<LoginResponseAPI> => {
    const res = await $axios({
        url: `${getOriginURL('api')}${API_ENDPOINTS.AUTH.LOGIN}`,
        method: 'post',
        data,
    });
    return res.data;
};

export const getMenuHisList = async (): Promise<string[]> => {
    const res = await $axios({
        url: `${getOriginURL('api')}${API_ENDPOINTS.AUTH.MENU_HISTORY}`,
        method: 'get',
    });
    return res.data;
};

export const patchLogin = async () => {
    const res = await $axios({
        url: `${getOriginURL('api')}${API_ENDPOINTS.AUTH.LOGIN}`,
        method: 'patch',
        data: {},
    });
    return res.data;
};