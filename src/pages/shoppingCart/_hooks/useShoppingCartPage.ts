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

  const [isCouponModal, setIsCouponModal] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<string>();
  const [couponName, setCounponName] = useState<string>();
  const [appliedCoupon, setAppliedCoupon] = useState<boolean>(false);
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
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "알 수 없는 오류가 발생했습니다.";
      setErrorMessage(errorMessage);
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

  // 쿠폰이 유효한지 확인
  const CheckCoupon = async (code: string) => {
    try {
      const response = await instance.post(
        "api/v2/cart/validate-coupon/",
        {
          coupon_code: code,
        },
        {
          headers: {
            "Booth-ID": boothId,
          },
        }
      );

      console.log("쿠폰 검증 성공:", response.data);

      // 쿠폰 적용 성공 시 할인 정보 저장
      if (response.data) {
        console.log("실행함?");
        setOriginalPrice(totalPrice);
        setDiscountAmount(response.data.data.discount_value);
        setDiscountType(response.data.data.discount_type);
        setCounponName(response.data.data.coupon_name);
        setAppliedCoupon(true);

        // 상태 업데이트 후 확인
        console.log("setAppliedCoupon(true) 호출 완료");
      }

      return response.data;
    } catch (err: any) {
      console.log("CheckCoupon 에러:", err);
      throw new Error("해당 번호의 쿠폰이 존재하지 않아요!");
    }
  };

  // 총 주문금액 계산
  useEffect(() => {
    if (shoppingItemResponse?.data?.cart?.menus) {
      const calculatedTotal = calculateTotalPrice(
        shoppingItemResponse.data.cart.menus
      );
      setTotalPrice(calculatedTotal);

      // 쿠폰이 적용되지 않은 상태에서는 원래 가격과 동일
      if (!appliedCoupon) {
        setOriginalPrice(calculatedTotal);
      }
    }
  }, [shoppingItemResponse?.data?.cart?.menus]);

  return {
    shoppingItemResponse,
    isConfirmModal,
    isSendMoneyModal,
    setIsSendMoneyModal,
    totalPrice,
    originalPrice,
    discountAmount,
    appliedCoupon,
    discountType,
    couponName,
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
    setIsCouponModal,
    isCouponModal,
    CheckCoupon,
  };
};

export default useShoppingCartPage;
