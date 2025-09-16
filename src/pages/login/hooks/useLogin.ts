import { useState } from "react";
import { enterTable } from "../_api/LoginAPI";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";

// 테이블 입장 API 응답 타입
interface TableEnterResponse {
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

export const useLogin = (boothId: string | null) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTableError, setIsTableError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    "실제와 다른 테이블 번호 입력 시, 이용이 제한될 수 있어요."
  );

  const handleStartOrder = async (tableValue: string) => {
    if (!tableValue) {
      return;
    }

    setIsLoading(true);
    setIsTableError(false);
    setErrorMessage(
      "실제와 다른 테이블 번호 입력 시, 이용이 제한될 수 있어요."
    );

    try {
      const storedBoothId = localStorage.getItem("boothId") || boothId;
      if (!storedBoothId) {
        throw new Error("부스 ID가 없습니다.");
      }

      const response: TableEnterResponse = await enterTable(
        storedBoothId,
        tableValue
      );

      if (response.status === "success") {
        localStorage.setItem("tableNum", tableValue);
        navigate(ROUTE_CONSTANTS.MENULIST);
      } else {
        setIsTableError(true);
        setErrorMessage(response.message);
      }
    } catch (error) {
      let message = "테이블 입장 중 오류가 발생했습니다.";
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data as {
          code?: number;
          message?: string;
        };
        if (apiError.code === 404) {
          message = "없는 테이블 번호입니다.";
        } else if (apiError.code === 400) {
          message = "유효하지 않은 요청입니다.";
        } else {
          message = apiError.message || message;
        }
      }
      setIsTableError(true);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleStartOrder,
    isLoading,
    isTableError,
    errorMessage,
    setIsTableError,
    setErrorMessage,
  };
};
