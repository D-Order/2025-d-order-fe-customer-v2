export interface accountInfoType {
  depositor: string;
  bank: string;
  account: string;
}

export interface Menu {
  id: number;
  is_soldout: boolean;
  menu_amount: number;
  menu_image?: string;
  menu_name: string;
  menu_price: number;
  quantity: number;
}

export interface SetMenu {}

export interface ShoppingItemDataType {
  booth_id: number;
  id: number;
  menus?: Menu[];
  set_menus?: SetMenu[];
  table_num: number;
}

export interface ShoppingItemResponseType {
  data: {
    cart: ShoppingItemDataType;
    subtotal: number;
    table_fee: number;
    total_price: number;
  };
}
