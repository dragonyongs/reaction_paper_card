// 순수 Modal 컴포넌트 (Backdrop 및 중앙 모달)
export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 백드롭: 클릭 시 모달 닫힘 */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      {/* 모달 컨텐츠 */}
      <div className="bg-white rounded shadow-lg z-50 p-4">{children}</div>
    </div>
  );
};
