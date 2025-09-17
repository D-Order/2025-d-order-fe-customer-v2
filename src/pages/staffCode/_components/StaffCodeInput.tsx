import styled from "styled-components";
import { useEffect, useImperativeHandle, forwardRef } from "react";

//hooks
import useCodeInput from "../hooks/useCodeInput";

interface StaffCodeInputProps {
  onComplete: (code: string[]) => void;
  onChange?: () => void;
}

// 컴포넌트에서 외부로 노출할 메서드 정의
export interface StaffCodeInputRef {
  resetCode: () => void;
}

const StaffCodeInput = forwardRef<StaffCodeInputRef, StaffCodeInputProps>(
  ({ onComplete, onChange }, ref) => {
    const {
      code,
      activeIndex,
      inputRefs,
      // handleChange,
      setCodeAt,
      handleKeyDown,
      handleBoxClick,
      resetCode,
    } = useCodeInput(4, onChange);

    // ref를 통해 resetCode 메서드를 외부에 노출
    useImperativeHandle(ref, () => ({
      resetCode,
    }));

    // // 코드가 모두 입력되었을 때 부모 컴포넌트에 알림
    // useEffect(() => {
    //   const isCodeComplete = code.every((digit) => digit !== "");
    //   if (isCodeComplete && onComplete) {
    //     onComplete(code); // 현재 입력된 코드 배열을 전달
    //   }
    // }, [code, onComplete]);

    return (
      <StaffCodeInputWrapper>
        {[0, 1, 2, 3].map((_, index) => (
          <CodeInputBox
            key={index}
            onClick={() => handleBoxClick(index)}
            $isActive={activeIndex === index}
            $isFilledIn={code[index] !== ""}
          >
            <CircleIndicator $isFilledIn={code[index] !== ""} />
            <StyledInput
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="tel"
              maxLength={1}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={code[index]}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, "").slice(-1);
                setCodeAt(index, v);
                onChange?.();

                // 마지막 인덱스에서만 완료 판정
                if (v && index === 3) {
                  const filled = [...code];
                  filled[index] = v;
                  const complete = filled.every((d) => d !== "");
                  if (complete) onComplete(filled);
                }
              }}
              onKeyDown={handleKeyDown(index)}
              autoFocus={index === 0}
            />
          </CodeInputBox>
        ))}
      </StaffCodeInputWrapper>
    );
  }
);

export default StaffCodeInput;

// 스타일 컴포넌트들
export const StaffCodeInputWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const CodeInputBox = styled.div<{
  $isActive: boolean;
  $isFilledIn: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 46px;
  height: 46px;
  position: relative;

  background-color: ${({ theme }) => theme.colors.Bg};
  border-radius: 8.574px;
  border: 2px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.colors.Orange01 : "rgba(192, 192, 192, 0.6)"};
  box-shadow: ${({ $isActive }) =>
    $isActive
      ? "0px 0px 8.574px 0px rgba(255, 110, 63, 0.3)"
      : "0px 0px 8.574px 0px rgba(0, 0, 0, 0.1)"};

  cursor: pointer;
`;

export const CircleIndicator = styled.div<{
  $isFilledIn: boolean;
}>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ $isFilledIn }) =>
    $isFilledIn ? "#999" : "transparent"};
  transition: background-color 0.2s ease;
  position: absolute;
  z-index: 1;
  pointer-events: none;
`;

// 인풋 필드 - 완전히 숨기지 않고 투명하게 설정
export const StyledInput = styled.input`
  position: absolute;
  opacity: 0; // 투명하게
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
  color: transparent; // 텍스트를 투명하게
  background: transparent;
  border: none;
  caret-color: transparent; // 커서도 숨김
  outline: none;
  text-align: center;
  z-index: 2; // 동그라미보다 위에 위치하도록
`;
