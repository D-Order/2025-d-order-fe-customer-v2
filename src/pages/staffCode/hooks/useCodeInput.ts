// staffCode/hooks/useCodeInput.ts
import { useRef, useState, useEffect } from "react";

const useCodeInput = (length: number, onChangeCallback?: () => void) => {
  const [code, setCode] = useState(Array(length).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(length).fill(null));

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

  const resetCode = () => {
    setCode(Array(length).fill(""));
    setActiveIndex(0);
    inputRefs.current[0]?.focus();
  };

  const handleKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (code[index]) {
          const newCode = [...code];
          newCode[index] = "";
          setCode(newCode);
          onChangeCallback?.();
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
    setCodeAt,
    handleKeyDown,
    handleBoxClick,
    resetCode,
  };
};

export default useCodeInput;
