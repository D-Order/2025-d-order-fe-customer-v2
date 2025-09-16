import axios from "axios";

// 부스 이름 API 응답 타입
export interface BoothNameResponseV2 {
  status: number;
  message: string;
  code: number;
  data: {
    booth_id: number;
    booth_name: string;
  };
}

// 테이블 입장 API 응답 타입
export interface TableEnterResponse {
  status: string;
  message: string;
  code: number;
  data: {
    table_num: number;
    booth_id: number;
    booth_name: string;
    table_status: string;
  };
}

// 부스 이름 가져오기
export const fetchBoothName = async (boothId: string): Promise<string> => {
  try {
    const numericBoothId = parseInt(boothId, 10);

    if (isNaN(numericBoothId) || numericBoothId <= 0) {
      return "부스 이름";
    }

    const response = await axios.get<BoothNameResponseV2>(
      `${
        import.meta.env.VITE_BASE_URL
      }api/v2/booth/tables/name/?booth_id=${numericBoothId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.status === 200 && response.data.data) {
      return response.data.data.booth_name || "부스 이름";
    }

    return "부스 이름";
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("부스 이름 조회 실패:", error.response.data);
    }
    return "부스 이름";
  }
};

// 테이블 입장 처리
export const enterTable = async (
  boothId: string,
  tableNum: string
): Promise<TableEnterResponse> => {
  const numericBoothId = parseInt(boothId, 10);
  const numericTableNum = parseInt(tableNum, 10);

  // 유효성 검사
  if (isNaN(numericBoothId) || numericBoothId <= 0) {
    throw new Error("유효하지 않은 부스 ID입니다.");
  }
  if (isNaN(numericTableNum) || numericTableNum <= 0) {
    throw new Error("유효하지 않은 테이블 번호입니다.");
  }

  const response = await axios.post<TableEnterResponse>(
    `${import.meta.env.VITE_BASE_URL}api/v2/tables/enter/`,
    {
      booth_id: numericBoothId,
      table_num: numericTableNum,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  return response.data;
};
