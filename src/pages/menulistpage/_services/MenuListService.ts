import { instance } from '@services/instance';

export const MenuListService = {
  fetchMenuItems: async (boothId: number) => {
    const response = await instance.get(`/api/booths/${boothId}/menus/`);
    const { menus, seat, booth_name } = response.data.data ?? {};

    return { menus, seat, boothName: booth_name };
  },
};
