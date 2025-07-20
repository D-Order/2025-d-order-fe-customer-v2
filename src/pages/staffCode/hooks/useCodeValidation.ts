//직원코드 검증 훅
import { useEffect, useState } from "react";

interface UseCodeValidationProps {
  code: string[];
  correctCode: string;
}

const useCodeValidation = ({ code, correctCode }: UseCodeValidationProps) => {
  const [isError, setIsError] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const allFilled = code.every((digit) => digit !== "");

    if (allFilled) {
      const enteredCode = code.join("");
      const isValid = enteredCode === correctCode;

      setIsError(!isValid);
      setIsComplete(true);
    } else {
      setIsError(false);
      setIsComplete(false);
    }
  }, [code, correctCode]);

  return { isError, isComplete };
};

export default useCodeValidation;
