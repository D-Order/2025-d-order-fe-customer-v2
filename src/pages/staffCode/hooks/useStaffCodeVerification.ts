// staffCode/hooks/useStaffCodeVerification.ts
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";

import { verifyStaffCode } from "../_api/StaffCodeAPI";
import { StaffCodeInputRef } from "../_components/StaffCodeInput";

type Options = {
  couponCode?: string;
};

export const useStaffCodeVerification = (options?: Options) => {
  const navigate = useNavigate();
  const codeInputRef = useRef<StaffCodeInputRef>(null);

  const [isVerifying, setIsVerifying] = useState(false);
  const [showError, setShowError] = useState(false);
  const verifiedRef = useRef(false); // 중복 완료 가드
  // hooks 적용 확인 콘솔
  console.log("[HOOK] options in useStaffCodeVerification =", options);

  const resetErrorAndCode = () => {
    setShowError(false);
    codeInputRef.current?.resetCode();
  };

  const handleCodeVerification = async (code: string) => {
    if (verifiedRef.current) return;   // 이미 성공 처리됨
    if (isVerifying) return;           // 중복 호출 방지
    if (!/^\d{4}$/.test(code)) return; // 4자리 숫자 유효성

    setIsVerifying(true);
    try {
      const isValid = await verifyStaffCode(code, {
        couponCode: options?.couponCode, // ✅ 쿠폰 코드 동봉(있을 때만)
      });

      if (isValid) {
        verifiedRef.current = true;
        navigate(ROUTE_CONSTANTS.ORDERCOMPLETE);
      } else {
        setShowError(true);
        setTimeout(resetErrorAndCode, 800);
      }
    } catch {
      alert("처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      resetErrorAndCode();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = () => {
    if (showError) setShowError(false);
  };

  return {
    codeInputRef,
    isVerifying,
    showError,
    handleCodeVerification,
    handleInputChange,
  };
};
