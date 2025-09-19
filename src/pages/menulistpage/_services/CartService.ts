// src/pages/MenuListPage/_services/CartService.ts
import { instance } from '@services/instance';

type CartType = 'menu' | 'set_menu';

export const CartService = {
  add: async ({
    table_num,
    type,
    id,
    quantity,
  }: {
    table_num: number;
    type: CartType;
    id: number;
    quantity: number;
  }) => {
    const boothId = localStorage.getItem('boothId');

    const res = await instance.post(
      '/api/v2/cart/',
      {
        table_num,
        type,
        id,
        quantity,
      },
      {
        headers: {
          'Booth-ID': boothId,
        },
      }
    );
    return res.data;
  },
  exists: async (table_num: number): Promise<boolean> => {
    const boothId = localStorage.getItem('boothId');
    const res = await instance.get(
      `/api/v2/cart/exists/?table_num=${table_num}`,
      {
        headers: { 'Booth-ID': boothId },
      }
    );
    console.log(res);
    return res.data?.data?.has_cart_items ?? false;
  },
};
