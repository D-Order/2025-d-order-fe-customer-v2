import styled from "styled-components";
import DefaultImage from "@assets/images/character.svg?react";

type Status = "AVAILABLE" | "SOON" | "FULL";

type Props = {
  hostName: string;
  boothImage?: string;
  location: string;
  remaining: number;
  capacity: number;
  status: Status;
};

const ContactBoothCard = ({
  hostName,
  boothImage,
  location,
  remaining,
  capacity,
  status,
}: Props) => {
  const statusLabel =
    status === "AVAILABLE" ? "여유" : status === "SOON" ? "임박" : "만석";

  return (
    <Wrapper>
      <DefaultImgBox>
        {boothImage ? (
          <BoothImage src={boothImage} alt={`${hostName} 이미지`} />
        ) : (
          <DefaultImage width={35} height={25} />
        )}
      </DefaultImgBox>

      <BoothContents>
        <BoothText>{hostName || "부스 이름 미정"}</BoothText>
        <BoothPlaceText>{location || "위치 미정"}</BoothPlaceText>
      </BoothContents>

      <InfoContents>
        <InfoTag $status={status}>{statusLabel}</InfoTag>
        <InfoTextWrapper>
          <InfoText>남은 테이블</InfoText>
          <InfoText $num $status={status}>
            {Math.max(0, remaining)}/{capacity ?? 0}
          </InfoText>
        </InfoTextWrapper>
      </InfoContents>
    </Wrapper>
  );
};

export default ContactBoothCard;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 75px;
  padding: 15px 18px;
  box-sizing: border-box;

  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.White};
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
`;

const DefaultImgBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.Gray01};

  margin-right: 15px;
`;
const BoothImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;
const BoothContents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  flex: 1 1 0%;
  min-width: 0;

  padding-right: 3px;
  box-sizing: border-box;
`;
const BoothText = styled.div`
  display: block;

  ${({ theme }) => theme.fonts.ExtraBold16}
  color: ${({ theme }) => theme.colors.Black01};

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const BoothPlaceText = styled.div`
  display: block;

  ${({ theme }) => theme.fonts.SemiBold12}
  color: ${({ theme }) => theme.colors.Black01};

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const InfoContents = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const InfoTag = styled.div<{ $status: Status }>`
  width: 26px;
  height: 15px;

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  ${({ theme }) => theme.fonts.SemiBold10};
  color: ${({ theme }) => theme.colors.White};
  background-color: ${({ theme, $status }) =>
    $status === "AVAILABLE"
      ? theme.colors.Green01
      : $status === "SOON"
      ? theme.colors.Orange01
      : theme.colors.Gray02};
`;

const InfoTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const InfoText = styled.div<{ $num?: boolean; $status?: Status }>`
  white-space: nowrap;
  ${({ theme }) => theme.fonts.SemiBold10};
  color: ${({ theme, $num, $status }) =>
    $num
      ? $status === "AVAILABLE"
        ? theme.colors.Green01
        : $status === "SOON"
        ? theme.colors.Orange01
        : theme.colors.Gray02
      : theme.colors.Black};

  ${({ theme, $num }) => ($num ? theme.fonts.Bold14 : theme.fonts.SemiBold10)};
`;
