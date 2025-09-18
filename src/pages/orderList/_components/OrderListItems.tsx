import React from "react";
import * as S from "../OrderListPage.styled";
// ⬇️ SVGR 사용: Vite에서 보통 `?react`(또는 `?component`)를 붙여 import 합니다.
import MenuLine from "@assets/images/menuLine.svg?react";

type SvgComp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface OrderItemProps {
  name: string;
  price: number;
  quantity: number;
  // ⬇️ 문자열 URL(외부/상대경로) 또는 SVGR 컴포넌트 모두 허용
  image: string | SvgComp;
}

const OrderListItems = ({ name, price, quantity, image }: OrderItemProps) => {
  const isUrl = typeof image === "string";

  return (
    <>
      <S.ItemWrapper>
        <S.ImageWrapper>
          {isUrl ? (
            <img src={image} alt={`${name} 이미지`} />
          ) : (
            // SVGR: 컴포넌트로 렌더
            React.createElement(image as SvgComp, {
              role: "img",
              "aria-label": `${name} 이미지`,
            })
          )}
        </S.ImageWrapper>

        <S.ContentContainer>
          <S.TitleWrapper>
            <p>{name}</p>
          </S.TitleWrapper>
          <S.InfoContainer>
            <S.PriceWrapper>{price.toLocaleString()}원</S.PriceWrapper>
            <S.AmountWrapper>{quantity}</S.AmountWrapper>
          </S.InfoContainer>
        </S.ContentContainer>
      </S.ItemWrapper>

      {/* 구분선도 SVGR 컴포넌트로 렌더 */}
      <MenuLine style={{ width: "100%" }} aria-hidden />
    </>
  );
};

export default OrderListItems;
