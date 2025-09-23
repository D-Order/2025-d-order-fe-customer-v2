import React from "react";
import * as S from "../devPage.styled";

type Props = {
  active: "ALL" | "PM" | "FE" | "BE" | "COOP";
  onChange: (next: Props["active"]) => void;
};

const RoleFilter: React.FC<Props> = ({ active, onChange }) => {
    const roles = ["ALL", "PM", "FE", "BE", "COOP"] as const;
    return (
        <S.FilterBox>
        {roles.map((r) => (
            <S.FilterBtn key={r} active={active === r} onClick={() => onChange(r)}>
            {r === "ALL" ? "전체" : r}
            </S.FilterBtn>
        ))}
        </S.FilterBox>
    );
};

export default RoleFilter;
