import { instance } from "@services/instance";

export interface BoothAdItem {
  boothName: string;
  boothImage: string;
  hostName: string;
  boothAllTable: number;
  boothUsageTable: number;
  location: string;
  dates: string[];
}

export interface BoothAdResponse {
  statusCode: number;
  message: string;
  data: {
    boothDetails: BoothAdItem[];
  };
}

export type BoothInfo = BoothAdItem[];

export const fetchBoothAds = async (): Promise<BoothInfo> => {
  const res = await instance.get<BoothAdResponse>(
    "/api/v2/public/d-order/booths/ad/"
  );
  return res.data?.data?.boothDetails ?? [];
};
