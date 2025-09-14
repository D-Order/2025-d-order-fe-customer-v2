import styled from "styled-components";
import { useState } from "react";
import { toast } from "react-toastify";
import { IMAGE_CONSTANTS } from "@constants/ImageConstants";
import useShoppingCartPage from "../_hooks/useShoppingCartPage";

interface CouponModalProps {
  onClose: () => void;
}

const CouponModal = ({ onClose }: CouponModalProps) => {
  const [couponCode, setCouponCode] = useState("");
  const { CheckCoupon } = useShoppingCartPage();
  const handleApply = async () => {
    if (!couponCode.trim()) return;

    try {
      await CheckCoupon(couponCode);
      onClose();
    } catch (error: any) {
      toast.error("해당 번호의 쿠폰이 존재하지 않아요!", {
        icon: <img src={IMAGE_CONSTANTS.CHECK} />,
        closeButton: false,
        style: {
          backgroundColor: "#FF6E3F",
          color: "#FAFAFA",
          fontSize: "14px",
          fontWeight: "800",
          borderRadius: "8px",
          padding: "0.75rem 0.875rem",
          zIndex: 100,
        },
      });
    }
  };

  const isDisabled = couponCode === "";

  return (
    <Wrapper>
      <ModalContainer>
        <Title>쿠폰 번호를 입력해 주세요</Title>
        <InputContainer>
          <CouponInput
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="쿠폰 번호 입력"
          />
        </InputContainer>
      </ModalContainer>
      <ButtonContainer>
        <CancelButton onClick={onClose}>취소</CancelButton>
        <Divider />
        <ApplyButton onClick={handleApply} disabled={isDisabled}>
          쿠폰 적용
        </ApplyButton>
      </ButtonContainer>
    </Wrapper>
  );
};

export default CouponModal;

const Wrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  border-radius: 14px;
  background-color: white;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;
const ModalContainer = styled.div`
  padding: 24px 24px 12px 24px;
  min-width: 300px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  text-align: center;
  ${({ theme }) => theme.fonts.SemiBold16}
`;

const InputContainer = styled.div`
  margin-bottom: 24px;
`;

const CouponInput = styled.input`
  width: 100%;
  height: 48px;
  border: 1px solid ${({ theme }) => theme.colors.Black02};
  border-radius: 20px;
  padding: 0 16px;
  font-size: 16px;
  box-sizing: border-box;
  ${({ theme }) => theme.fonts.SemiBold12}
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.Black02};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.Black02};
  height: 50px;
`;

const CancelButton = styled.button`
  flex: 1;
  background: none;
  border: none;
  color: #ff6e3f;
  padding: 8px 0;
  cursor: pointer;
  ${({ theme }) => theme.fonts.Medium16}
`;

const Divider = styled.div`
  width: 1px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.Black02};
`;

const ApplyButton = styled.button<{ disabled: boolean }>`
  flex: 1;
  background: none;
  border: none;
  color: ${({ disabled, theme }) =>
    disabled ? theme.colors.Black02 : "#ff6e3f"};
  padding: 8px 0;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  ${({ theme }) => theme.fonts.Medium16}
  &:hover {
    opacity: ${({ disabled }) => (disabled ? 1 : 0.8)};
  }
`;
