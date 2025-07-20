import { useEffect, useState } from "react";
import { getOrderList, OrderListResponse } from "../apis/getOrderList";

export const useOrderList = (tableId: number, boothId: number) => {
  const [orderData, setOrderData] = useState<OrderListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrderList(tableId, boothId);
        setOrderData(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (tableId && boothId) {
      fetchOrders();
    }
  }, [tableId, boothId]);

  return { orderData, loading, error };
};
