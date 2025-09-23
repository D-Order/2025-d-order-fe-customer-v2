export type AdDate = "2025-09-24" | "2025-09-25" | "2025-09-26";

export type NoContactBoothInfo = {
  date: AdDate;
  booths: string[];
};

export const NO_CONTACT_BOOTH_INFO: NoContactBoothInfo[] = [
  {
    date: "2025-09-24",
    booths: [
      "불교대학",
      "법과대학",
      "사범대학",
      "식품산업관리학과",
      "광고홍보학과",
      "행정학과",
      "디프",
    ],
  },
  {
    date: "2025-09-25",
    booths: [
      "참사랑봉사단",
      "불교대학",
      "법과대학",
      "행정학과",
      "정치외교학과",
      "디프",
      "경영학과",
    ],
  },
  {
    date: "2025-09-26",
    booths: ["첨단융합대학", "체육교육과", "디프"],
  },
];
