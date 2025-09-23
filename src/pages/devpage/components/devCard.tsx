import React, { useEffect, useRef, useState } from "react";
import * as S from "../devPage.styled";
import { IMAGE_CONSTANTS } from "@constants/ImageConstants";
import Lottie from "lottie-react";
import fireWork from "@assets/lottie/fireworks.json";

export type Role = "PM" | "FE" | "BE" | "COOP";

export interface Member {
  name: string;
  role: Role;
  image?: string | null;
  major?: string;
  instagram?: string; // @id만 문자열로
}

const BG_BY_ROLE: Record<Role, string> = {
  PM: IMAGE_CONSTANTS.PMBackground,
  FE: IMAGE_CONSTANTS.FEBackground,
  BE: IMAGE_CONSTANTS.BEBackground,
  COOP: IMAGE_CONSTANTS.COOPBackground,
};

type Tone = "pm" | "fe" | "be" | "coop";
const TONE_BY_ROLE: Record<Role, Tone> = {
  PM: "pm",
  FE: "fe",
  BE: "be",
  COOP: "coop",
};

type Props = {
  member: Member;
  /** 부모에서 전체 칭찬하기를 눌렀을 때 증가하는 키 */
  burstKey?: number;
};

const DevCard: React.FC<Props> = ({ member, burstKey = 0 }) => {
  const tone: Tone = TONE_BY_ROLE[member.role];
  const bg = BG_BY_ROLE[member.role];

  // 카드 내부 전용 Lottie 폭죽 on/off
  const [localFx, setLocalFx] = useState(false);
  const timerRef = useRef<number | null>(null);

  const fireLocal = () => {
    setLocalFx(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setLocalFx(false), 1800) as unknown as number;
  };

  // 전체 칭찬하기 신호 수신 → 카드 내부 폭죽 실행
  useEffect(() => {
    if (burstKey > 0) fireLocal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burstKey]);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <S.CardBox>
      {/* 카드 내부 Lottie 레이어 */}
      {localFx && (
        <S.CardFireworksLayer>
          <Lottie animationData={fireWork} loop={true} style={{ width: "100%", height: "100%" }} />
        </S.CardFireworksLayer>
      )}

      {/* 배너: 역할별 배경이미지 */}
      <S.CardHeader $bg={bg} />

      {/* 프로필 이미지 */}
      <S.Avatar src={member.image || "/placeholder.png"} alt={member.name} />

      {/* 본문: 이름 + 칩(트랙/전공/인스타) */}
      <S.CardBody>
        <S.Row>
          <div className="name">{member.name}</div>
          <S.Chip tone={tone}>#{member.role}</S.Chip>
        </S.Row>
        <div className="meta">
          {member.major && <S.Chip tone="meta">#{member.major}</S.Chip>}
          {member.instagram && <S.Chip tone="meta">@{member.instagram}</S.Chip>}
        </div>
      </S.CardBody>

      {/* 카드 내부만 터지는 칭찬하기 */}
      <S.CardFooter>
        <button onClick={fireLocal}>칭찬하기 ✨</button>
      </S.CardFooter>
    </S.CardBox>
  );
};

export default DevCard;
