import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";
import { accountInfoType } from "../types/types";
import { instance } from "@services/instance";
import { ShoppingItemResponseType } from "../types/types";

const useShoppingCartPage = () => {
  const [shoppingItemResponse, setShoppingItemResponse] = useState<
    ShoppingItemResponseType | undefined
  >();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accountInfo, setAccountInfo] = useState<accountInfoType | null>(null);
  const navigate = useNavigate();
  const [isConfirmModal, setisConfirmModal] = useState<boolean>(false);
  const [isSendMoneyModal, setIsSendMoneyModal] = useState<boolean>(false);

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const boothId = localStorage.getItem("boothId");
  const table_num = localStorage.getItem("tableNum");

  // 장바구니 조회
  const FetchShoppingItems = async () => {
    try {
      const response = await instance.get("api/v2/cart/detail", {
        headers: {
          "Booth-ID": boothId,
        },
        params: {
          table_num,
        },
      });
      const data = response.data;
      console.log("장바구니 조회", data);
      setShoppingItemResponse(data);
    } catch (err) {
      console.log(err);
    }
  };

  // 총 주문금액 계산 함수
  const calculateTotalPrice = (menus: any[]) => {
    if (!menus || menus.length === 0) return 0;
    return menus.reduce((total, item) => {
      return total + item.menu_price * item.quantity;
    }, 0);
  };

  // 상품 수량 변경
  const patchMenuShoppingItem = async (id: number, quantity: number) => {
    try {
      const response = await instance.patch(
        `api/v2/cart/menu/`,
        {
          table_num,
          type: "menu",
          id,
          quantity,
        },
        {
          headers: {
            "Booth-ID": boothId,
          },
        }
      );
      const data = response.data;
      console.log("수량 변경", data);
    } catch (err) {
      console.log(err);
    }
  };

  // 수량 증가
  const increaseQuantity = async (id: number) => {
    if (!shoppingItemResponse?.data?.cart?.menus) return;

    const currentItem = shoppingItemResponse.data.cart.menus.find(
      (item) => item.id === id
    );
    if (currentItem) {
      const newQuantity = currentItem.quantity + 1;

      setShoppingItemResponse((prev) => {
        if (!prev) return prev;
        const updatedMenus =
          prev.data.cart.menus?.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          ) || [];

        return {
          ...prev,
          data: {
            ...prev.data,
            cart: {
              ...prev.data.cart,
              menus: updatedMenus,
            },
          },
        };
      });

      patchMenuShoppingItem(id, newQuantity);
    }
  };

  // 수량 감소
  const decreaseQuantity = async (id: number) => {
    if (!shoppingItemResponse?.data?.cart?.menus) return;

    const currentItem = shoppingItemResponse.data.cart.menus.find(
      (item) => item.id === id
    );
    if (currentItem && currentItem.quantity > 1) {
      const newQuantity = currentItem.quantity - 1;

      setShoppingItemResponse((prev) => {
        if (!prev) return prev;
        const updatedMenus =
          prev.data.cart.menus?.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          ) || [];

        return {
          ...prev,
          data: {
            ...prev.data,
            cart: {
              ...prev.data.cart,
              menus: updatedMenus,
            },
          },
        };
      });

      patchMenuShoppingItem(id, newQuantity);
    }
  };

  // 상품 삭제
  const deleteItem = async (id: number) => {
    setShoppingItemResponse((prev) => {
      if (!prev) return prev;
      const updatedMenus =
        prev.data.cart.menus?.filter((item) => item.id !== id) || [];

      return {
        ...prev,
        data: {
          ...prev.data,
          cart: {
            ...prev.data.cart,
            menus: updatedMenus,
          },
        },
      };
    });

    patchMenuShoppingItem(id, 0);
  };

  //계좌 정보 관리
  const CheckAccount = async () => {
    try {
      const response = await instance.get("api/v2/cart/payment-info/", {
        headers: {
          "Booth-ID": boothId,
        },
        params: {
          table_num,
        },
      });
      setAccountInfo(response.data.data);
    } catch (err) {
      console.log(err);
    }
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

  // 총 주문금액 계산
  useEffect(() => {
    if (shoppingItemResponse?.data?.cart?.menus) {
      const calculatedTotal = calculateTotalPrice(
        shoppingItemResponse.data.cart.menus
      );
      setTotalPrice(calculatedTotal);
    }
  }, [shoppingItemResponse?.data?.cart?.menus]);

  return {
    shoppingItemResponse,
    isConfirmModal,
    isSendMoneyModal,
    setIsSendMoneyModal,
    totalPrice,
    CloseModal,
    CloseAcoountModal,
    Pay,
    errorMessage,
    CheckAccount,
    accountInfo,
    FetchShoppingItems,
    increaseQuantity,
    decreaseQuantity,
    deleteItem,
  };
};

export default useShoppingCartPage;
