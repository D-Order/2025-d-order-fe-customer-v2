// hooks/useStaffCodeVerification.ts

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";

// API 함수와 타입을 모두 임포트
import { verifyStaffCode } from "../_api/StaffCodeAPI";
import { StaffCodeInputRef } from "../_components/StaffCodeInput";

// 훅이 쿠폰 코드를 인자로 받도록 수정
export const useStaffCodeVerification = () => {
  const navigate = useNavigate();
  const codeInputRef = useRef<StaffCodeInputRef>(null);

  // 상태 추가: API 호출 진행 여부
  const [isVerifying, setIsVerifying] = useState(false);
  const [showError, setShowError] = useState(false);
  const verifiedRef = useRef(false); // 완료 가드

  const resetErrorAndCode = () => {
    setShowError(false);
    codeInputRef.current?.resetCode();
  };

  // 코드 검증 핸들러에 쿠폰 적용 로직 추가
  const handleCodeVerification = async (code: string) => {
    if (verifiedRef.current) return; // 이미 성공 처리됨
    if (isVerifying) return; // 진행 중 중복 방지

    if (!code || code.length < 4) return;

    setIsVerifying(true); // 로딩 시작
    // setShowError(false);

    try {
      const isValid = await verifyStaffCode(code);

      if (isValid) {
        verifiedRef.current = true; // 재호출 차단
        // 성공 시 페이지 이동
        navigate(ROUTE_CONSTANTS.ORDERCOMPLETE);
      } else {
        // 실패 시 에러 표시 후 초기화
        setShowError(true);
        setTimeout(resetErrorAndCode, 800);
      }
    } catch (error) {
      // 쿠폰 적용 실패 또는 네트워크 오류
      alert("처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      resetErrorAndCode();
    } finally {
      setIsVerifying(false); // 로딩 종료
    }
  };

  // 입력 변경 시 에러 초기화
  const handleInputChange = () => {
    if (showError) {
      setShowError(false);
    }
  };

  // 컴포넌트에서 사용할 상태와 함수들을 반환
  return {
    codeInputRef,
    isVerifying,
    showError,
    handleCodeVerification,
    handleInputChange,
  };
};
