import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";
import { accountInfoType, Menu } from "../types/types";
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
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    null
  );
  const boothId = localStorage.getItem("boothId");
  const table_num = localStorage.getItem("tableNum");
  const cart_id = localStorage.getItem("cartId");

  // 장바구니 조회
  const FetchShoppingItems = async () => {
    try {
      const response = await instance.get("api/v2/cart/detail", {
        headers: {
          "Booth-ID": boothId,
        },
        params: {
          table_num,
          cart_id,
        },
      });
      const data = response.data;
      setShoppingItemResponse(data);
      console.log("장바구니 담은 데이터", data);
    } catch (err) {
      console.log(err);
    }
  };

  // 총 주문금액 계산 함수
  const calculateTotalPrice = (menus?: Menu[], setMenus?: Menu[]) => {
    const menusTotal = (Array.isArray(menus) ? menus : []).reduce(
      (total, item) => total + item.menu_price * item.quantity,
      0
    );
    const setMenusTotal = (Array.isArray(setMenus) ? setMenus : []).reduce(
      (total, item) => total + item.discounted_price * item.quantity,
      0
    );
    return menusTotal + setMenusTotal;
  };

  // 공통: 메뉴/세트 구분
  const getItemContext = (
    id: number
  ): { type: "menu" | "set_menu"; currentItem: Menu | undefined } => {
    const currentMenu = shoppingItemResponse?.data?.cart?.menus?.find(
      (item) => item.id === id
    );
    const currentSet = shoppingItemResponse?.data?.cart?.set_menus?.find(
      (item: Menu) => item.id === id
    );
    if (currentSet) return { type: "set_menu", currentItem: currentSet };
    return { type: "menu", currentItem: currentMenu };
  };

  // 공통: 수량 변경 API 호출
  const patchShoppingItem = async (
    id: number,
    quantity: number,
    type: "menu" | "set_menu"
  ) => {
    try {
      await instance.patch(
        `api/v2/cart/menu/`,
        {
          table_num,
          type,
          id,
          quantity,
          cart_id,
        },
        {
          headers: {
            "Booth-ID": boothId,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  // 수량 증가
  const increaseQuantity = async (id: number) => {
    if (!shoppingItemResponse?.data?.cart) return;

    const { type, currentItem } = getItemContext(id);
    if (!currentItem) return;

    // 테이블 이용료 메뉴는 수량 증가 막기
    if (currentItem.menu_name === "테이블 이용료(테이블당)") {
      return;
    }

    const newQuantity = currentItem.quantity + 1;

    setShoppingItemResponse((prev) => {
      if (!prev) return prev;
      const updatedMenus = (prev.data.cart.menus || []).map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      const updatedSets = (prev.data.cart.set_menus || []).map((item: Menu) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );

      return {
        ...prev,
        data: {
          ...prev.data,
          cart: {
            ...prev.data.cart,
            menus: type === "menu" ? updatedMenus : prev.data.cart.menus,
            set_menus:
              type === "set_menu" ? updatedSets : prev.data.cart.set_menus,
          },
        },
      };
    });

    patchShoppingItem(id, newQuantity, type);
  };

  // 수량 감소
  const decreaseQuantity = async (id: number) => {
    if (!shoppingItemResponse?.data?.cart) return;

    const { type, currentItem } = getItemContext(id);
    if (!currentItem || currentItem.quantity <= 1) return;

    const newQuantity = currentItem.quantity - 1;

    setShoppingItemResponse((prev) => {
      if (!prev) return prev;
      const updatedMenus = (prev.data.cart.menus || []).map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      const updatedSets = (prev.data.cart.set_menus || []).map((item: Menu) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );

      return {
        ...prev,
        data: {
          ...prev.data,
          cart: {
            ...prev.data.cart,
            menus: type === "menu" ? updatedMenus : prev.data.cart.menus,
            set_menus:
              type === "set_menu" ? updatedSets : prev.data.cart.set_menus,
          },
        },
      };
    });

    patchShoppingItem(id, newQuantity, type);
  };

  // 상품 삭제
  const deleteItem = async (id: number) => {
    const { type } = getItemContext(id);

    setShoppingItemResponse((prev) => {
      if (!prev) return prev;
      const updatedMenus = (prev.data.cart.menus || []).filter(
        (item) => item.id !== id
      );
      const updatedSets = (prev.data.cart.set_menus || []).filter(
        (item: Menu) => item.id !== id
      );

      return {
        ...prev,
        data: {
          ...prev.data,
          cart: {
            ...prev.data.cart,
            menus: type === "menu" ? updatedMenus : prev.data.cart.menus,
            set_menus:
              type === "set_menu" ? updatedSets : prev.data.cart.set_menus,
          },
        },
      };
    });

    patchShoppingItem(id, 0, type);
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
          cart_id,
        },
      });
      setAccountInfo(response.data.data);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "알 수 없는 오류가 발생했습니다.";
      setisConfirmModal(true);
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
  const Pay = async (price: number, code?: string) => {
    try {
      await instance.post(
        "api/v2/tables/call_staff/",
        {
          table_num,
          cart_id,
        },
        {
          headers: {
            "Booth-ID": boothId,
          },
        }
      );
      // 쿠폰 코드가 없으면 바로 이동
      if (!code || !code.trim()) {
        setIsSendMoneyModal(false);

        return;
      }

      setIsSendMoneyModal(false);
    } catch (err) {
      console.log(err);
    } finally {
      navigate(`${ROUTE_CONSTANTS.STAFFCODE}?code=${code}&price=${price}`);
    }
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

      if (response.data) {
        setOriginalPrice(totalPrice);
        setDiscountAmount(response.data.data.discount_value);
        setDiscountType(response.data.data.discount_type);
        setCounponName(response.data.data.coupon_name);
        setAppliedCoupon(true);
        setAppliedCouponCode(code); // 사용자가 입력한 코드 그대로 저장
      }

      return response.data;
    } catch (err: any) {
      console.log("CheckCoupon 에러:", err);
      throw new Error("해당 번호의 쿠폰이 존재하지 않아요!");
    }
  };

  useEffect(() => {
    if (!shoppingItemResponse) return;
    const cart = shoppingItemResponse.data?.cart;
    const base = calculateTotalPrice(cart?.menus, cart?.set_menus);
    setOriginalPrice(base);
  }, [shoppingItemResponse]);

  useEffect(() => {
    if (!appliedCoupon) {
      setTotalPrice(originalPrice);
      return;
    }
    if (discountType === "percent") {
      const discounted = Math.max(
        0,
        Math.floor(originalPrice * (1 - discountAmount / 100))
      );
      setTotalPrice(discounted);
    } else {
      const discounted = Math.max(0, originalPrice - discountAmount);
      setTotalPrice(discounted);
    }
  }, [originalPrice, appliedCoupon, discountType, discountAmount]);

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
    setAppliedCoupon,
    appliedCouponCode,
  };
};

export default useShoppingCartPage;
