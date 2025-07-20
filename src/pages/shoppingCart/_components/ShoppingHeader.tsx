import { IMAGE_CONSTANTS } from "@constants/ImageConstants";
import styled from "styled-components";

const ShoppingHeader = ({
  text,
  goBack,
}: {
  text: string;
  goBack: () => void;
}) => {
  return (
    <Header>
      <button onClick={goBack}>
        <img src={IMAGE_CONSTANTS.BACKICON} alt="돌아가기 버튼" />
      </button>
      <div>{text}</div>
      <div style={{ width: "30px" }}></div>
    </Header>
  );
};
export default ShoppingHeader;

const Header = styled.header`
  box-sizing: border-box;
  padding: 33px;

  display: flex;
  justify-content: space-between;
  width: 100%;

  button {
    padding: 0;
  }
  div {
    ${({ theme }) => theme.fonts.ExtraBold18}
    display: flex;
    align-items: center;
  }
`;
