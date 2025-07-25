import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";
//api연결주석처리
//import { verifyStaffCode } from "../_api/StaffCodeAPI";
import { StaffCodeInputRef } from "../_components/StaffCodeInput";

//리팩토링을위해 api연결잠깐 끊어두기
import { verifyStaffCode } from "../_dummy/StaffCodePageService";
export const useStaffCodeVerification = () => {
  const navigate = useNavigate();
  const codeInputRef = useRef<StaffCodeInputRef>(null);
  const [showError, setShowError] = useState(false);

  // 에러 메시지 초기화 및 코드 초기화 함수
  const resetErrorAndCode = () => {
    setShowError(false);
    codeInputRef.current?.resetCode();
  };

  // 코드 검증 핸들러
  const handleCodeVerification = async (code: string) => {
    if (!code || code.length < 4) {
      // 간단한 유효성 검사 (모든 코드가 입력되었는지)
      setShowError(false); // 코드가 다 입력되지 않았으면 에러 메시지 숨김
      return;
    }
    try {
      const isValid = await verifyStaffCode(code);
      setShowError(!isValid); // 유효하지 않으면 에러 메시지 표시

      if (isValid) {
        // 유효성 검사 성공 시 약간의 딜레이 후 페이지 이동
        setTimeout(() => {
          navigate(ROUTE_CONSTANTS.ORDERCOMPLETE); // 실제로는 주문 완료 또는 다음 단계 페이지로 이동
        }, 300);
      } else {
        // 유효하지 않은 코드일 경우, 에러 메시지 표시 후 일정 시간 후 초기화
        setTimeout(() => {
          resetErrorAndCode();
        }, 500); // 사용자가 에러 메시지를 볼 수 있도록 일정 시간 후 초기화
      }
    } catch (error) {
      setShowError(true); // API 호출 실패 시 에러 메시지 표시

      // 에러 발생 시에도 일정 시간 후 초기화
      setTimeout(() => {
        resetErrorAndCode();
      }, 500);
    }
  };

  // 코드 입력이 변경될 때마다 showError 상태를 초기화
  const handleInputChange = () => {
    if (showError) {
      setShowError(false);
    }
  };

  return {
    codeInputRef,
    showError,
    handleCodeVerification,
    handleInputChange,
  };
};
