import * as S from "./OrderListPage.styled";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import OrderListHeader from "./_components/OrderListHeader";
import OrderListItems from "./_components/OrderListItems";
import ACCO from "@assets/images/character.svg";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";
import { useOrderList } from "./hooks/useOrderList";
import EmptyOrder from "./_components/EmptyOrder";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const OrderListPage = () => {
  const tableId = Number(localStorage.getItem("tableNum") || 0);
  const boothId = Number(localStorage.getItem("boothId") || 0);
  const { orderData, loading, error } = useOrderList(tableId, boothId);
  const [orderList, setOrderList] = useState<OrderItem[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (orderData && orderData.data) {
      const mapped = orderData.data.map((item) => ({
        id: item.id,
        name: item.menu_name,
        price: item.menu_price,
        image: item.menu_image ?? ACCO,
        quantity: item.menu_num,
      }));
      setOrderList(mapped);
    }
  }, [orderData]);

  if (loading) return <div>로딩 중...</div>;

  const shouldShowEmpty = error || !orderData || orderData.data?.length === 0;

  return (
    <>
      <S.HeaderWrapper>
        <OrderListHeader
          text="주문내역"
          goBack={() => {
            navigate(ROUTE_CONSTANTS.MENULIST);
          }}
          totalPrice={orderData?.total_price || 0}
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
    </>
  );
};

export default OrderListPage;