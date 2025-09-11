import * as S from './MenuListHeader.styled';
import { useState } from 'react';
import { MENULISTPAGE_CONSTANTS } from '../../_constants/menulistpageconstants';
import alram from '../../../../assets/icons/alram.svg';
import CallModal from '../modals/callmodal/CallModal';

interface MenuListHeaderProps {
  onNavigate: () => void;
  onReceipt: () => void;
  cartCount: number;
}

const MenuListHeader = ({
  onNavigate,
  onReceipt,
  cartCount,
}: MenuListHeaderProps) => {
  const [ismodalOpen, setIsModalOpen] = useState(false);
  const tableNum = Number(localStorage.getItem('tableNum'));

  return (
    <S.Wrapper>
      <S.Logo src={MENULISTPAGE_CONSTANTS.HEADER.IMAGE.LOGOPNG} />
      <S.Icons>
        <S.Hochul onClick={() => setIsModalOpen(true)}>
          직원 호출
          <S.Icon src={alram} />
        </S.Hochul>
        <S.Icon
          src={MENULISTPAGE_CONSTANTS.HEADER.IMAGE.RECEIPT}
          onClick={onReceipt}
        />
        <S.IconWrap>
          <S.Icon
            src={MENULISTPAGE_CONSTANTS.HEADER.IMAGE.CART}
            onClick={onNavigate}
          />
          {cartCount > 0 && <S.Badge />}
        </S.IconWrap>
      </S.Icons>
      {ismodalOpen && (
        <CallModal onClose={() => setIsModalOpen(false)} tableNum={tableNum} />
      )}
    </S.Wrapper>
  );
};

export default MenuListHeader;
