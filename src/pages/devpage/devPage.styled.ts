import styled, { css } from "styled-components";

/** 팔레트(요청 색상) */
const roleHex = {
  pm: "#E9B3FB",
  fe: "#647FBC",
  be: "#EF7722",
  coop: "#F85081",
} as const;



export const PageWrap = styled.div`
  position: relative;                 /* 전역 레이어 기준점 */
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 16px 18px 64px;
  box-sizing: border-box;
`;

export const Header = styled.header`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.2rem;
  ${({ theme }) => css(theme.fonts.ExtraBold20)};
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.Orange01};

`;

export const Toolbar = styled.div`
  display: flex; 
  justify-content: center;
  gap: 0.6rem; margin-bottom: 12px; flex-wrap: wrap;
`;

export const Grid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
`;
export const GridCol = styled.div``;

export const Empty = styled.div`
  padding: 20px 12px; text-align: center;
  border: 1px dashed ${({ theme }) => theme.colors.Black02};
  border-radius: 12px; ${({ theme }) => css(theme.fonts.Medium14)};
  color: ${({ theme }) => theme.colors.Black02};
`;

export const EggBar = styled.div`
  position: sticky; bottom: 16px; margin-top: 16px; display: flex; justify-content: center;
  button{
    background: #FFF0EC; 
    color:#FF6E3F; 
    border:none; 
    border-radius:999px;
    padding: 10px 14px; ${({ theme }) => css(theme.fonts.Bold14)};
    box-shadow: 0 8px 20px rgba(0,0,0,.12);
    transition: transform .15s ease; &:active{ transform: translateY(1px); }
  }
`;

/** 카드 (모바일 간소화) */
export const CardBox = styled.div`
  position: relative;                 /* 카드 레이어 기준점 */
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.Black02};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0,0,0,.06);
`;

/** 배너: 역할별 배경 이미지 */
export const CardHeader = styled.div<{ $bg?: string }>`
  position: relative;
  height: 140px;
  background-image: ${({ $bg }) => ($bg ? `url(${$bg})` : "none")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 0.6rem;
`;
/** 아바타 */
export const Avatar = styled.img`
  width: 88px; 
  height: 88px; 
  object-fit: cover;
  border-radius: 999px; 
  position: relative; 
  margin-left: 12px; 
  margin-top: -44px;
`;

/** 본문 */
export const CardBody = styled.div`
  padding: 8px 1.2rem 6px;
  .name { ${({ theme }) => css(theme.fonts.Bold18)}; }
  .meta { display:flex; gap:6px; margin-top:8px; flex-wrap:wrap; }
`;

/** 칩: 역할(컬러) + 메타(전공/인스타) */
export const Chip = styled.span<{ tone?: "fe"|"be"|"pm"|"coop"|"meta" }>`
  display:inline-flex; align-items:center; padding:4px 8px; border-radius:999px;
  ${({ theme }) => css(theme.fonts.Medium12)};
  border: 1px solid ${({ theme }) => theme.colors.Black02};
  background:#fff; color:${({ theme }) => theme.colors.Black02};

  ${({ tone }) => tone && tone !== "meta" && css`
    border-color: ${roleHex[tone as "fe"|"be"|"pm"|"coop"]};
    color: ${roleHex[tone as "fe"|"be"|"pm"|"coop"]};
    background: ${roleHex[tone as "fe"|"be"|"pm"|"coop"]}14; /* 8% */
  `}

  ${({ tone }) => tone === "meta" && css`
    border-color: #E0E3E7;
    background: #F6F7F9;
    color: #3B3F45;
  `}
`;

export const CardFooter = styled.div`
  padding: 10px 12px 14px; display:flex; justify-content:flex-end;
  button{
    border: 1px solid ${({ theme }) => theme.colors.Black02};
    background:#fff; border-radius:12px; padding:8px 12px;
    ${({ theme }) => css(theme.fonts.Medium12)};
    transition: transform .12s ease, border-color .15s ease;
    &:active{ transform: translateY(1px); }
    &:hover{ border-color: ${roleHex.coop}; }
  }
`;

/** 필터 */
export const FilterBox = styled.div`
  display:flex; gap:6px; flex-wrap:wrap;
`;
export const FilterBtn = styled.button<{ active?: boolean }>`
  border: 1px solid ${({ theme }) => theme.colors.Orange02};
  border-radius: 999px;
  background: ${({ active }) => (active ? "#FFF0EC" : "#fff")};
  color: ${({ active }) => (active ? "#FF6E3F" : "inherit")};
  padding: 8px 12px; ${({ theme }) => css(theme.fonts.Medium14)};
  transition: background .15s ease, color .15s ease, border-color .15s ease;
`;

export const GlobalFireworksLayer = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;                           /* PageWrap 내부 100% */
  z-index: 20;
  overflow: hidden;
`;
/** 카드 Lottie 레이어: 카드 박스 내부 */
export const CardFireworksLayer = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 10;
  overflow: hidden;
`;
/** 콘페티 */
export const ConfettiLayer = styled.div`
  pointer-events: none;
  position: absolute;  /* ✅ absolute로 부모(PageWrap) 안에만 */
  inset: 0;            /* top/right/bottom/left = 0 */
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 999;        /* 페이지 최상단 레벨 (필요시 조정) */
`;
export const CardConfettiLayer = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 5;          /* 카드 콘텐츠 위에 오도록 */
`;
export const ConfettiPiece = styled.span<{ x:number; d:number }>`
  position: absolute;
  left: ${p=>p.x}%;
  top: -10px;
  font-size: 18px;
  animation: drop ${p=>p.d}ms linear forwards;
  @keyframes drop {
    to { transform: translateY(110%) rotate(720deg); opacity: .9; }
  }
`;
