'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/login/LoginForm';
import styles from '@/styles/pages/login/login.module.scss';
import {
    LoginFormData,
    FormErrors,
    validateLoginForm,
    hasErrors
} from '@/utils/validation/loginValidation';
import { useLogin, useMenuHisList } from '@/hooks/api';
import { LoginResponseAPI } from '@/api/auth';
import storage from '@/utils/storage';

const LoginPage: React.FC = () => {
    const router = useRouter();
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const loginMutation = useLogin();
    const { data: menuList, refetch: fetchMenuList } = useMenuHisList({ enabled: false });

    const getSavedClubCode = (): string => {
        const saved = storage.local.get('savedClubCode');
        return (typeof saved === 'string' ? saved : '') || '';
    };

    const handleLogin = useCallback(async (formData: LoginFormData) => {
        try {
            setErrors({});

            const hasSavedClubCode = !!getSavedClubCode();
            const validationErrors = validateLoginForm(formData, hasSavedClubCode);
            if (hasErrors(validationErrors)) {
                setErrors(validationErrors);
                return;
            }

            setIsLoading(true);

            const loginResponse = await loginMutation.mutateAsync({
                username: `${formData.username}@${formData.clubCode}`,
                password: formData.password,
            });

            await handleLoginSuccess(formData, loginResponse);
        } catch (error) {
            handleLoginError(error);
        } finally {
            setIsLoading(false);
        }
    }, [loginMutation]);

    const handleLoginSuccess = async (formData: LoginFormData, loginResponse: LoginResponseAPI) => {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('clubCode', formData.clubCode);
        sessionStorage.setItem('groupId', String(loginResponse.groupId));
        sessionStorage.setItem('groupNm', loginResponse.groupNm);
        sessionStorage.setItem('groupType', loginResponse.groupType);
        sessionStorage.setItem('userId', loginResponse.userId);
        sessionStorage.setItem('userNm', loginResponse.userNm);
        sessionStorage.setItem('initSt', loginResponse.initSt);
        sessionStorage.setItem('clubId', loginResponse.clubId);
        sessionStorage.setItem('clubLogo', loginResponse.clubLogo);

        storage.local.set({ savedClubCode: formData.clubCode });

        const { data: menuPermissions } = await fetchMenuList();

        if (!menuPermissions || menuPermissions.length === 0) {
            setErrors({ clubCode: '메뉴 권한이 없습니다' });
            return;
        }

        const hasAllAccess = menuPermissions.some((menu: string) => menu.includes('FNB'));
        const hasLoungeAccess = menuPermissions.some((menu: string) => menu.includes('LOUNGE'));
        const hasOrderAccess = menuPermissions.some((menu: string) => menu.includes('ORDER'));

        if (hasAllAccess) {
            router.push('/admin/lounge');
        } else if (hasLoungeAccess) {
            router.push('/admin/lounge');
        } else if (hasOrderAccess) {
            router.push('/order/main')
        } else {
            setErrors({ clubCode: '접근 권한이 없습니다' });
        }
    };

    const handleLoginError = (error: unknown) => {
        console.error('Login failed:', error);

        const errorCode = (error as any)?.response?.data?.code || (error as any)?.message || 'UNKNOWN_ERROR';

        switch (errorCode) {
            case 'CLUBCODE_INVALID':
                setErrors({ clubCode: '존재하지 않는 코드입니다' });
                break;
            case 'USERNAME_INVALID':
                setErrors({ username: '존재하지 않는 아이디입니다' });
                break;
            case 'PASSWORD_INVALID':
                setErrors({ password: '비밀번호가 일치하지 않습니다' });
                break;
            case 'NETWORK_ERROR':
            case 'ECONNABORTED':
                setErrors({ clubCode: '네트워크 오류가 발생했습니다' });
                break;
            default:
                setErrors({ clubCode: '로그인에 실패했습니다' });
        }
    };

    return (
        <>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <img src='/assets/image/login/logo.svg' alt='vgolf'/>
                </div>
            </div>

            <LoginForm
                onSubmit={handleLogin}
                errors={errors}
                isLoading={isLoading}
            />
        </>
    );
};

export default LoginPage;
