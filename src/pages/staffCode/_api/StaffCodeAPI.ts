import { AxiosError } from "axios";

// @services/instance에서 미리 정의된 인스턴스를 불러와 사용
import { instance } from "@services/instance";

// API 응답 타입 정의
export interface OrderCheckGetResponse {
  status: string;
  message: string;
  code: number;
  data: {
    order_amount: number;
    seat_count: number;
  } | null;
}

// api주문생성에대한 응답타입
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
    coupon: string;
    booth_total_revenues: number;
  } | null;
}

// 쿠폰 적용 후 'data' 객체의 상세 정보 타입
export interface CouponDetails {
  coupon_name: string;
  discount_type: "percent" | "amount";
  discount_value: number;
  subtotal: number;
  table_fee: number;
  total_price_before: number;
  total_price_after: number;
}

// 쿠폰 적용 API의 전체 응답 타입
export interface CouponResponse {
  status: string;
  code: number;
  data: CouponDetails | null;
}

// 프론트엔드에서 사용하는 직원확인페이지에서 받아와야되는 타입
export interface TableOrderInfo {
  tableNumber: string;
  seat_count: number;
  totalPrice: number;
}

// 직원 확인용 비밀번호입력 후 주문생성되는 post api
export const verifyStaffCode = async (code: string): Promise<boolean> => {
  try {
    const tableNum = localStorage.getItem("tableNum");
    const boothId = localStorage.getItem("boothId");

    const response = await instance.post<OrderCheckPostResponse>(
      "/api/v2/tables/orders/order_check/",
      {
        password: code,
        table_num: tableNum,
      },
      {
        headers: {
          "Booth-Id": boothId,
        },
      }
    );

    // status가 success인지 확인하여 성공 여부 반환
    return response.data.status === "success";
  } catch (error: unknown) {
    // 401 에러는 비밀번호가 올바르지 않은 경우
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.status === 401
    ) {
      return false;
    }

    // 기타 에러도 검증 실패로 처리
    return false;
  }
};

// 테이블 주문 정보 확인 API
export const fetchTableOrderInfo = async (): Promise<TableOrderInfo | null> => {
  try {
    const tableNum = localStorage.getItem("tableNum");
    const boothId = localStorage.getItem("boothId");

    const response = await instance.get<OrderCheckGetResponse>(
      "/api/v2/tables/orders/order_check/",
      {
        params: {
          table_num: tableNum,
        },
        headers: {
          "Booth-Id": boothId,
        },
      }
    );
    console.log("API 응답:", response);
    if (response.data.status === "success" && response.data.data) {
      return {
        tableNumber: tableNum || "",
        totalPrice: response.data.data.order_amount,
        seat_count: response.data.data.seat_count,
      };
    }

    return null;
  } catch (error: unknown) {
    // 404 에러의 경우는 진행 중인 주문이 없다는 예상된 에러이므로 null 반환
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.status === 404
    ) {
      return null;
    }

    // 기타 예상치 못한 에러는 throw
    throw error;
  }
};

///쿠폰적용 장바구니에서 적용하기로함
// export const applyCoupon = async (
//   couponCode: string
// ): Promise<CouponDetails | null> => {
//   try {
//     const tableNum = localStorage.getItem("tableNum");
//     const boothId = localStorage.getItem("boothId");

//     if (!tableNum || !boothId) {
//       console.error(
//         "applyCoupon: 'tableNum' 또는 'boothId'가 localStorage에 없습니다."
//       );
//       return null;
//     }

//     const response = await instance.post<CouponResponse>( // ✅ 변경된 타입 적용
//       "/api/v2/cart/apply-coupon/",
//       {
//         coupon_code: couponCode,
//         table_num: tableNum,
//       },
//       {
//         headers: {
//           "Booth-Id": boothId,
//         },
//       }
//     );

//     if (response.data.status === "success" && response.data.data) {
//       return response.data.data;
//     }

//     return null;
//   } catch (error: unknown) {
//     console.error("쿠폰 적용에 실패했습니다:", error);
//     throw error;
//   }
// };
