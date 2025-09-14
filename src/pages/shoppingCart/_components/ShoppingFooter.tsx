import Btn from "@components/button/Btn";
import styled from "styled-components";
const ShoppingFooter = ({
  totalPrice,
  CheckShoppingItems,
  OpenCouponModal,
}: {
  totalPrice: number;
  CheckShoppingItems: () => void;
  OpenCouponModal: () => void;
}) => {
  return (
    <Wrapper>
      <CouponWrapper>
        <CouponBtn onClick={OpenCouponModal}>+ 쿠폰 사용</CouponBtn>
      </CouponWrapper>
      <div style={{ justifyContent: "space-between" }}>
        <p id="totalPrice">💵 총 주문금액</p>
        <PriceText>{totalPrice.toLocaleString("ko-KR")}원</PriceText>
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

const PriceText = styled.p`
  color: ${({ theme }) => theme.colors.Orange01};
  ${({ theme }) => theme.fonts.ExtraBold16}
`;
