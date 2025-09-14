import Btn from "@components/button/Btn";
import { SetStateAction } from "react";
import styled from "styled-components";

const ShoppingFooter = ({
  totalPrice,
  originalPrice,
  discountAmount,
  appliedCoupon,
  CheckShoppingItems,
  setIsCouponModal,
}: {
  totalPrice: number;
  originalPrice: number;
  discountAmount: number;
  appliedCoupon: boolean;
  CheckShoppingItems: () => void;
  setIsCouponModal: React.Dispatch<SetStateAction<boolean>>;
}) => {
  console.log(appliedCoupon);
  return (
    <Wrapper>
      <CouponWrapper>
        <CouponBtn onClick={() => setIsCouponModal(true)}>
          + 쿠폰 사용
        </CouponBtn>
      </CouponWrapper>
      <div style={{ justifyContent: "space-between" }}>
        <p id="totalPrice">💵 총 주문금액</p>
        <PriceContainer>
          {appliedCoupon && (
            <OriginalPrice>
              {originalPrice.toLocaleString("ko-KR")}
            </OriginalPrice>
          )}
          <PriceText>{totalPrice.toLocaleString("ko-KR")}원</PriceText>
        </PriceContainer>
      </div>
      <div style={{ justifyContent: "center" }}>
        <Btn text="주문하기" onClick={CheckShoppingItems} />
      </div>
    </Wrapper>
  );
};

export default ShoppingFooter;

const Wrapper = styled.footer`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 250px;

  display: flex;
  flex-direction: column;
  gap: 33px;

  box-sizing: border-box;
  padding: 1.25em;

  z-index: 10;
  div {
    display: flex;
    flex-direction: row;
  }

  #totalPrice {
    color: ${({ theme }) => theme.colors.Black01};
    ${({ theme }) => theme.fonts.Bold16}
  }
`;

const CouponWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CouponBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: fit-content;
  height: 40px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.Orange01};
  color: ${({ theme }) => theme.colors.Bg};
  ${({ theme }) => theme.fonts.Bold16};

  border-radius: 50px;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column !important;
  align-items: flex-end;
  gap: 4px;
`;

const OriginalPrice = styled.p`
  color: #999;
  ${({ theme }) => theme.fonts.Medium14};
  text-decoration: line-through;
`;

const PriceText = styled.p`
  color: ${({ theme }) => theme.colors.Orange01};
  ${({ theme }) => theme.fonts.ExtraBold16}
`;
