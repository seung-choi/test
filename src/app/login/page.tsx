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

/**
 * 로그인 페이지
 * - 비즈니스 로직 처리
 * - API 호출
 * - 라우팅
 * - localStorage 관리
 */
const LoginPage: React.FC = () => {
    const router = useRouter();
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    /**
     * 로그인 API 호출 (현재는 목업)
     */
    const loginAPI = async (credentials: LoginFormData): Promise<void> => {
        // 실제 환경에서는 여기서 API 호출
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 클럽코드 검증
                if (credentials.clubCode !== 'VGOLF') {
                    reject(new Error('CLUBCODE_INVALID'));
                    return;
                }

                // 아이디 검증
                if (credentials.username !== 'admin') {
                    reject(new Error('USERNAME_INVALID'));
                    return;
                }

                // 비밀번호 검증
                if (credentials.password !== 'password') {
                    reject(new Error('PASSWORD_INVALID'));
                    return;
                }

                // 로그인 성공
                resolve();
            }, 800); // 네트워크 딜레이 시뮬레이션
        });
    };

    /**
     * 로그인 처리 핸들러
     */
    const handleLogin = useCallback(async (formData: LoginFormData) => {
        try {
            // 에러 초기화
            setErrors({});

            // 1. 클라이언트 측 validation
            const validationErrors = validateLoginForm(formData);
            if (hasErrors(validationErrors)) {
                setErrors(validationErrors);
                return;
            }

            // 2. 로딩 시작
            setIsLoading(true);

            // 3. API 호출
            await loginAPI(formData);

            // 4. 로그인 성공 처리
            handleLoginSuccess(formData);
        } catch (error: any) {
            // 5. 에러 처리
            handleLoginError(error);
        } finally {
            // 6. 로딩 종료
            setIsLoading(false);
        }
    }, []);

    /**
     * 로그인 성공 처리
     */
    const handleLoginSuccess = (formData: LoginFormData) => {
        // localStorage에 저장
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('clubCode', formData.clubCode);

        // 로그인 정보 저장 옵션이 체크되어 있으면
        if (formData.rememberMe) {
            localStorage.setItem('rememberedUser', formData.username);
            localStorage.setItem('rememberedClubCode', formData.clubCode);
        } else {
            // 체크 해제 시 저장된 정보 삭제
            localStorage.removeItem('rememberedUser');
            localStorage.removeItem('rememberedClubCode');
        }

        // 관리자 페이지로 이동
        router.push('/admin/lounge');
    };

    /**
     * 로그인 에러 처리
     */
    const handleLoginError = (error: any) => {
        console.error('Login failed:', error);

        const errorCode = error?.message || 'UNKNOWN_ERROR';

        // 에러 코드에 따른 메시지 설정
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
                setErrors({ clubCode: '네트워크 오류가 발생했습니다' });
                break;
            default:
                setErrors({ clubCode: '로그인에 실패했습니다' });
        }
    };

    return (
        <>
            {/* 헤더 */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <img src='/assets/image/login/logo.svg' alt='vgolf'/>
                </div>
            </div>

            {/* 로그인 폼 */}
            <LoginForm
                onSubmit={handleLogin}
                errors={errors}
                isLoading={isLoading}
            />
        </>
    );
};

export default LoginPage;
