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

  const trimmed = String(path).trim();
  if (!trimmed || trimmed.toLowerCase() === "null") return null; // 🔒 "null" 문자열 방어

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const base = (import.meta.env.VITE_BASE_URL ?? "").replace(/\/+$/, "");
  const rel = trimmed.replace(/^\/+/, "");
  return base ? `${base}/${rel}` : `/${rel}`;
}

/** ✅ 정규화된 아이템 타입 */
export type NormalizedOrderItem = {
  id: number;
  kind: "menu" | "setmenu";
  name: string;
  price: number;             // ✅ fixed_price 우선
  image: string | null;      // 절대 URL or null
  quantity: number;
};

/** ✅ 메뉴/세트를 공통 구조로 정규화: fixed_price → (menu|set)_price */
export function normalizeOrder(item: RawOrderItem): NormalizedOrderItem {
  const kind: "menu" | "setmenu" = item.type === "setmenu" ? "setmenu" : "menu";

  const id =
    kind === "menu" ? (item.menu_id ?? 0) : (item.set_id ?? 0);

  const name =
    kind === "menu"
      ? (item.menu_name ?? "")
      : (item.set_name ?? "");

  const rawImg =
    kind === "menu" ? item.menu_image : item.set_image;

  const image = toAbsoluteUrl(rawImg);

  // ✅ 가격: fixed_price 최우선 → (menu|set)_price 폴백
  const price =
    typeof item.fixed_price === "number"
      ? item.fixed_price
      : kind === "menu"
      ? (typeof item.menu_price === "number" ? item.menu_price : 0)
      : (typeof item.set_price === "number" ? item.set_price : 0);

  const quantity = typeof item.quantity === "number" ? item.quantity : 0;

  return { id, kind, name, price, image, quantity };
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL ?? "",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export async function getOrderList(tableNum: number, boothId: number) {
  const res = await api.get<OrderListResponse>(`/api/v2/tables/${tableNum}/orders/`, {
    headers: { "booth-id": String(boothId) },
  });
  return res.data;
}
