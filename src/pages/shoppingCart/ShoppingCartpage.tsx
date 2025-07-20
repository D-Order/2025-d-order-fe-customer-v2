import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ShoppingHeader from "./_components/ShoppingHeader";
import Character from "@assets/images/character.svg";
import ShoppingItem from "./_components/ShoppingItem";
import ShoppingFooter from "./_components/ShoppingFooter";
import ConfirmModal from "./_modal/ConfitmMotal";
import SendMoneyModal from "./_modal/sendMoneyModal";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";
import { toast } from "react-toastify";
import { IMAGE_CONSTANTS } from "@constants/ImageConstants";
import useShoppingCartPage from "./_hooks/useShoppingCartPage";

const ShoppingCartPage = () => {
  const navigate = useNavigate();

  const {
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
    accountInfo,
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

  return (
    <Wrapper>
      <ShoppingHeader
        text="장바구니"
        goBack={() => {
          navigate(ROUTE_CONSTANTS.MENULIST);
        }}
      />

      {cart.length == 0 ? (
        <ShoppingListEmpty>
          <img src={Character} alt="이미지" />
          <p>아직 장바구니에 담긴 메뉴가 없어요.</p>
        </ShoppingListEmpty>
      ) : (
        <>
          <ShoppingListWrapper>
            {cart.map((item) => (
              <ShoppingItem
                key={item.id}
                item={item}
                onIncrease={() => increase(item.id)}
                onDecrease={() => decrease(item.id)}
                deleteItem={() => deleteItem(item.id)}
              />
            ))}
          </ShoppingListWrapper>
          <ShoppingFooter
            totalPrice={totalPrice}
            CheckShoppingItems={CheckShoppingItems}
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
      {isSendMoneyModal && (
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
