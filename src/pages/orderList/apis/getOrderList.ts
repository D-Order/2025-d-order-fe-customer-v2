// src/pages/orderList/apis/getOrderList.ts
import axios from "axios";

export interface RawOrderItem {
  type: "menu" | "setmenu";
  // menu 
  menu_id?: number;
  menu_name?: string;
  menu_price?: number;
  menu_image?: string | null;
  menu_category?: string;

  // setmenu 
  set_id?: number;
  set_name?: string;
  set_price?: number;
  set_image?: string | null;

  // 공통
  fixed_price?: number;
  quantity: number;
  status: "pending" | "cooked" | "served";
}

export interface OrderListResponse {
  status: "success" | "error";
  code: number;
  data?: {
    order_amount: number;
    orders: RawOrderItem[];
  };
  message?: string;
}

export function toAbsoluteUrl(path?: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const base = (import.meta.env.VITE_BASE_URL ?? "").replace(/\/+$/, "");
  const rel = String(path).replace(/^\/+/, "");
  return base ? `${base}/${rel}` : `/${rel}`;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL ?? "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getOrderList(tableNum: number, boothId: number) {
  const res = await api.get<OrderListResponse>(`/api/v2/tables/${tableNum}/orders/`, {
    headers: { "booth-id": String(boothId) },
  });
  return res.data;
}
