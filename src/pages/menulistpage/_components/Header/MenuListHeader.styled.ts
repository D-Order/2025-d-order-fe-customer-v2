import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`;

export const Icons = styled.div`
  display: flex;
  gap: 10px;
`;

export const IconWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Icon = styled.img`
  width: 20px;

  cursor: pointer;
`;

export const Logo = styled.img`
  width: 100px;

  cursor: pointer;
`;

export const Badge = styled.div`
  position: absolute;
  top: 2px;
  right: -4px;
  width: 6px;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.Point};
  border-radius: 50%;
`;

export const Hochul = styled.div`
  ${({ theme }) => theme.fonts.Medium12};
  background-color: ${({ theme }) => theme.colors.Gray01};
  display: flex;
  border-radius: 0.375rem;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  align-items: center;

  cursor: pointer;
`;
