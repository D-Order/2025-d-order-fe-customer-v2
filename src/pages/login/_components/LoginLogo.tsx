import styled from "styled-components";

import CharacterLogo from "@assets/images/character.svg";
import TextLogo from "@assets/images/redLogo.svg";

interface LoginLogoProps {
  boothName: string;
}

const LoginLogo = ({ boothName }: LoginLogoProps) => {
  return (
    <LogoWrapper>
      <BoothName>{boothName || "부스 이름"}</BoothName>
      <LogoImg
        src={TextLogo}
        alt="빨간글씨 디오더 로고"
        style={{ width: "176px", height: "auto", marginBottom: "63px" }}
      />
      <LogoImg
        src={CharacterLogo}
        alt="디오더 아코 로고"
        style={{ width: "192px", height: "auto" }}
      />
    </LogoWrapper>
  );
};

export default LoginLogo;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoImg = styled.img`
  display: flex;
`;
const BoothName = styled.div`
  display: flex;
  ${({ theme }) => theme.fonts.ExtraBold18}
  color: ${({ theme }) => theme.colors.Orange01};
  margin-bottom: 10px;
`;
