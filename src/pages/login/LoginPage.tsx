import * as S from "./LoginPage.styled";

import { useSearchParams } from "react-router-dom";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import LoginLogo from "./_components/LoginLogo";
import Btn from "@components/button/Btn";

import { fetchBoothName } from "./_api/LoginAPI";

import { useLogin } from "./hooks/useLogin";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const [boothName, setBoothName] = useState<string>("");
  const [tableValue, setTableValue] = useState<string>("");
  const tableRef = useRef<HTMLInputElement>(null);

  const boothId = searchParams.get("id");

  const {
    handleStartOrder,
    isLoading,
    isTableError,
    errorMessage,
    setIsTableError,
    setErrorMessage,
  } = useLogin(boothId);

  // URL에서 부스 ID를 가져와 localStorage에 저장
  useEffect(() => {
    if (boothId) {
      localStorage.setItem("boothId", boothId);
      localStorage.removeItem("cartId");
    }
  }, [boothId]);

  useEffect(() => {
    const getBoothInfo = async () => {
      try {
        const storedBoothId = localStorage.getItem("boothId") || boothId;
        if (storedBoothId) {
          const name = await fetchBoothName(storedBoothId);
          setBoothName(name);
        } else {
          setBoothName("부스 이름");
        }
      } catch (error) {
        setBoothName("부스 이름");
      }
    };

    getBoothInfo();
  }, [boothId]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue.length > 0) {
      numericValue = String(parseInt(numericValue, 10));
    }

    if (tableRef.current) {
      tableRef.current.value = numericValue;
    }

    if (isTableError) {
      setIsTableError(false);
      setErrorMessage(
        "실제와 다른 테이블 번호 입력 시, 이용이 제한될 수 있어요."
      );
    }

    setTableValue(numericValue);
  };

  const onStartOrderClick = () => {
    handleStartOrder(tableValue);
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
          onClick={onStartOrderClick}
          disabled={!tableValue || isLoading}
        />
      </S.LoginInputWrapper>
    </S.LoginWrapper>
  );
};

export default LoginPage;
