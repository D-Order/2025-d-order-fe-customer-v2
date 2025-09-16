import * as S from "./StaffCodePage.styled";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { ROUTE_CONSTANTS } from "@constants/RouteConstants";
import XIcon from "@assets/icons/xIcon.svg";

//_components
import OrderInfo from "./_components/OrderInfo";
import StaffCodeInput from "./_components/StaffCodeInput";
import Loading from "@components/loading/Loading";
// API 서비스 임포트- 나중에 다시 살리기
import { fetchTableOrderInfo, TableOrderInfo } from "./_api/StaffCodeAPI";
// 커스텀 훅 임포트
import { useStaffCodeVerification } from "./hooks/useStaffCodeVerification";

const StaffCodePage = () => {
  const navigate = useNavigate();

  const { codeInputRef, showError, handleCodeVerification, handleInputChange } =
    useStaffCodeVerification();

  // 테이블 정보 상태
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
          setError(
            "진행 중인 주문 정보가 없습니다. 주문 후 다시 시도해주세요."
          );
          return;
        }

        setTableInfo(info);
      } catch (error) {
        setError("테이블 정보를 가져오는데 실패했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchTableInfo();
  }, []);

  if (loading) {
    return <Loading />;
  }

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
            onComplete={(codeArray) =>
              handleCodeVerification(codeArray.join(""))
            }
            onChange={handleInputChange} // 코드 입력 시 에러 메시지 초기화
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
