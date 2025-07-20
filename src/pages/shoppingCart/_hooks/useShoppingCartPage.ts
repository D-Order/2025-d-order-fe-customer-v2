import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";
import { useShoppingCartStore } from "@stores/shoppingCartStore";
import { ApiShopping } from "../_api/Api";

const useShoppingCartPage = () => {
  const cart = useShoppingCartStore((state) => state.cart);
  const deleteItem = useShoppingCartStore((state) => state.deleteItem);
  const increase = useShoppingCartStore((state) => state.increase);
  const decrease = useShoppingCartStore((state) => state.decrease);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accountInfo, setAccountInfo] = useState<{
    depositor: string;
    bank: string;
    account: string;
  } | null>(null);
  const navigate = useNavigate();
  const [isConfirmModal, setisConfirmModal] = useState<boolean>(false);
  const [isSendMoneyModal, setIsSendMoneyModal] = useState<boolean>(false);

  const [totalPrice, setTotalPrice] = useState<number>(0);

  // 상품 주문 관리
  const CheckShoppingItems = async () => {
    const data = {
      items: cart.map((item) => ({
        menu_id: item.id,
        menu_num: item.quantity,
      })),
    };
    try {
      const response = await ApiShopping.post("/api/order/confirm/", data);
      if (response) {
        await CheckAccount();
        setIsSendMoneyModal(true);
      }
    } catch (err: any) {
      setIsSendMoneyModal(false);
      let message =
        err?.response?.data?.message ||
        err?.message ||
        "알 수 없는 오류가 발생했어요.";
      if (message === "첫 주문에는 테이블 이용료를 반드시 포함해야 합니다.") {
        message = "테이블 이용료 주문이 필요해요!";
      }
      setErrorMessage(message);
      setisConfirmModal(true);
    }
  };

  //계좌 정보 관리
  const CheckAccount = async () => {
    try {
      const response = await ApiShopping.get("/api/cart/payment-info/");
      setAccountInfo(response.data.data);
    } catch (err) {}
  };

  // 상품 모달 관리
  const CloseModal = () => {
    setisConfirmModal(false);
  };
  const CloseAcoountModal = () => {
    setIsSendMoneyModal(false);
  };

  // 계좌 페이지 이동
  const Pay = () => {
    setIsSendMoneyModal(false);
    navigate(ROUTE_CONSTANTS.STAFFCODE);
  };

  // 가격 계산 함수
  useEffect(() => {
    if (!cart) {
      setTotalPrice(0);
      return;
    }
    const total = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cart]);

  return {
    cart,
    isConfirmModal,
    isSendMoneyModal,
    totalPrice,
    deleteItem,
    increase,
    decrease,
    CloseModal,
    CloseAcoountModal,
    Pay,
    CheckShoppingItems,
    errorMessage,
    CheckAccount,
    accountInfo,
  };
};

export default useShoppingCartPage;
