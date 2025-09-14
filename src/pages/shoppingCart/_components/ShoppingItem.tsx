import styled from "styled-components";
import close from "@assets/icons/close.svg";
import plus from "@assets/icons/plus.svg";
import PlusDisable from "@assets/icons/PlusDisavle.svg";
import minus from "@assets/icons/minus.svg";
import minusDisavle from "@assets/icons/minusDisable.svg";
import Line from "@assets/images/Line3.svg";
import { Menu } from "../types/types";
import { IMAGE_CONSTANTS } from "@constants/ImageConstants";

interface ShoppingListProps {
  item: Menu;
  onIncrease: () => void;
  onDecrease: () => void;
  deleteItem: () => void;
}

const ShoppingItem = ({
  item,
  onIncrease,
  onDecrease,
  deleteItem,
}: ShoppingListProps) => {
  return (
    <>
      <ShoppingItemWrapper>
        <ImgWrapper>
          {item.menu_image ? (
            <img src={item.menu_image} alt="선택한 음식 사진" />
          ) : (
            <img src={IMAGE_CONSTANTS.CHARACTER} alt="기본 사진" />
          )}
        </ImgWrapper>
        <div className="itemContainer">
          <div className="contentWrapper">
            <ItemText>{item.menu_name}</ItemText>
            <button onClick={deleteItem}>
              <img src={close} alt="장바구니에서 지우기 버튼" />
            </button>
          </div>

          <div className="contentWrapper">
            <PriceText>{item.menu_price.toLocaleString("ko-KR")}원</PriceText>
            <AmountWrapper>
              <button onClick={onDecrease} disabled={item.quantity === 1}>
                <img
                  src={item.quantity === 1 ? minusDisavle : minus}
                  alt="수량 감소"
                />
              </button>
              <AmountText>{item.quantity}</AmountText>
              <button
                onClick={onIncrease}
                disabled={item.quantity === item.menu_amount}
              >
                <img
                  src={item.quantity === item.menu_amount ? PlusDisable : plus}
                />
              </button>
            </AmountWrapper>
          </div>
        </div>
      </ShoppingItemWrapper>
      <img src={Line} alt="구분선" style={{ width: "100%" }} />
    </>
  );
};

export default ShoppingItem;

const ShoppingItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  padding: 1em 0;

  .itemContainer {
    width: 100%;
    margin-top: 20px;

    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .contentWrapper {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const ImgWrapper = styled.div`
  width: 30%;
  aspect-ratio: 1/ 1;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.Gray01};
  img {
    width: 100%;
    height: 100%;
    border-radius: 7px;
  }
`;

const AmountWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 15px;

  button {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 110, 63, 0.3);
    border-radius: 50%;

    &:disabled {
      background-color: rgba(192, 192, 192, 0.2);
    }
  }
`;

const ItemText = styled.p`
  color: #101010;
  ${({ theme }) => theme.fonts.Bold16}
`;

const PriceText = styled.p`
  color: ${({ theme }) => theme.colors.Black01};
  ${({ theme }) => theme.fonts.SemiBold14}
  opacity: 0.6;
`;

const AmountText = styled.p`
  color: ${({ theme }) => theme.colors.Black01};
  ${({ theme }) => theme.fonts.ExtraBold16}
`;
