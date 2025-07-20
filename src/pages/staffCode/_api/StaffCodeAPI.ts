import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

// 테이블 번호와 부스 ID를 헤더에 포함하는 인스턴스 생성
const table_num = localStorage.getItem("tableNum");
const booth_id = localStorage.getItem("boothId");

export const staffCodeApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Booth-Id": booth_id,
    "X-Table-Number": table_num,
  },
});

staffCodeApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const boothId = localStorage.getItem("boothId");
    const tableNum = localStorage.getItem("tableNum");

    config.headers["X-Booth-Id"] = boothId || "";
    config.headers["X-Table-Number"] = tableNum || "";

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// API 응답 타입 정의
export interface OrderCheckResponse {
  status: string;
  message: string;
  code: number;
  data: {
    table_id: number;
    table_num: number;
    total_price: number;
  } | null;
}

// 직원 코드 검증 응답 타입
export interface VerifyCodeResponse {
  status: string;
  message: string;
  code: number;
  data: {
    table_id: number;
    table_num: number;
    people_count: number;
    total_price: number;
  } | null;
}

// 프론트엔드에서 사용하는 타입
export interface TableOrderInfo {
  tableNumber: number;
  totalPrice: number;
}

// 직원 코드 검증 API
export const verifyStaffCode = async (code: string): Promise<boolean> => {
  try {
    // POST 요청으로 직원 코드 검증
    const response = await staffCodeApi.post<VerifyCodeResponse>(
      "/api/tables/order_check/",
      {
        order_check_password: code,
      }
    );

    // status가 success인지 확인하여 성공 여부 반환
    return response.data.status === "success";
  } catch (error: unknown) {
    // 401 에러는 비밀번호가 올바르지 않은 경우
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.status === 401
    ) {
      return false;
    }

    // 기타 에러도 검증 실패로 처리
    return false;
  }
};

// 테이블 주문 정보 확인 API
export const fetchTableOrderInfo = async (): Promise<TableOrderInfo | null> => {
  try {
    const response = await staffCodeApi.get<OrderCheckResponse>(
      "/api/tables/order_check/"
    );

    if (response.data.status === "success" && response.data.data) {
      return {
        tableNumber: response.data.data.table_num,
        totalPrice: response.data.data.total_price,
      };
    }

    return null;
  } catch (error: unknown) {
    // 404 에러의 경우는 진행 중인 주문이 없다는 예상된 에러이므로 null 반환
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.status === 404
    ) {
      return null;
    }

    // 기타 예상치 못한 에러는 throw
    throw error;
  }
};
