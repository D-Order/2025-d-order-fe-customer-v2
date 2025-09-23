import styled, { keyframes, css } from "styled-components";
import { IMAGE_CONSTANTS } from "@constants/ImageConstants";
import WhiteLogo from "@assets/images/whiteLogo.svg?react";
import ContactBoothCard from "./_components/ContactBoothCard";
import NoContactBoothCard from "./_components/NoContactBoothCard";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BoothAdItem, fetchBoothAds } from "./service/BoothInfo";
import { NO_CONTACT_BOOTH_INFO } from "./const/noContactBoothInfo";
type Status = "AVAILABLE" | "SOON" | "FULL";

const DATE_OPTIONS = [
  { label: "9/24(수)", value: "2025-09-24" },
  { label: "9/25(목)", value: "2025-09-25" },
  { label: "9/26(금)", value: "2025-09-26" },
] as const;

const getBoothStatus = (remaining: number, capacity: number): Status => {
  if (capacity <= 0 || remaining <= 0) return "FULL";
  const ratio = remaining / capacity;
  if (ratio <= 0.2) return "SOON";
  return "AVAILABLE";
};
const getInitialDate = (): string => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  if (month === 9) {
    if (day === 26) {
      return "2025-09-26";
    }
    if (day === 25) {
      return "2025-09-25";
    }
  }

  return "2025-09-24";
};

const isDateActive = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-").map((v) => Number(v));
  const target = new Date(y, m - 1, d);
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  return target.getTime() <= todayStart.getTime();
};

const AdPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>(getInitialDate());
  const [booths, setBooths] = useState<BoothAdItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const boothWrapperRef = useRef<HTMLDivElement>(null);

  const loadBooths = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBoothAds();
      setBooths(data);
      console.log("data", data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooths();
  }, [loadBooths]);

  // 날짜 변경 시 리스트 스크롤을 맨 위로 초기화하여 오버레이 위치가 어긋나지 않도록 처리
  useEffect(() => {
    boothWrapperRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [selectedDate]);

  const onReload = () => {
    if (isReloading || loading) return;
    setIsReloading(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const filteredBooths = useMemo(
    () =>
      booths.filter((b) =>
        Array.isArray(b.dates) ? b.dates.includes(selectedDate) : false
      ),
    [booths, selectedDate]
  );

  const noContactBooths = useMemo(
    () =>
      NO_CONTACT_BOOTH_INFO.find((b) => b.date === selectedDate)?.booths ?? [],
    [selectedDate]
  );

  const isSelectedDateActive = useMemo(
    () => isDateActive(selectedDate),
    [selectedDate]
  );

  const computedBooths = useMemo(() => {
    return filteredBooths.map((b) => {
      const capacity = b.boothAllTable ?? 0;
      const used = b.boothUsageTable ?? 0;
      const remaining = Math.max(0, capacity - used);
      const status = getBoothStatus(remaining, capacity);
      return {
        hostName: b.hostName ?? "",
        boothImage: b.boothImage ?? "",
        location: b.location ?? "",
        remaining,
        capacity,
        status,
      };
    });
  }, [filteredBooths]);

  return (
    <Wrapper>
      <F5Wrapper>
        <ReloadButton
          onClick={onReload}
          disabled={loading || isReloading}
          aria-label="데이터 새로고침"
          title="새로고침"
          $isReloading={isReloading}
        >
          <ReloadIcon src={IMAGE_CONSTANTS.RELOAD} alt="reload" />
        </ReloadButton>
      </F5Wrapper>
      <Logo />
      <Title>지금 어느 부스로 가야할까?</Title>
      <ContentsWrapper>
        <DateWrapper>
          {DATE_OPTIONS.map((d) => (
            <DateText
              key={d.value}
              $active={d.value === selectedDate}
              onClick={() => setSelectedDate(d.value)}
              type="button"
            >
              {d.label}
            </DateText>
          ))}
        </DateWrapper>

        <BoothWrapper ref={boothWrapperRef} $blocked={!isSelectedDateActive}>
          <ContactBoothList>
            {!loading &&
              computedBooths.map((b, idx) => (
                <ContactBoothCard
                  key={`${b.hostName}-${idx}`}
                  hostName={b.hostName}
                  boothImage={b.boothImage}
                  location={b.location}
                  remaining={b.remaining}
                  capacity={b.capacity}
                  status={b.status}
                />
              ))}
          </ContactBoothList>

          <NOContactBoothList>
            {noContactBooths.map((b, idx) => (
              <NoContactBoothCard key={`${b}-${idx}`} boothName={b} />
            ))}
          </NOContactBoothList>

          {!isSelectedDateActive && (
            <ComingSoonOverlay aria-hidden>
              <ComingSoonText>COMING SOON</ComingSoonText>
            </ComingSoonOverlay>
          )}
        </BoothWrapper>
      </ContentsWrapper>

      <ContactTnfoWrapper
        as="a"
        href="https://www.instagram.com/d_order.official/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ContactText>Contact: </ContactText>
        <ContactIcon src={IMAGE_CONSTANTS.INSTAGRAMICON} />
        <ContactText $insta>@d_order.official</ContactText>
      </ContactTnfoWrapper>
    </Wrapper>
  );
};

export default AdPage;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  position: relative;

  box-sizing: border-box;

  background: url(${IMAGE_CONSTANTS.BACKGROUND}) center / cover no-repeat;
`;

export const F5Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding-right: 15px;
  margin-top: 16px;
  box-sizing: border-box;
  &.img {
    width: 20px;
    height: 20px;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
`;

const ReloadButton = styled.button<{ $isReloading?: boolean }>`
  background: transparent;
  border: none;
  padding: 0;
  display: flex;
  cursor: pointer;

  ${({ $isReloading }) =>
    $isReloading &&
    css`
      & > img {
        animation: ${rotate} 1s linear;
      }
    `}

  &:disabled {
    cursor: default;
    opacity: 0.8;
  }
`;

const ReloadIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const Logo = styled(WhiteLogo)`
  width: clamp(165px, 44%, 600px);
  height: auto;
  display: block;
`;

const ContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex: 1 1 0%;
  min-height: 0;
  gap: 25px;

  margin-top: 35px;
  box-sizing: border-box;
`;

const Title = styled.div`
  ${({ theme }) => theme.fonts.ExtraBold24};
  color: ${({ theme }) => theme.colors.White};
`;
const DateWrapper = styled.div`
  display: flex;
  gap: 50px;
`;
const DateText = styled.button<{ $active?: boolean }>`
  ${({ theme }) => theme.fonts.Bold14};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.White : theme.colors.Black02};

  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const BoothWrapper = styled.div<{ $blocked?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 80%;
  flex: 1 1 0%;
  min-height: 0;
  position: relative;
  overflow-y: ${({ $blocked }) => ($blocked ? "hidden" : "auto")};
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const ContactBoothList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 18px;
  margin-bottom: 32px;
`;
const NOContactBoothList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 11px;
`;
const ContactTnfoWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 15px;
  padding-right: 15px;
  padding-bottom: 15px;
  box-sizing: border-box;
  gap: 4px;
`;
const ContactText = styled.div<{ $insta?: boolean }>`
  display: flex;

  color: ${({ theme }) => theme.colors.White};
  ${({ theme }) => theme.fonts.SemiBold12};
  ${({ theme, $insta }) => $insta && theme.fonts.ExtraBold12};
`;
const ContactIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const ComingSoonOverlay = styled.div`
  border-radius: 10px;
  position: absolute;
  inset: 0;
  background: rgba(200, 94, 1, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  pointer-events: auto;
`;

const ComingSoonText = styled.div`
  ${({ theme }) => theme.fonts.ExtraBold24};
  color: ${({ theme }) => theme.colors.White};
  letter-spacing: 1px;
`;
