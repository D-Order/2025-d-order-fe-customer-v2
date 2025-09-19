import React from "react";
import * as S from "../OrderListPage.styled";
import menuLine from "@assets/images/menuLine.svg";

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
      <img style={{ width: "100%" }} src={menuLine} alt="메뉴 구분선" />
    </> 
  );
};

export default OrderListItems;
