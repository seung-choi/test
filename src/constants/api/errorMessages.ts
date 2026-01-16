export const ERROR_MESSAGES = {
    // 400 Bad Request
    BAD_REQUEST: '요청 정보를 확인해주세요.',
    INVALID_PARAMETER: '입력 정보가 올바르지 않습니다.',
    VALIDATION_FAILED: '입력 정보를 다시 확인해주세요.',

    // 401 Unauthorized
    UNAUTHORIZED: '로그인이 필요합니다.',
    JWT_EXPIRED_TOKEN: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
    JWT_INVALID_TOKEN: '인증 정보가 올바르지 않습니다. 다시 로그인해주세요.',

    // 403 Forbidden
    FORBIDDEN: '접근 권한이 없습니다.',
    ACCESS_DENIED: '해당 기능에 대한 권한이 없습니다.',

    // 404 Not Found
    NOT_FOUND: '요청하신 정보를 찾을 수 없습니다.',

    // 409 Conflict
    CONFLICT: '이미 처리된 요청입니다.',
    DUPLICATE: '중복된 정보가 존재합니다.',

    // 500 Internal Server Error
    INTERNAL_SERVER_ERROR: '서버에 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',

    // Network
    NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
    TIMEOUT: '서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.',

    // Default
    DEFAULT: '오류가 발생했습니다. 관리자에게 문의해주세요.',
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;

export const ERROR_STATUS_MESSAGE_MAP: Record<number, ErrorMessageKey> = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    500: 'INTERNAL_SERVER_ERROR',
};
