import * as S from './MenuListPage.styled';

import useMenuListPage from './_hooks/useMenuListPage';

import MenuListPageHeader from './_components/MenuListPageHeader/MenuListPageHeader';
import MenuList from './_components/MenuList/MenuList';
import MenuAssignModal from './_components/modals/MenuAssignModal/MenuAssignModal';
import MenuAssignSidModal from './_components/modals/menuAssignSideModal/MenuAssignSideModal';
import MenuListHeader from './_components/Header/MenuListHeader';

import Loading from '@components/loading/Loading';

const MenulistPage = () => {
  const {
    isLoading,
    menuItems,
    boothName,
    tableNum,
    cartCount,
    sectionRefs,
    selectedCategory,
    handleScrollTo,
    handleOpenModal,
    selectedItem,
    isModalOpen,
    isModalOpen2,
    isClosing,
    handleSubmitItem,
    handleFirstModal,
    handleSecondModal,
    handleNavigate,
    handleReceipt,
    count,
    isMin,
    isMax,
    showToast,
    handleIncrease,
    handleDecrease,
  } = useMenuListPage();

  if (isLoading) return <Loading />;
  return (
    <S.Wrapper>
      <MenuListHeader
        onNavigate={handleNavigate}
        onReceipt={handleReceipt}
        cartCount={cartCount}
      />
      {tableNum !== null && (
        <MenuListPageHeader
          title={boothName}
          tableNumber={tableNum}
          onSelectCategory={handleScrollTo}
          selectedCategory={selectedCategory}
        />
      )}
      <S.Container>
        <MenuList
          items={menuItems}
          sectionRefs={sectionRefs}
          selectedCategory={selectedCategory}
          onOpenModal={handleOpenModal}
        />
      </S.Container>
      {isModalOpen && selectedItem && (
        <MenuAssignModal
          item={selectedItem}
          onClose={handleFirstModal}
          onSubmit={handleSubmitItem}
          isClosing={isClosing}
          count={count}
          isMin={isMin}
          isMax={isMax}
          showToast={showToast}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
      )}
      {isModalOpen2 && (
        <MenuAssignSidModal
          onClose={handleSecondModal}
          onNavigate={handleNavigate}
        />
      )}
    </S.Wrapper>
  );
};

export default MenulistPage;
