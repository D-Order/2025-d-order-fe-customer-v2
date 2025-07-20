import styled from "styled-components";

export const StaffCodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  min-height: calc(var(--vh, 1vh) * 100);

  /* padding-top: 145px;
  padding-bottom: 23px; */
  box-sizing: border-box;
`;

//x버튼 있는 헤더
export const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  height: 30px;
  padding: 0 16px;
  box-sizing: border-box;

  margin-top: 5px;
`;
export const XBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;

  cursor: pointer;
  & img {
    width: 30px;
    height: 30px;
  }
`;

//화면에 들어갈 요소 헤더빼고 전체 감싸는 콘텐츠
export const StaffCodeContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  width: 100%;
  margin-top: 10vh;
`;

//타이틀
export const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  color: ${({ theme }) => theme.colors.Black01};
  ${({ theme }) => theme.fonts.ExtraBold24};
`;

//코드입력+위에 테이블정보 감싸는 디브
export const InputContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 67%;
  gap: 15px;
`;

export const ErrorMessage = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 15px;

  color: ${({ theme }) => theme.colors.Orange01};
  ${({ theme }) => theme.fonts.Bold14};
`;
