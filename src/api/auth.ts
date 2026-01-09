import $axios from '@/api/axios';
import {getOriginURL} from '@/api/API_URL';

export interface LoginFormAPI {
    username: string;
    password: string;
}

export interface UpdateAuthFormAPI {
    clubId: string;
    zoneId: string;
}

export const postLogin = async (data: LoginFormAPI) => {
    const res = await $axios({
        url: `${getOriginURL('api', '/auth/login')}`,
        method: 'post',
        data,
    });
    return res.data;
};

export const patchLogin = async (data: UpdateAuthFormAPI) => {
    const res = await $axios({
        url: `${getOriginURL('api', '/auth/login')}`,
        method: 'patch',
        data,
    });
    return res.data;
};