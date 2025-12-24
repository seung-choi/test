'use client';

import React, { useState, useCallback, useMemo } from 'react';
import styles from '@/styles/pages/login/login.module.scss';
import { LoginFormData, FormErrors, isFormEmpty } from '@/utils/validation/loginValidation';

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => Promise<void>;
    errors?: FormErrors;
    isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, errors = {}, isLoading = false }) => {
    const [formData, setFormData] = useState<LoginFormData>({
        clubCode: '',
        username: '',
        password: '',
        rememberMe: false
    });

    // 입력 필드 변경 핸들러
    const handleInputChange = useCallback((field: keyof Omit<LoginFormData, 'rememberMe'>) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    }, []);

    // 체크박스 토글 핸들러
    const handleRememberMeToggle = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            rememberMe: !prev.rememberMe
        }));
    }, []);

    // 버튼 비활성화 조건: 로딩 중이거나 필수 필드가 비어있을 때
    const isFormDisabled = useMemo(() => {
        return isLoading || isFormEmpty(formData);
    }, [isLoading, formData]);

    // 폼 제출 핸들러
    const handleSubmit = useCallback(async () => {
        if (isFormDisabled) return;
        await onSubmit(formData);
    }, [formData, onSubmit, isFormDisabled]);

    // Enter 키 핸들러
    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isFormDisabled) {
            handleSubmit();
        }
    }, [handleSubmit, isFormDisabled]);

    return (
        <div className={styles.loginContainer}>
            <div className={styles.backgroundOverlay} />

            <div className={styles.formWrapper}>
                <div className={styles.formContainer}>
                    {/* 클럽코드 */}
                    <div className={styles.inputGroup}>
                        <div className={styles.labelWrapper}>
                            <label className={styles.label}>클럽코드</label>
                        </div>
                        <div className={`${styles.inputWrapper} ${errors.clubCode ? styles.error : ''}`}>
                            <input
                                type="text"
                                className={styles.input}
                                value={formData.clubCode}
                                onChange={handleInputChange('clubCode')}
                                onKeyPress={handleKeyPress}
                                placeholder="클럽코드를 입력하세요"
                                disabled={isLoading}
                                autoComplete="organization"
                            />
                        </div>
                    </div>

                    {errors.clubCode && (
                        <div className={styles.errorMessage}>
                            <div className={styles.errorIcon}>
                                <img src='/assets/image/login/alert.svg' alt='alert'/>
                            </div>
                            <span className={styles.errorText}>{errors.clubCode}</span>
                        </div>
                    )}

                    {/* 아이디 */}
                    <div className={styles.inputGroup}>
                        <div className={styles.labelWrapper}>
                            <label className={styles.label}>아이디</label>
                        </div>
                        <div className={`${styles.inputWrapper} ${errors.username ? styles.error : ''}`}>
                            <input
                                type="text"
                                className={styles.input}
                                value={formData.username}
                                onChange={handleInputChange('username')}
                                onKeyPress={handleKeyPress}
                                placeholder="아이디를 입력하세요"
                                disabled={isLoading}
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    {errors.username && (
                        <div className={styles.errorMessage}>
                            <div className={styles.errorIcon}>
                                <img src='/assets/image/login/alert.svg' alt='alert'/>
                            </div>
                            <span className={styles.errorText}>{errors.username}</span>
                        </div>
                    )}

                    {/* 비밀번호 */}
                    <div className={styles.inputGroup}>
                        <div className={styles.labelWrapper}>
                            <label className={styles.label}>비밀번호</label>
                        </div>
                        <div className={`${styles.inputWrapper} ${errors.password ? styles.error : ''}`}>
                            <input
                                type="password"
                                className={styles.input}
                                value={formData.password}
                                onChange={handleInputChange('password')}
                                onKeyPress={handleKeyPress}
                                placeholder="비밀번호를 입력하세요"
                                disabled={isLoading}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    {errors.password && (
                        <div className={styles.errorMessage}>
                            <div className={styles.errorIcon}>
                                <img src='/assets/image/login/alert.svg' alt='alert'/>
                            </div>
                            <span className={styles.errorText}>{errors.password}</span>
                        </div>
                    )}

                    {/* 로그인 정보 저장 */}
                    <div className={styles.checkboxWrapper}>
                        <div
                            className={`${styles.checkbox} ${formData.rememberMe ? styles.checked : ''}`}
                            onClick={handleRememberMeToggle}
                            role="checkbox"
                            aria-checked={formData.rememberMe}
                            tabIndex={0}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleRememberMeToggle();
                                }
                            }}
                        >
                            {formData.rememberMe && (
                                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.08333 4.25C6.33189 4.25 5.61122 4.54851 5.07986 5.07986C4.54851 5.61122 4.25 6.33189 4.25 7.08333V26.9167C4.25 27.6681 4.54851 28.3888 5.07986 28.9201C5.61122 29.4515 6.33189 29.75 7.08333 29.75H26.9167C27.6681 29.75 28.3888 29.4515 28.9201 28.9201C29.4515 28.3888 29.75 27.6681 29.75 26.9167V7.08333C29.75 6.33189 29.4515 5.61122 28.9201 5.07986C28.3888 4.54851 27.6681 4.25 26.9167 4.25H7.08333ZM24.0125 13.8777C24.2783 13.612 24.4277 13.2517 24.4279 12.8759C24.428 12.5001 24.2788 12.1396 24.0132 11.8738C23.7476 11.608 23.3872 11.4586 23.0114 11.4584C22.6356 11.4583 22.2752 11.6074 22.0093 11.8731L14.9968 18.8856L11.9921 15.8808C11.8606 15.7492 11.7044 15.6448 11.5325 15.5735C11.3606 15.5022 11.1764 15.4655 10.9903 15.4655C10.6145 15.4653 10.254 15.6145 9.98821 15.8801C9.72238 16.1458 9.57297 16.5061 9.57284 16.8819C9.57271 17.2577 9.72186 17.6182 9.9875 17.884L13.8947 21.7912C14.0394 21.9359 14.2112 22.0508 14.4003 22.1292C14.5894 22.2075 14.7921 22.2479 14.9968 22.2479C15.2015 22.2479 15.4042 22.2075 15.5934 22.1292C15.7825 22.0508 15.9543 21.9359 16.099 21.7912L24.0125 13.8777Z" fill="black"/>
                                </svg>
                            )}
                        </div>
                        <label
                            className={styles.checkboxLabel}
                            onClick={handleRememberMeToggle}
                        >
                            로그인 정보 저장
                        </label>
                    </div>

                    {/* 로그인 버튼 */}
                    <button
                        className={`${styles.loginButton} ${isLoading ? styles.loading : ''}`}
                        onClick={handleSubmit}
                        disabled={isFormDisabled}
                        type="button"
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
