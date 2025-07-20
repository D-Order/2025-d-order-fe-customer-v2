import * as S from './MenuListHeader.styled';

import { MENULISTPAGE_CONSTANTS } from '../../_constants/menulistpageconstants';
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
  return (
    <S.Wrapper>
      <S.Logo src={MENULISTPAGE_CONSTANTS.HEADER.IMAGE.LOGOPNG} />
      <S.Icons>
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
    </S.Wrapper>
  );
};

export default MenuListHeader;
