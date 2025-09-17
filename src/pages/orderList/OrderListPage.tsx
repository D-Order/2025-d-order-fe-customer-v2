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
import type { RawOrderItem } from "./apis/getOrderList";
import { toAbsoluteUrl } from "./apis/getOrderList"; 

interface OrderItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const OrderListPage = () => {
  const tableNum = Number(localStorage.getItem("tableNum") || 0);
  const boothId = Number(localStorage.getItem("boothId") || 0);

  const { orderData, loading, error } = useOrderList(tableNum, boothId);
  const [orderList, setOrderList] = useState<OrderItem[] | null>(null);
  const navigate = useNavigate();

  const normalize = (item: RawOrderItem): OrderItem => {
    if (item.type === "menu") {
      const unit = item.fixed_price ?? item.menu_price ?? 0;
      const abs = toAbsoluteUrl(item.menu_image);
      return {
        id: item.menu_id ?? 0,                  
        name: item.menu_name ?? "",
        price: unit,
        image: abs ?? ACCO,                   
        quantity: item.quantity,
      };
    } else {
      const unit = item.fixed_price ?? item.set_price ?? 0;
      const abs = toAbsoluteUrl(item.set_image);
      return {
        id: item.set_id ?? 0,  
        name: item.set_name ?? "",
        price: unit,
        image: abs ?? ACCO, 
        quantity: item.quantity,
      };
    }
  };

  useEffect(() => {
    if (orderData?.status === "success" && orderData.data) {
      const mapped = (orderData.data.orders ?? []).map(normalize);
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
    </>
  );
};

export default OrderListPage;
