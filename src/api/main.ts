import $axios from '@/api/axios';
import { getOriginURL } from '@/api/API_URL';

export interface LoginFormAPI {
  username: string;
  password: string;
}

export interface PasswordFormAPI {
  oldPassword: string;
  newPassword: string;
}

export const postLogin = async (data: LoginFormAPI) => {
  const res = await $axios({
    url: `${getOriginURL('api', '/auth/login')}`,
    method: 'post',
    data,
  });
  return res.data;
};

export const patchPassword = async (data: PasswordFormAPI) => {
  const res = await $axios({
    url: '/password',
    method: 'patch',
    data,
  });
  return res.data;
};
