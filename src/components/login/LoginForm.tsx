'use client';

import React, { useState, useCallback, useMemo } from 'react';
import styles from '@/styles/pages/login/login.module.scss';
import { LoginFormData, FormErrors, isFormEmpty } from '@/utils/validation/loginValidation';
import Checkbox from '@/components/common/Checkbox';

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

    const handleInputChange = useCallback((field: keyof Omit<LoginFormData, 'rememberMe'>) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    }, []);

    const handleRememberMeToggle = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            rememberMe: !prev.rememberMe
        }));
    }, []);

    const isFormDisabled = useMemo(() => {
        return isLoading || isFormEmpty(formData);
    }, [isLoading, formData]);

    const handleSubmit = useCallback(async () => {
        if (isFormDisabled) return;
        await onSubmit(formData);
    }, [formData, onSubmit, isFormDisabled]);

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
                                onKeyDown={handleKeyPress}
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
                                onKeyDown={handleKeyPress}
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
                                onKeyDown={handleKeyPress}
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

                    <div className={styles.checkboxSection}>
                        <Checkbox
                            checked={formData.rememberMe}
                            onChange={handleRememberMeToggle}
                            label="로그인 정보 저장"
                            disabled={isLoading}
                        />
                    </div>

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
