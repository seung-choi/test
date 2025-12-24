/**
 * 로그인 폼 Validation 유틸리티
 */

export interface LoginFormData {
  clubCode: string;
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface FormErrors {
  clubCode?: string;
  username?: string;
  password?: string;
}

/**
 * 클럽코드 유효성 검사
 */
export const validateClubCode = (clubCode: string): string | undefined => {
  if (!clubCode || clubCode.trim() === '') {
    return '클럽코드를 입력해주세요';
  }

  // 추가 검증 규칙이 필요하면 여기에 추가
  // 예: 길이, 형식 등

  return undefined;
};

/**
 * 아이디 유효성 검사
 */
export const validateUsername = (username: string): string | undefined => {
  if (!username || username.trim() === '') {
    return '아이디를 입력해주세요';
  }

  // 추가 검증 규칙
  if (username.length < 3) {
    return '아이디는 3자 이상이어야 합니다';
  }

  return undefined;
};

/**
 * 비밀번호 유효성 검사
 */
export const validatePassword = (password: string): string | undefined => {
  if (!password || password.trim() === '') {
    return '비밀번호를 입력해주세요';
  }

  // 추가 검증 규칙
  if (password.length < 4) {
    return '비밀번호는 4자 이상이어야 합니다';
  }

  return undefined;
};

/**
 * 전체 폼 유효성 검사
 */
export const validateLoginForm = (formData: LoginFormData): FormErrors => {
  const errors: FormErrors = {};

  const clubCodeError = validateClubCode(formData.clubCode);
  if (clubCodeError) {
    errors.clubCode = clubCodeError;
  }

  const usernameError = validateUsername(formData.username);
  if (usernameError) {
    errors.username = usernameError;
  }

  const passwordError = validatePassword(formData.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};

/**
 * 폼에 에러가 있는지 확인
 */
export const hasErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};

/**
 * 폼이 비어있는지 확인 (submit 버튼 disable 용도)
 */
export const isFormEmpty = (formData: LoginFormData): boolean => {
  return !formData.clubCode.trim() ||
         !formData.username.trim() ||
         !formData.password.trim();
};
