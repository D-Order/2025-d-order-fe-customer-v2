import * as S from "./LoginPage.styled";

import { useNavigate, useSearchParams } from "react-router-dom";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import LoginLogo from "./_components/LoginLogo";
import Btn from "@components/button/Btn";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";
import { fetchBoothName } from "./_api/LoginAPI";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [boothName, setBoothName] = useState<string>("");
  const [tableValue, setTableValue] = useState<string>("");
  const [isTableError, setIsTableError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    "실제와 다른 테이블 번호 입력 시, 이용이 제한될 수 있어요."
  );
  const [isLoading] = useState<boolean>(false);
  const [maxTableCount, setMaxTableCount] = useState<number>(0);

  const boothId = searchParams.get("id");

  // URL에서 부스 ID를 가져와 localStorage에 저장
  useEffect(() => {
    if (boothId) {
      localStorage.setItem("boothId", boothId);
    }
  }, [boothId]);

  // 부스 이름과 테이블 개수 가져오기
  useEffect(() => {
    const getBoothInfo = async () => {
      try {
        // localStorage 또는 URL에서 boothId 가져오기
        const storedBoothId = localStorage.getItem("boothId") || boothId;

        if (storedBoothId) {
          const boothInfo = await fetchBoothName(storedBoothId);
          setBoothName(boothInfo.boothName || "부스 이름");
          setMaxTableCount(boothInfo.tableCount || 0);
        } else {
          setBoothName("부스 이름");
        }
      } catch (error) {
        setBoothName("부스 이름");
      }
    };

    getBoothInfo();
  }, [boothId]);

  const tableRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // 숫자만 입력되도록 제한
    const value = e.target.value;
    // 숫자만 추출
    let numericValue = value.replace(/[^0-9]/g, "");

    // 0으로 시작하는 숫자 제거
    if (numericValue.length > 0) {
      // 0으로 시작하면 0 제거
      numericValue = String(parseInt(numericValue, 10));
    }

    if (tableRef.current) {
      tableRef.current.value = numericValue;
    }

    // 입력 값이 변경되면 에러 상태 초기화
    if (isTableError) {
      setIsTableError(false);
      setErrorMessage(
        "실제와 다른 테이블 번호 입력 시, 이용이 제한될 수 있어요."
      );
    }

    setTableValue(numericValue);
  };

  const handleStartOrder = () => {
    if (!tableValue) {
      // 테이블 번호가 없으면 인풋에 포커스
      tableRef.current?.focus();
      return;
    }

    // 테이블 번호를 숫자로 변환
    const tableNumber = parseInt(tableValue, 10);

    // 테이블 번호가 유효한지 검사 (1부터 maxTableCount까지)
    if (tableNumber < 1 || tableNumber > maxTableCount) {
      setIsTableError(true);
      setErrorMessage("없는 테이블 번호입니다.");
      tableRef.current?.focus();
      return;
    }

    // 유효한 테이블 번호라면 localStorage에 저장하고 다음 페이지로 이동
    localStorage.setItem("tableNum", tableValue);
    navigate(ROUTE_CONSTANTS.MENULIST);
  };

  return (
    <S.LoginWrapper>
      <LoginLogo boothName={boothName} />
      <S.LoginInputWrapper>
        <S.InfoText>테이블 번호를 입력해 주세요.</S.InfoText>
        <S.InputTableNumber
          placeholder="예) 9"
          ref={tableRef}
          onChange={handleInputChange}
          type="tel"
        />
        <S.NoticeText $isError={isTableError}>{errorMessage}</S.NoticeText>
        <Btn
          text="주문 시작하기"
          onClick={handleStartOrder}
          disabled={!tableValue || isLoading}
        />
      </S.LoginInputWrapper>
    </S.LoginWrapper>
  );
};

export default LoginPage;
