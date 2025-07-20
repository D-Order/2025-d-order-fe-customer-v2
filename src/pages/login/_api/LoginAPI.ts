import axios from "axios";

// 부스 이름 API 응답 타입
export interface BoothNameResponse {
  status: string;
  message: string;
  code: number;
  data: {
    booth_id: number;
    booth_name: string;
    table_num: number;
  };
}

// 부스 이름과 테이블 개수 반환 타입
export interface BoothInfo {
  boothName: string;
  tableCount: number;
}

// 부스 이름 가져오기
export const fetchBoothName = async (boothId: string): Promise<BoothInfo> => {
  try {
    // 문자열 부스 ID를 숫자로 변환
    const numericBoothId = parseInt(boothId, 10);

    // 숫자가 아니면 에러 처리
    if (isNaN(numericBoothId)) {
      return { boothName: "", tableCount: 0 };
    }

    // GET 요청으로 부스 ID를 booth_id라는 쿼리 파라미터로 전달 (숫자 형태로)
    const response = await axios.get<BoothNameResponse>(
      `${
        import.meta.env.VITE_BASE_URL
      }/api/manager/booth-name?booth_id=${numericBoothId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.data.status === "success" && response.data.data) {
      return {
        boothName: response.data.data.booth_name || "",
        tableCount: response.data.data.table_num || 0,
      };
    }

    // 실패 시 빈 값 반환
    return { boothName: "", tableCount: 0 };
  } catch (error) {
    // 에러 상세 정보 출력 (디버깅용)
    if (axios.isAxiosError(error) && error.response) {
    }

    return { boothName: "", tableCount: 0 };
  }
};
