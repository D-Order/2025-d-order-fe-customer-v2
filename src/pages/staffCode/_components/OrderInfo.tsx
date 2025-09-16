import styled from "styled-components";

// props 타입 정의 추가
interface OrderInfoProps {
  table: string;
  seat_count: number;
  price: number;
}

const OrderInfo = ({ table, seat_count, price }: OrderInfoProps) => {
  return (
    <OrderInfoWrapper>
      <TableInfo>
        <TableInfoText color="orange">테이블: {table}</TableInfoText>
        {seat_count > 0 ? (
          <TableInfoText color="black">인원수: {seat_count}</TableInfoText>
        ) : null}
      </TableInfo>
      <TotalPriceText>{price}원</TotalPriceText>
    </OrderInfoWrapper>
  );
};

export default OrderInfo;

//테이블 정보를 감싸는 디브브
const OrderInfoWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const TableInfo = styled.div`
  display: flex;
  gap: 12px;
`;
const TableInfoText = styled.div<{ color?: "orange" | "black" }>`
  // color props에 조건 추가
  display: flex;
  color: ${({ color, theme }) =>
    color === "black"
      ? theme.colors.Black02
      : theme.colors.Orange01}; // 조건에 따라 색상 선택
  ${({ theme }) => theme.fonts.SemiBold16}
`;

const TotalPriceText = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.Black01};
  ${({ theme }) => theme.fonts.Bold16};
`;
