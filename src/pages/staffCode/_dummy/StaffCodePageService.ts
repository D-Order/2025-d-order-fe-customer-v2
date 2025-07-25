// API 연동 전 더미 데이터

// API 요청 타입 정의
export interface VerifyCodeRequest {
  code: string;
}

// API 응답 타입 정의
export interface VerifyCodeResponse {
  success: boolean;
  message?: string;
}

export interface TableOrderInfo {
  tableNumber: number;
  totalPrice: number;
}

const STAFF_CODE = "1234"; // 직원 코드

// 테이블 정보 더미 데이터
const TABLE_INFO = {
  tableNumber: 9,
  numberOfPeople: 4,
  totalPrice: 49000,
};

// 코드 검증 함수 - 나중에 실제 API 호출로 대체될 예정
export const verifyStaffCode = async (code: string): Promise<boolean> => {
  // API 연동 시 실제 호출로 교체
  // return await apiClient.post('/verify-staff-code', { code });

  return new Promise((resolve) => {
    // 실제와 유사한 약간의 지연 효과 추가
    setTimeout(() => {
      resolve(code === STAFF_CODE);
    }, 500);
  });
};

// 테이블 정보 가져오는 함수
export const getTableInfo = async (): Promise<TableOrderInfo> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        tableNumber: TABLE_INFO.tableNumber,
        totalPrice: TABLE_INFO.totalPrice,
      });
    }, 300);
  });
};
