import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export interface OrderItem {
  id: number;
  cart_id: number;
  menu_id: number;
  menu_name: string;
  menu_image: string | null;
  menu_price: number;
  menu_num: number;
  order_status: string;
  created_at: string;
}

export interface OrderListResponse {
  status: string;
  message: string;
  code: number;
  total_price?: number;
  data?: OrderItem[];
}

// ✅ boothId와 tableId를 헤더에 포함하여 요청
export const getOrderList = async (
  tableId: number,
  boothId: number
): Promise<OrderListResponse> => {
  const response = await axios.get(`${baseURL}/api/tables/orders/`, {
    headers: {
      "X-Booth-Id": boothId,
      "X-Table-Number": tableId,
    },
  });

  return response.data;
};
