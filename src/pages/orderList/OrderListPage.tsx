// src/pages/orderList/OrderListPage.tsx
import * as S from "./OrderListPage.styled";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import OrderListHeader from "./_components/OrderListHeader";
import OrderListItems from "./_components/OrderListItems";
import ACCO from "@assets/images/character.svg";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";
import { useOrderList } from "./hooks/useOrderList";
import EmptyOrder from "./_components/EmptyOrder";
import Loading from "@components/loading/Loading";
import { normalizeOrder, type NormalizedOrderItem } from "./apis/getOrderList"; // ✅ 헬퍼 사용

interface OrderItem {
  id: number;
  name: string;
  price: number;
  image: string | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  quantity: number;
}

const OrderListPage = () => {
  const tableNum = Number(localStorage.getItem("tableNum") || 0);
  const boothId = Number(localStorage.getItem("boothId") || 0);

  const { orderData, loading, error } = useOrderList(tableNum, boothId);
  const [orderList, setOrderList] = useState<OrderItem[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (orderData?.status === "success" && orderData.data) {
      const normalized: NormalizedOrderItem[] =
        (orderData.data.orders ?? []).map(normalizeOrder);

      // ✅ 이미지 폴백(ACCO) 적용
      const mapped: OrderItem[] = normalized.map((n) => ({
        id: n.id,
        name: n.name,
        price: n.price,                      // ✅ 이미 fixed_price 우선 반영됨
        image: n.image ?? ACCO,
        quantity: n.quantity,
      }));

      setOrderList(mapped);
    } else {
      setOrderList(null);
    }
  }, [orderData]);

  // ✅ 로딩 화면 연결
  if (loading) return <Loading />;

  const shouldShowEmpty =
    !!error ||
    !orderData ||
    orderData.status !== "success" ||
    !orderData.data ||
    (orderData.data.orders?.length ?? 0) === 0;

  const totalPrice = orderData?.data?.order_amount ?? 0;

  return (
    <>
    <S.Wrapper>
      <S.HeaderWrapper>
        <OrderListHeader
          text="주문내역"
          goBack={() => navigate(ROUTE_CONSTANTS.MENULIST)}
          totalPrice={totalPrice}
        />
      </S.HeaderWrapper>

      <S.PageWrapper>
        <S.OrderListWrapper>
          {shouldShowEmpty ? (
            <EmptyOrder />
          ) : (
            orderList?.map((item) => (
              <OrderListItems
                key={item.id}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                image={item.image}
              />
            ))
          )}
        </S.OrderListWrapper>
      </S.PageWrapper>
    </S.Wrapper>
      
    </>
  );
};

export default OrderListPage;
