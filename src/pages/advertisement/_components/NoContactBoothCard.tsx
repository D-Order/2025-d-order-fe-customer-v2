import styled from "styled-components";
import Character from "@assets/images/character.svg?react";

type Props = {
  boothName: string;
};

const NoContactBoothCard = ({ boothName }: Props) => {
  return (
    <Wrapper>
      <Contents>
        <Character width={42} height={27} />
        <BoothName>{boothName}</BoothName>
        <InfoText>
          디오더 사용 부스가 <br /> 아닙니다.
        </InfoText>
      </Contents>
    </Wrapper>
  );
};

export default NoContactBoothCard;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0 18px;
  box-sizing: border-box;

  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.White};
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);

  min-width: 0;
`;
const Contents = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
`;
const BoothName = styled.div`
  display: block;
  flex: 1;
  align-self: center;

  margin-left: 18px;
  ${({ theme }) => theme.fonts.ExtraBold16};
  color: ${({ theme }) => theme.colors.Black01};

  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const InfoText = styled.div`
  display: flex;
  width: 80px;
  justify-content: center;
  align-items: center;
  text-align: center;
  ${({ theme }) => theme.fonts.SemiBold10};
  color: ${({ theme }) => theme.colors.Black01};
`;
