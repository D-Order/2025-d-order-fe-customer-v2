// staffCode/StaffCodePage.tsx
import * as S from "./StaffCodePage.styled";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";
import XIcon from "@assets/icons/xIcon.svg";

import OrderInfo from "./_components/OrderInfo";
import StaffCodeInput from "./_components/StaffCodeInput";
import Loading from "@components/loading/Loading";

import { fetchTableOrderInfo, TableOrderInfo } from "./_api/StaffCodeAPI";
import { useStaffCodeVerification } from "./hooks/useStaffCodeVerification";

const StaffCodePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ URL 파라미터 파싱 (price, coupon_code)
    const { priceFromQuery, couponCodeFromQuery } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const priceParam = params.get("price");

    // ✅ 쿠폰 파라미터 다중 허용: coupon_code > code > coupon
    const rawCoupon =
      params.get("coupon_code") ||
      params.get("code") ||
      params.get("coupon") ||
      undefined;

    // 혹시 대문자 등 변형에 대비
    const rawCouponCase =
      rawCoupon ||
      params.get("COUPON_CODE") ||
      params.get("CODE") ||
      params.get("COUPON") ||
      undefined;

    // 안전한 문자열로 정리
    const coupon = rawCouponCase ? String(rawCouponCase).trim() : undefined;

    // // ✅ 보너스: 있으면 localStorage에도 저장 (백업 루트)
    // if (coupon) {
    //   try {
    //     localStorage.setItem("coupon_code", coupon);
    //   } catch {}
    // }

    return {
      priceFromQuery: priceParam ? parseInt(priceParam, 10) : null,
      couponCodeFromQuery: coupon,
    };
  }, [location.search]);

  // 훅 호출은 그대로 + couponCodeFromQuery
  const {
    codeInputRef,
    showError,
    handleCodeVerification,
    handleInputChange,
  } = useStaffCodeVerification({ couponCode: couponCodeFromQuery });

  // 디버깅 로그
  console.log("[PAGE] location.search =", location.search);
  console.log("[PAGE] priceFromQuery =", priceFromQuery);
  console.log("[PAGE] couponCodeFromQuery =", couponCodeFromQuery);
  console.log("[PAGE] pass couponCode to hook =", couponCodeFromQuery);


  const [tableInfo, setTableInfo] = useState<TableOrderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 테이블 정보 로드
  useEffect(() => {
    const fetchTableInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        const info = await fetchTableOrderInfo();
        if (!info) {
          setError("진행 중인 주문 정보가 없습니다. 주문 후 다시 시도해주세요.");
          return;
        }

        const finalPrice =
          typeof priceFromQuery === "number" && !Number.isNaN(priceFromQuery)
            ? priceFromQuery
            : info.totalPrice;

        setTableInfo({
          ...info,
          totalPrice: finalPrice,
        });
      } catch {
        setError("테이블 정보를 가져오는데 실패했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchTableInfo();
  }, [priceFromQuery]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <S.StaffCodeWrapper>
        <S.Header>
          <S.XBtn onClick={() => navigate(ROUTE_CONSTANTS.SHOPPINGCART)}>
            <img src={XIcon} alt="x버튼" />
          </S.XBtn>
        </S.Header>
        <S.StaffCodeContents>
          <S.Title>
            <div>오류가 발생했습니다</div>
          </S.Title>
          <S.ErrorMessage>{error}</S.ErrorMessage>
        </S.StaffCodeContents>
      </S.StaffCodeWrapper>
    );
  }

  return (
    <S.StaffCodeWrapper>
      <S.Header>
        <S.XBtn onClick={() => navigate(ROUTE_CONSTANTS.SHOPPINGCART)}>
          <img src={XIcon} alt="x버튼" />
        </S.XBtn>
      </S.Header>

      <S.StaffCodeContents>
        <S.Title>
          <div>직원 확인 코드를</div>
          <div>입력해 주세요.</div>
        </S.Title>

        <S.InputContents>
          {tableInfo && (
            <OrderInfo
              table={tableInfo.tableNumber}
              seat_count={tableInfo.seat_count}
              price={tableInfo.totalPrice}
            />
          )}

          <StaffCodeInput
            ref={codeInputRef}
            onComplete={(codeArray) => handleCodeVerification(codeArray.join(""))}
            onChange={handleInputChange}
          />

          {showError && (
            <S.ErrorMessage>일치하지 않는 코드에요!</S.ErrorMessage>
          )}
        </S.InputContents>
      </S.StaffCodeContents>
    </S.StaffCodeWrapper>
  );
};

export default StaffCodePage;
