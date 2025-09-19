import { AxiosError } from "axios";
import { instance } from "@services/instance";

export interface OrderCheckGetResponse {
  status: string;
  message: string;
  code: number;
  data: {
    order_amount: number;
    seat_count: number;
  } | null;
}

export interface OrderCheckPostResponse {
  status: string;
  code: number;
  message: string;
  data: {
    order_id: number;
    order_amount: number;
    subtotal: number;
    table_fee: number;
    coupon_discount: number;
    coupon: string | null;
    booth_total_revenues: number;
  } | null;
}

export interface TableOrderInfo {
  tableNumber: string;
  seat_count: number;
  totalPrice: number;
}

export const verifyStaffCode = async (
  code: string,
  options?: { couponCode?: string }
): Promise<boolean> => {
  try {
    const tableNum = localStorage.getItem("tableNum");
    const boothId = localStorage.getItem("boothId");

    // 1) 훅 옵션
    let coupon = options?.couponCode?.trim();

    // 2) URL에서 재확인 (coupon_code > code > coupon, 대소문자 변형 포함)
    if (!coupon && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      coupon =
        params.get("coupon_code") ||
        params.get("code") ||
        params.get("coupon") ||
        params.get("COUPON_CODE") ||
        params.get("CODE") ||
        params.get("COUPON") ||
        undefined;
      if (coupon) coupon = coupon.trim();
    }

    // 3) localStorage 백업
    if (!coupon) {
      const fromLS = localStorage.getItem("coupon_code");
      if (fromLS) coupon = fromLS.trim();
    }

    const body: Record<string, any> = {
      password: code,
      table_num: tableNum,
    };
    if (coupon) body.coupon_code = coupon;

    console.log("[API] request body =", body);
    console.log("[API] headers.Booth-ID =", boothId);

    const response = await instance.post<OrderCheckPostResponse>(
      "/api/v2/tables/orders/order_check/",
      body,
      {
        headers: {
          "Booth-ID": boothId,
        },
      }
    );

    return response.data.status === "success";
  } catch (error : unknown) {
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.status === 401
    ) {
      // 비밀번호 불일치
      return false;
    }
    return false;
  }
};

// 진행 중 주문/장바구니 합산 정보 확인 (GET) — 그대로 유지
export const fetchTableOrderInfo = async (): Promise<TableOrderInfo | null> => {
  try {
    const tableNum = localStorage.getItem("tableNum");
    const boothId = localStorage.getItem("boothId");

    const response = await instance.get<OrderCheckGetResponse>(
      "/api/v2/tables/orders/order_check/",
      {
        params: { table_num: tableNum },
        headers: { "Booth-Id": boothId },
      }
    );

    if (response.data.status === "success" && response.data.data) {
      return {
        tableNumber: tableNum || "",
        totalPrice: response.data.data.order_amount,
        seat_count: response.data.data.seat_count,
      };
    }
    return null;
  } catch (error: unknown) {
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.status === 404
    ) {
      return null;
    }
    throw error;
  }
};
