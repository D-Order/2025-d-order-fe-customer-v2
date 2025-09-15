import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;
export type OrderStatus = "pending" | "accepted" | "rejected" | "completed";

export type MenuOrderItem = {
  type: "menu";
  id: number;
  order_id: number;
  menu_id: number;
  menu_name: string;
  menu_price: number;
  fixed_price: number;
  quantity: number;
  status: OrderStatus;       
  created_at: string;
  updated_at: string;
  order_amount: number;
  table_num: number;
  menu_image: string | null;
  menu_category: string;     
};

export type SetMenuOrderItem = {
  type: "setmenu";
  id: number;
  order_id: number;
  set_id: number;
  set_name: string;
  set_price: number;
  fixed_price: number;
  quantity: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  order_amount: number;
  table_num: number;
  set_image: string | null;
};

export type RawOrderItem = MenuOrderItem | SetMenuOrderItem;

export interface OrderListData {
  order_amount: number;       
  orders: RawOrderItem[];   
}

export interface OrderListResponse {
  status: "success" | "error";
  code: number;           
  data?: OrderListData;
  message?: string;
}

export const getOrderList = async (
  tableNum: number,
  boothId: number
): Promise<OrderListResponse> => {
  const res = await axios.get(`${baseURL}api/v2/tables/${tableNum}/orders/`, {
    headers: {
      "Booth-ID": boothId,
      "Content-Type": "application/json",
    },
  });
  return res.data;
};
