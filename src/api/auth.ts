import $axios from '@/api/axios';
import {getOriginURL} from '@/api/API_URL';

export interface LoginFormAPI {
    username: string;
    password: string;
}

export interface LoginResponseAPI {
    groupId: number;
    groupNm: string;
    groupType: string;
    userId: string;
    userNm: string;
    initSt: string;
    clubId: string;
    clubLogo: string;
}

export const postLogin = async (data: LoginFormAPI): Promise<LoginResponseAPI> => {
    const res = await $axios({
        url: `${getOriginURL('api', '/auth/login')}`,
        method: 'post',
        data,
    });
    return res.data;
};

export const getMenuHisList = async (): Promise<string[]> => {
    const res = await $axios({
        url: `${getOriginURL('api', '/fnb/v1/menu/his')}`,
        method: 'get',
    });
    return res.data;
};

export const patchLogin = async () => {
    const res = await $axios({
        url: `${getOriginURL('api', '/auth/login')}`,
        method: 'patch',
        data: {},
    });
    return res.data;
};