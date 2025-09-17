//코드 입력관리 훅

import { useRef, useState, useEffect } from "react";

// length는 필수로, onChangeCallback은 옵셔널로 받도록 수정
const useCodeInput = (length: number, onChangeCallback?: () => void) => {
  const [code, setCode] = useState(Array(length).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>(
    Array(length).fill(null)
  );

  // useEffect(() => {
  //   if (inputRefs.current[0]) {
  //     inputRefs.current[0].focus();
  //   }
  // }, []);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const setCodeAt = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (onChangeCallback) onChangeCallback();

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };
  // 코드 초기화 함수 추가
  const resetCode = () => {
    setCode(Array(length).fill(""));
    setActiveIndex(0);
    // 첫 번째 입력 필드로 포커스 이동
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  // const handleChange =
  //   (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const value = e.target.value;
  //     const numericValue = value.replace(/[^0-9]/g, "");
  //     const singleDigit = numericValue.slice(-1);

  //     if (singleDigit || value === "") {
  //       const newCode = [...code];
  //       newCode[index] = singleDigit;
  //       setCode(newCode);

  //       if (onChangeCallback) {
  //         onChangeCallback();
  //       }

  //       if (singleDigit && index < length - 1) {
  //         inputRefs.current[index + 1]?.focus();
  //         setActiveIndex(index + 1);
  //       }
  //     }
  //   };

  const handleKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (code[index]) {
          const newCode = [...code];
          newCode[index] = "";
          setCode(newCode);
          if (onChangeCallback) {
            onChangeCallback();
          }
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          setActiveIndex(index - 1);
        }
      }
    };

  const handleBoxClick = (index: number) => {
    inputRefs.current[index]?.focus();
    setActiveIndex(index);
  };

  return {
    code,
    activeIndex,
    inputRefs,
    // handleChange,
    setCodeAt,
    handleKeyDown,
    handleBoxClick,
    resetCode, // 코드 초기화 함수 반환
  };
};

export default useCodeInput;
