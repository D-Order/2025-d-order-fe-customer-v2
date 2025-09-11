import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// import { MenuListService } from '../_services/MenuListService';
import { ROUTE_CONSTANTS } from '@constants/RouteConstants';
import { MENULISTPAGE_CONSTANTS } from '../_constants/menulistpageconstants';
import { useShoppingCartStore } from '@stores/shoppingCartStore';
// import { MenuListPageService } from '../_Dummy/MenuListPageService';
import { MenuListService } from '../_services/MenuListService';
import { CartService } from '../_services/CartService';

const SCROLL_OFFSET = 120;

type MenuCategory = 'tableFee' | 'set' | 'menu' | 'drink';
interface BaseMenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  soldOut: boolean;
  category: MenuCategory;
}

interface SetMenuItem extends BaseMenuItem {
  category: 'set';
  menuItems: {
    menu_id: number;
    quantity: number;
  }[];
}

// type MenuItem = BaseMenuItem | SetMenuItem;

const useMenuListPage = () => {
  const navigate = useNavigate();

  const cart = useShoppingCartStore((state) => state.cart);
  const cartCount = cart.length;

  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [boothName, setBoothName] = useState<string>('');

  const tableFeeRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const drinkRef = useRef<HTMLDivElement>(null);

  const sectionRefs = {
    tableFee: tableFeeRef,
    set: setRef,
    menu: menuRef,
    drink: drinkRef,
  };

  const [selectedCategory, setSelectedCategory] = useState<
    'tableFee' | 'set' | 'menu' | 'drink'
  >('tableFee');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [tableNum, setTableNum] = useState<number | null>(null);

  const [count, setCount] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const resetCount = () => setCount(1);
  const isMin = count <= 1;
  const isMax = selectedItem ? count > selectedItem.quantity : false;
  const isMax2 = selectedItem ? count >= selectedItem.quantity : false;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const boothId = localStorage.getItem('boothId') ?? '1';
        const tableId = localStorage.getItem('tableNum') ?? '1';
        const boothIdNumber = parseInt(boothId, 10);
        const tableNumber = tableId ? parseInt(tableId, 10) : null;

        if (Number.isNaN(boothIdNumber)) throw new Error('Invalid boothId');

        // ✅ 실제 API 호출
        const { table, menus, setmenus } = await MenuListService.fetchAllMenus(
          boothIdNumber
        );

        setTableNum(tableNumber);

        // 1) seat_fee 후보(메뉴 배열 안) — id/이미지 등 메타 재활용용
        const seatFeeFromMenus = Array.isArray(menus)
          ? menus.find((m) => m.menu_category === 'seat_fee')
          : undefined;

        // 2) 테이블 이용료 아이템 구성 (table.seat_type 우선)
        let seatItem: BaseMenuItem | null = null;
        const NON_IMG = MENULISTPAGE_CONSTANTS.MENUITEMS.IMAGES.NONIMAGE;

        if (table?.seat_type === 'table') {
          seatItem = {
            id: seatFeeFromMenus?.menu_id ?? 999001,
            name: seatFeeFromMenus?.menu_name ?? '테이블 이용료',
            description:
              seatFeeFromMenus?.menu_description ??
              '테이블 기준 1회 필수 주문이 필요해요.',
            price: table?.seat_tax_table ?? seatFeeFromMenus?.menu_price ?? 0,
            imageUrl: seatFeeFromMenus?.menu_image ?? NON_IMG,
            quantity: 1, // 테이블당 1회
            soldOut: false,
            category: 'tableFee',
          };
        } else if (table?.seat_type === 'person') {
          seatItem = {
            id: seatFeeFromMenus?.menu_id ?? 999002,
            name: seatFeeFromMenus?.menu_name ?? '테이블 이용료',
            description:
              seatFeeFromMenus?.menu_description ??
              '인원 수에 맞춰 주문해 주세요.',
            price: table?.seat_tax_person ?? seatFeeFromMenus?.menu_price ?? 0,
            imageUrl: seatFeeFromMenus?.menu_image ?? NON_IMG,
            quantity: 100, // 인원 기준: 충분히 크게(클라에서 상한 체크)
            soldOut: false,
            category: 'tableFee',
          };
        } else if (table?.seat_type === 'none') {
          seatItem = {
            id: seatFeeFromMenus?.menu_id ?? 999003,
            name: seatFeeFromMenus?.menu_name ?? '테이블 이용료',
            description:
              seatFeeFromMenus?.menu_description ??
              '현재 테이블 이용이 제한되어 있어요.',
            price: 0,
            imageUrl: seatFeeFromMenus?.menu_image ?? NON_IMG,
            quantity: 0,
            soldOut: true,
            category: 'tableFee',
          };
        } else {
          // table 정보가 없을 때: seat_fee가 menus에 있으면 사용, 아니면 노출 생략
          if (seatFeeFromMenus) {
            seatItem = {
              id: seatFeeFromMenus.menu_id,
              name: seatFeeFromMenus.menu_name ?? '테이블 이용료',
              description:
                seatFeeFromMenus.menu_description ?? '테이블 이용료입니다.',
              price: seatFeeFromMenus.menu_price ?? 0,
              imageUrl: seatFeeFromMenus.menu_image ?? NON_IMG,
              quantity: seatFeeFromMenus.menu_amount ?? 1, // 백엔드 수량이 매우 클 수 있음
              soldOut: !!seatFeeFromMenus.is_soldout,
              category: 'tableFee',
            };
          } else {
            seatItem = null; // 아예 노출하지 않음
          }
        }

        // 3) 일반 메뉴 매핑 (seat_fee 제외)
        const mappedMenus: BaseMenuItem[] = (menus ?? [])
          .filter((m) => m.menu_category !== 'seat_fee')
          .map((m) => {
            const mappedCategory: 'menu' | 'drink' =
              m.menu_category === '음료' ? 'drink' : 'menu';
            return {
              id: m.menu_id,
              name: m.menu_name,
              description: m.menu_description,
              price: m.menu_price,
              imageUrl: m.menu_image ?? undefined,
              quantity: m.menu_amount,
              soldOut: !!m.is_soldout || m.menu_amount <= 0,
              category: mappedCategory,
            };
          });

        // 4) 세트 메뉴 매핑
        const mappedSets: SetMenuItem[] = (setmenus ?? []).map((s) => ({
          id: s.setmenu_id,
          name: s.setmenu_name,
          description: s.setmenu_description,
          price: s.setmenu_price,
          imageUrl: s.setmenu_image ?? undefined,
          quantity: Number.MAX_SAFE_INTEGER, // 세트 수량 제한 없으면 충분히 크게
          soldOut: !!s.is_soldout,
          category: 'set',
          menuItems: s.menu_items ?? [],
        }));

        const allItems = [
          ...(seatItem ? [seatItem] : []),
          ...mappedSets,
          ...mappedMenus,
        ];

        setMenuItems(allItems);
        // (선택) 부스명은 별도 API/스토어에서 받는다면 여기서 setBoothName 호출
        // setBoothName(boothNameFromElsewhere)
      } catch (e) {
        console.error(e);
        setMenuItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDecrease = () => {
    if (!isMin) setCount((prev) => prev - 1);
  };

  const handleIncrease = () => {
    if (isMax2) {
      setShowToast(true);
    }
    setCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (showToast) {
      const timeout = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [showToast]);

  const handleScrollTo = (category: 'tableFee' | 'set' | 'menu' | 'drink') => {
    setSelectedCategory(category);
    const target = sectionRefs[category].current;
    if (target) {
      const top = target.offsetTop - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      let activeCategory: 'tableFee' | 'set' | 'menu' | 'drink' | null = null;
      let maxTop = -Infinity;

      const scrollTop = window.scrollY;
      const scrollBottom = scrollTop + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      if (pageHeight - scrollBottom < 10) {
        setSelectedCategory('drink');
        return;
      }

      Object.entries(sectionRefs).forEach(([key, ref]) => {
        if (ref.current) {
          const rectTop = ref.current.getBoundingClientRect().top;
          if (rectTop <= SCROLL_OFFSET && rectTop > maxTop) {
            maxTop = rectTop;
            activeCategory = key as 'tableFee' | 'set' | 'menu' | 'drink';
          }
        }
      });

      if (activeCategory && activeCategory !== selectedCategory) {
        setSelectedCategory(activeCategory);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedCategory]);

  const handleOpenModal = (item: any) => {
    if (item.category === 'tableFee' && item.soldOut) return;
    setSelectedItem(item);
    resetCount();
    setIsModalOpen(true);
  };

  const [errorToast, setErrorToast] = useState<string | null>(null);

  const handleSubmitItem = async () => {
    if (!selectedItem) return;
    if (!tableNum) {
      setErrorToast('테이블 번호를 확인할 수 없어요.');
      return;
    }
    if (count <= 0) return;

    // ✅ type 매핑: set 은 'set', 나머지는 'menu'
    const type: 'menu' | 'set' =
      selectedItem.category === 'set' ? 'set' : 'menu';

    try {
      // 🔗 장바구니 API 호출
      await CartService.add({
        table_num: tableNum,
        type,
        id: selectedItem.id,
        quantity: count,
      });

      // 기존 UX 흐름 유지
      setIsClosing(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setIsClosing(false);
        setIsModalOpen2(true);
      }, 300);
    } catch (e: any) {
      console.error(e);
      setErrorToast(
        e?.response?.data?.message ||
          '장바구니 담기 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.'
      );
    } finally {
    }
  };

  const handleFirstModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSecondModal = () => {
    setIsModalOpen2(false);
  };

  return {
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
    handleNavigate: () => navigate(ROUTE_CONSTANTS.SHOPPINGCART),
    handleReceipt: () => navigate(ROUTE_CONSTANTS.ORDERLIST),
    count,
    isMin,
    isMax,
    showToast,
    handleDecrease,
    handleIncrease,
  };
};

export default useMenuListPage;
