import { IMAGE_CONSTANTS } from "@constants/ImageConstants";
import * as S from "../OrderListPage.styled";

const OrderListHeader = ({
  text,
  goBack,
  totalPrice, // ✅ 총 금액 추가
}: {
  text: string;
  goBack: () => void;
  totalPrice: number;
}) => {
  return (
    <>
      <S.Header>
        <button onClick={goBack}>
          <img src={IMAGE_CONSTANTS.BACKICON} alt="돌아가기 버튼" />
        </button>
        <div>{text}</div>
        <div style={{ width: "30px" }}></div>
      </S.Header>
      <S.TotalWrapper>
        <S.TotalPrice>💵 총 주문금액</S.TotalPrice>
        <S.PriceText>{totalPrice.toLocaleString()}원</S.PriceText> {/* ✅ 동적 표시 */}
      </S.TotalWrapper>
    </>
  );
};

export default OrderListHeader;