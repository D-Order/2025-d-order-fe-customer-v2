// src/pages/MenuListPage/_services/MenuListService.ts
import { instance } from '@services/instance';

export type ApiSeat = {
  seat_type: 'table' | 'person' | 'none' | string;
  seat_tax_table?: number;
  seat_tax_person?: number;
};

export type ApiMenu = {
  menu_id: number;
  booth_id: number;
  menu_name: string;
  menu_description: string;
  menu_category: '메뉴' | '음료' | 'seat_fee' | string;
  menu_price: number;
  menu_amount: number;
  menu_image: string | null;
  is_soldout: boolean;
};

export type ApiSetMenu = {
  setmenu_id: number;
  setmenu_name: string;
  setmenu_description: string;
  setmenu_price: number;
  setmenu_image: string | null;
  is_soldout: boolean;
  menu_items: { menu_id: number; quantity: number }[];
};

export type BoothAllMenusResponse = {
  status: number;
  message: string;
  data: {
    booth_id: number;
    table: ApiSeat;
    menus: ApiMenu[];
    setmenus: ApiSetMenu[];
  };
};

export const MenuListService = {
  // ✅ 실제 스펙에 맞춘 GET
  fetchAllMenus: async (boothId: number) => {
    const res = await instance.get<BoothAllMenusResponse>(
      `/api/v2/booth/${boothId}/all-menus/`
    );
    return res.data.data; // { booth_id, table, menus, setmenus }
  },
};
