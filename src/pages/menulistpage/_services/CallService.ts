// src/pages/MenuListPage/_services/CallService.ts
import { instance } from '@services/instance';

export const CallService = {
  callStaff: async ({
    tableNumber,
  }: {
    tableNumber: number;
    message: string;
  }) => {
    const boothId = localStorage.getItem('boothId');

    const res = await instance.post(
      '/api/v2/tables/call_staff/',
      {
        table_num: tableNumber,
      },
      {
        headers: { 'Booth-ID': boothId },
      }
    );

    return res.data;
  },
};
