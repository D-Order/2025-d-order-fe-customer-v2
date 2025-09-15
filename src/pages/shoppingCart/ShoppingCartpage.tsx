import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";
import { IMAGE_CONSTANTS } from "@constants/ImageConstants";
import { toast } from "react-toastify";
import ShoppingHeader from "./_components/ShoppingHeader";
import Character from "@assets/images/character.svg";
import ShoppingItem from "./_components/ShoppingItem";
import ShoppingFooter from "./_components/ShoppingFooter";
import ConfirmModal from "./_modal/ConfitmMotal";
import SendMoneyModal from "./_modal/sendMoneyModal";
import useShoppingCartPage from "./_hooks/useShoppingCartPage";
import { useEffect, useState } from "react";
import { Menu } from "./types/types";
import CouponModal from "./_modal/CouponModal";

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const [menus, setMenu] = useState<Menu[]>([]);
  const [setMenus, setSetMenu] = useState<Menu[]>([]);
  const {
    shoppingItemResponse,
    isConfirmModal,
    isSendMoneyModal,
    totalPrice,
    originalPrice,
    appliedCoupon,
    CloseModal,
    CloseAcoountModal,
    CheckAccount,
    setIsSendMoneyModal,
    Pay,
    errorMessage,
    accountInfo,
    FetchShoppingItems,
    increaseQuantity,
    decreaseQuantity,
    deleteItem,
    setIsCouponModal,
    isCouponModal,
    CheckCoupon,
    setAppliedCoupon,
  } = useShoppingCartPage();

  // 계좌 복사 버튼
  const CopyAccount = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("계좌번호가 복사되었어요!", {
        icon: <img src={IMAGE_CONSTANTS.CHECK} />,
        closeButton: false,
        style: {
          backgroundColor: "#FF6E3F",
          color: "#FAFAFA",
          fontSize: "1rem",
          fontWeight: "800",
          borderRadius: "8px",
          padding: "0.75rem 0.875rem",
        },
      });
    } catch {
      alert("다시 시도해주세요");
    }
  };

  useEffect(() => {
    FetchShoppingItems();
  }, []);

  useEffect(() => {
    if (shoppingItemResponse) {
      setMenu(shoppingItemResponse.data.cart.menus || []);
      setSetMenu(shoppingItemResponse.data.cart.set_menus || []);
    }
  }, [shoppingItemResponse]);

  return (
    <Wrapper>
      <ShoppingHeader
        text="장바구니"
        goBack={() => {
          navigate(ROUTE_CONSTANTS.MENULIST);
        }}
      />

      {menus.length === 0 && setMenus.length === 0 ? (
        <ShoppingListEmpty>
          <img src={Character} alt="이미지" />
          <p>아직 장바구니에 담긴 메뉴가 없어요.</p>
        </ShoppingListEmpty>
      ) : (
        <>
          <ShoppingListWrapper>
            {menus.map((item) => (
              <ShoppingItem
                key={item.id}
                item={item}
                onIncrease={() => increaseQuantity(item.id)}
                onDecrease={() => decreaseQuantity(item.id)}
                deleteItem={() => deleteItem(item.id)}
              />
            ))}
            {setMenus.map((item) => (
              <ShoppingItem
                key={item.id}
                item={item}
                onIncrease={() => increaseQuantity(item.id)}
                onDecrease={() => decreaseQuantity(item.id)}
                deleteItem={() => deleteItem(item.id)}
              />
            ))}
          </ShoppingListWrapper>
          <ShoppingFooter
            totalPrice={totalPrice}
            originalPrice={originalPrice}
            appliedCoupon={appliedCoupon}
            CheckShoppingItems={() => {
              CheckAccount();
              setIsSendMoneyModal(true);
            }}
            setIsCouponModal={setIsCouponModal}
          />
        </>
      )}

      {isConfirmModal && (
        <DarkWrapper>
          <ConfirmModal
            text={errorMessage || ""}
            confirm={CloseModal}
          ></ConfirmModal>
        </DarkWrapper>
      )}
      {isSendMoneyModal && accountInfo && (
        <DarkWrapper>
          <SendMoneyModal
            canclePay={CloseAcoountModal}
            pay={Pay}
            copyAccount={(text: string) => CopyAccount(text)}
            totalPrice={totalPrice}
            accountInfo={accountInfo}
          />
        </DarkWrapper>
      )}
      {isCouponModal && (
        <DarkWrapper>
          <CouponModal
            onClose={() => setIsCouponModal(false)}
            CheckCoupon={CheckCoupon}
            appliedCoupon={appliedCoupon}
            setAppliedCoupon={setAppliedCoupon}
          />
        </DarkWrapper>
      )}
    </Wrapper>
  );
};

export default ShoppingCartPage;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;
const ShoppingListEmpty = styled.div`
  box-sizing: border-box;
  padding: 1em;

  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 98px - 200px);

  img {
    width: 60%;
  }
  p {
    color: ${({ theme }) => theme.colors.Black01};
    ${({ theme }) => theme.fonts.Bold18}
  }
`;

const ShoppingListWrapper = styled.div`
  box-sizing: border-box;
  padding: 0 1.25em;
  /* margin-top: 2em; */
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: calc(100vh - 160px - 100px - 2em);
  overflow-y: auto;
`;

const DarkWrapper = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0.4);
  z-index: 11;
`;
