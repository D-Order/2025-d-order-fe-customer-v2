import * as S from './CallModal.styled';

import { useState } from 'react';
import { CallService } from '@pages/menulistpage/_services/CallService';

interface CallModalProps {
  onClose: () => void;
  tableNum: number;
}

const CallModal = ({ onClose, tableNum }: CallModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleCall = async () => {
    try {
      setLoading(true);

      await CallService.callStaff({
        tableNumber: tableNum, // ✅ 로컬스토리지에서 읽어온 tableNum 전달
        message: '직원이 필요합니다.', // 기본 메시지
      });

      alert(`${tableNum}번 테이블에서 직원을 호출했습니다!`);
      onClose();
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <S.BackDrop onClick={onClose}>
      <S.ModalBox onClick={(e) => e.stopPropagation()}>
        <S.Box1>직원을 호출하시겠습니까?</S.Box1>
        <S.Box2>
          <S.Button1 onClick={onClose}>취소</S.Button1>
          <S.Button2 onClick={handleCall}>
            {loading ? '호출 중…' : '직원 호출'}
          </S.Button2>
        </S.Box2>
      </S.ModalBox>
    </S.BackDrop>
  );
};

export default CallModal;
