import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// import { MenuListService } from '../_services/MenuListService';
import { ROUTE_CONSTANTS } from '@constants/RouteConstants';
import { MENULISTPAGE_CONSTANTS } from '../_constants/menulistpageconstants';
import { useShoppingCartStore } from '@stores/shoppingCartStore';
import { MenuListPageService } from '../_Dummy/MenuListPageService';

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

        if (!boothId) {
          return;
        }
        // const boothIdNumber = parseInt(boothId, 10);
        const tableNumber = tableId ? parseInt(tableId, 10) : null;

        // const { menus, seat, boothName } = await MenuListService.fetchMenuItems(
        //   boothIdNumber
        // );

        // setBoothName(boothName);

        const dummyMenus = [
          ...MenuListPageService.fetchMenuItems(),
          ...MenuListPageService.fetchSetMenus(),
        ];

        setBoothName('더미 부스');

        const dummySeat = dummyMenus.find(
          (item) => item.category === 'tableFee'
        );

        setTableNum(tableNumber);

        let seatItem = null;

        if (dummySeat && !dummySeat.soldOut) {
          seatItem = {
            id: dummySeat.id,
            name: dummySeat.name,
            description: dummySeat.description ?? '테이블 이용료입니다.',
            price: dummySeat.price,
            imageUrl:
              dummySeat.imageUrl ||
              MENULISTPAGE_CONSTANTS.MENUITEMS.IMAGES.NONIMAGE,
            quantity: dummySeat.quantity,
            soldOut: false,
            category: 'tableFee' as const,
          };
        } else {
          seatItem = {
            id: dummySeat?.id || 999,
            name: '테이블 이용료',
            description: '현재 테이블 이용이 제한되어 있어요.',
            price: 0,
            imageUrl: MENULISTPAGE_CONSTANTS.MENUITEMS.IMAGES.NONIMAGE,
            quantity: 0,
            soldOut: true,
            category: 'tableFee' as const,
          };
        }

        // ✅ 나머지 메뉴 구성
        const parsedMenus = dummyMenus
          .filter((item) => item.category !== 'tableFee')
          .map((menu) => {
            const mappedCategory =
              menu.category === 'drink'
                ? 'drink'
                : menu.category === 'menu'
                ? 'menu'
                : menu.category === 'set'
                ? 'set'
                : 'menu';

            const commonProps = {
              id: menu.id,
              name: menu.name,
              description: menu.description,
              price: menu.price,
              imageUrl: menu.imageUrl,
              quantity: menu.quantity,
              soldOut: menu.soldOut,
              category: mappedCategory as 'menu' | 'drink' | 'set',
            };

            if (menu.category === 'set') {
              return {
                ...commonProps,
                menuItems: (menu as SetMenuItem).menuItems,
              };
            }

            return commonProps;
          });

        // if (seat && seat.seat_type === 'person') {
        //   seatItem = {
        //     id: seat.seat_type_menu_id,
        //     name: '테이블 이용료',
        //     description: '인원 수에 맞춰 주문해 주세요.',
        //     price: seat.seat_tax_person,
        //     imageUrl: MENULISTPAGE_CONSTANTS.MENUITEMS.IMAGES.NONIMAGE,
        //     quantity: 100,
        //     soldOut: false,
        //     category: 'tableFee' as const,
        //   };
        // } else if (seat && seat.seat_type === 'table') {
        //   seatItem = {
        //     id: seat.seat_type_menu_id,
        //     name: '테이블 이용료',
        //     description: '테이블 기준 1회 필수 주문이 필요해요.',
        //     price: seat.seat_tax_table,
        //     imageUrl: MENULISTPAGE_CONSTANTS.MENUITEMS.IMAGES.NONIMAGE,
        //     quantity: 1,
        //     soldOut: false,
        //     category: 'tableFee' as const,
        //   };
        // } else {
        //   seatItem = {
        //     id: seat.seat_type_menu_id,
        //     name: '테이블 이용료',
        //     description: '현재 테이블 이용이 제한되어 있어요.',
        //     price: 0,
        //     imageUrl: MENULISTPAGE_CONSTANTS.MENUITEMS.IMAGES.NONIMAGE,
        //     quantity: 0,
        //     soldOut: true,
        //     category: 'tableFee' as const,
        //   };
        // }

        // const parsedMenus = Array.isArray(menus)
        //   ? menus.map((menu: any) => {
        //       const mappedCategory =
        //         menu.menu_category === '음료'
        //           ? 'drink'
        //           : menu.menu_category === '메뉴'
        //           ? 'menu'
        //           : 'menu';

        //       return {
        //         id: menu.menu_id,
        //         name: menu.menu_name,
        //         description: menu.menu_description,
        //         price: menu.menu_price,
        //         imageUrl: menu.menu_image,
        //         quantity: menu.menu_amount,
        //         soldOut: menu.menu_amount <= 0,
        //         category: mappedCategory as 'menu' | 'drink',
        //       };
        //     })
        //   : [];

        const allItems = [...(seatItem ? [seatItem] : []), ...parsedMenus];

        setMenuItems(allItems);
      } catch (error) {
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

  const handleSubmitItem = () => {
    useShoppingCartStore.getState().addToCart({
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      image: selectedItem.imageUrl || '',
      quantity: count,
      inventory: selectedItem.quantity,
    });

    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedItem(null);
      setIsClosing(false);
      setIsModalOpen2(true);
    }, 300);
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
