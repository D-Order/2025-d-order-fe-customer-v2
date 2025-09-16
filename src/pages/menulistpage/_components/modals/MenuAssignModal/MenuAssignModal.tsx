import * as S from './MenuAssignModal.styled';

import { MENULISTPAGE_CONSTANTS } from '../../../_constants/menulistpageconstants';

interface MenuAssignModalProps {
  item: {
    name: string;
    price: number;
    quantity: number;
    category: string;
    originprice?: number;
  };
  count: number;
  isMin: boolean;
  isMax: boolean;
  showToast: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  onClose: () => void;
  onSubmit: () => void;
  isClosing: boolean;
}

const MenuAssignModal = ({
  item,
  count,
  isMin,
  isMax,
  showToast,
  onDecrease,
  onIncrease,
  onClose,
  onSubmit,
  isClosing,
}: MenuAssignModalProps) => {
  const isSetMenu = item.category === 'set';
  const price = Number(item?.price ?? 0);
  return (
    <S.Wrapper>
      <S.BackWrap onClick={onClose} />
      <S.ModalWrap $isClosing={isClosing}>
        <S.Col>
          {/* <S.CloseButton onClick={onClose}>닫기</S.CloseButton> */}

          <S.Row>
            <S.Col2>
              <S.Title>{item.name}</S.Title>
              <S.Row3>
                <S.Price>
                  {item.price.toLocaleString()}
                  {MENULISTPAGE_CONSTANTS.ASSIGNMODAL.TEXT.WON}
                </S.Price>
                {isSetMenu && item.originprice && (
                  <S.Discount>
                    {Math.round(
                      ((item.originprice - price) / item.originprice) * 100
                    )}
                    %
                  </S.Discount>
                )}
              </S.Row3>
            </S.Col2>
          </S.Row>
          <S.Row2>
            <S.QuantityBox>
              <S.QuantityText>
                {MENULISTPAGE_CONSTANTS.ASSIGNMODAL.TEXT.AMOUNT}
              </S.QuantityText>
              <S.QuantityButton disabled={isMin} onClick={onDecrease}>
                {MENULISTPAGE_CONSTANTS.ASSIGNMODAL.TEXT.MINUS}
              </S.QuantityButton>
              <S.Quantity>{count}</S.Quantity>
              <S.QuantityButton disabled={isMax} onClick={onIncrease}>
                {MENULISTPAGE_CONSTANTS.ASSIGNMODAL.TEXT.PLUS}
              </S.QuantityButton>
            </S.QuantityBox>
          </S.Row2>
          <S.SubmitButton disabled={isMax} onClick={onSubmit}>
            {MENULISTPAGE_CONSTANTS.ASSIGNMODAL.TEXT.DAM}
          </S.SubmitButton>
        </S.Col>
      </S.ModalWrap>
      {showToast && (
        <S.Toast>
          <S.ToastIcon src={MENULISTPAGE_CONSTANTS.ASSIGNMODAL.IMAGES.NOTICE} />
          {MENULISTPAGE_CONSTANTS.ASSIGNMODAL.TEXT.Toast(item.quantity)}
        </S.Toast>
      )}
    </S.Wrapper>
  );
};

export default MenuAssignModal;
