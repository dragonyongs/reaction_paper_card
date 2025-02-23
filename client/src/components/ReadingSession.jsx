import { useState } from "react";
import WriteReviewDrawer from "../components/WriteReviewPage"; // 기존에 작성한 독후감 작성 Drawer 컴포넌트 재사용
import ProgressBar from "./ProgressBar"; // 진행률 표시용 컴포넌트 (아래에 예시 제공)
// import { Button } from "react-bootstrap"; // 또는 기본 button 사용
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

const ReadingSession = ({
  isOpen,
  onClose,
  book,
  onCompleteReading,
  onSaveBasicInfo,
}) => {
  // book 객체에 totalPages, readingHistory 등이 미리 있을 수 있음
  const [title, setTitle] = useState(book.title || "");
  const [author, setAuthor] = useState(book.author || "");
  const [totalPages, setTotalPages] = useState(book.totalPages || 0);
  const [currentPage, setCurrentPage] = useState(
    book.readingProgress?.currentPage || 0
  );
  const [readingHistory, setReadingHistory] = useState(
    book.readingHistory || []
  );
  const [readingMemos, setReadingMemos] = useState(book.readingMemos || []);
  const [newDailyPage, setNewDailyPage] = useState("");
  const [newMemoPage, setNewMemoPage] = useState("");
  const [newMemoText, setNewMemoText] = useState("");
  const [isReviewDrawerOpen, setReviewDrawerOpen] = useState(false);

  // 진행률 계산
  const progress =
    totalPages > 0 ? Math.min((currentPage / totalPages) * 100, 100) : 0;

  // 총 페이지 수 입력 후 독서 시작
  const handleSetTotalPages = (e) => {
    const pages = Number(e.target.value);
    if (pages > 0) {
      setTotalPages(pages);
    }
  };

  // 기본 정보 저장 시 외부로 전달 (예: 상위 컴포넌트에서 관리)
  const handleSaveBasicInfo = () => {
    if (title && author && totalPages > 0) {
      onSaveBasicInfo({ title, author, totalPages });
    } else {
      alert("모든 기본 정보를 입력해주세요.");
    }
  };

  // 오늘 읽은 페이지 추가
  const addDailyReading = () => {
    const pagesRead = Number(newDailyPage);
    if (!pagesRead || pagesRead <= 0) return;
    const newCurrentPage = currentPage + pagesRead;
    const newRecord = {
      date: new Date().toISOString().split("T")[0],
      pagesRead,
    };
    setReadingHistory([...readingHistory, newRecord]);
    setCurrentPage(newCurrentPage);
    setNewDailyPage("");
  };

  // 읽는 도중 메모 추가
  const addReadingMemo = () => {
    const pageNum = Number(newMemoPage);
    if (!pageNum || !newMemoText.trim()) return;
    const newMemo = {
      page: pageNum,
      memo: newMemoText,
      date: new Date().toISOString().split("T")[0],
    };
    setReadingMemos([...readingMemos, newMemo]);
    setNewMemoPage("");
    setNewMemoText("");
  };

  // 독서 완료 버튼 클릭 시, 독서가 완료되었다고 판단하고 독후감 작성 Drawer를 연다.
  const handleCompleteReading = () => {
    if (progress < 100) {
      // 사용자가 하루에 다 읽은 경우 등 직접 완료를 누를 수 있음
      if (!window.confirm("아직 책을 모두 읽지 않았습니다. 완료하시겠습니까?"))
        return;
    }
    // 독서 완료 처리 후 리뷰 작성 Drawer 열기
    setReviewDrawerOpen(true);
    // onCompleteReading 등 외부 상태 업데이트 로직도 추가 가능
    onCompleteReading &&
      onCompleteReading({
        totalPages,
        currentPage,
        readingHistory,
        readingMemos,
      });
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      direction="right"
      size={window.innerWidth < 640 ? "100%" : "400px"}
      className="overflow-y-auto"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">독서 진행</h2>
        <div className="mb-6">
          <label className="block mb-2">책 제목:</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="책 제목 입력"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="block mb-2 mt-4">저자:</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="저자 입력"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <label className="block mb-2 mt-4">총 페이지 수:</label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            placeholder="예: 300"
            value={totalPages}
            onChange={(e) => setTotalPages(Number(e.target.value))}
          />
          <button
            onClick={handleSaveBasicInfo}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            정보 저장
          </button>
        </div>

        {/* 독서 진행 입력 */}
        <div className="mb-6">
          <label className="block mb-2">오늘 읽은 페이지 수:</label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            placeholder="예: 20"
            value={newDailyPage}
            onChange={(e) => setNewDailyPage(e.target.value)}
          />
          <button
            onClick={addDailyReading}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            추가
          </button>
        </div>

        {/* 진행률 표시 */}
        <div className="mb-6">
          <ProgressBar progress={progress} />
          <p className="text-sm text-gray-600 mt-1">
            현재 진행률: {progress.toFixed(0)}%
          </p>
        </div>

        {/* 독서 기록 히스토리 */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">읽은 내역</h3>
          {readingHistory.length === 0 ? (
            <p className="text-sm text-gray-500">기록된 내역이 없습니다.</p>
          ) : (
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {readingHistory.map((record, idx) => (
                <li key={idx}>
                  {record.date}: {record.pagesRead} 페이지
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 독서 메모 추가 */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">독서 메모</h3>
          <div className="mb-2">
            <label className="block mb-1">페이지 번호:</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              placeholder="예: 45"
              value={newMemoPage}
              onChange={(e) => setNewMemoPage(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">메모:</label>
            <textarea
              className="border p-2 rounded w-full"
              placeholder="인상 깊은 문구나 메모를 입력해주세요"
              value={newMemoText}
              onChange={(e) => setNewMemoText(e.target.value)}
            />
          </div>
          <button
            onClick={addReadingMemo}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            메모 추가
          </button>
        </div>

        {/* 독서 메모 리스트 */}
        {readingMemos.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold mb-2">기록된 메모</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {readingMemos.map((memo, idx) => (
                <li key={idx}>
                  페이지 {memo.page} ( {memo.date} ): {memo.memo}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 독서 완료 버튼: 현재 진행률이 100% 이상이거나 사용자가 직접 완료를 누를 수 있음 */}
        <div className="mb-6">
          <button
            onClick={handleCompleteReading}
            className="bg-red-500 text-white px-6 py-2 rounded"
          >
            독서 완료
          </button>
        </div>

        {/* 독서 완료 후 독후감 작성 Drawer */}
        <WriteReviewDrawer
          isOpen={isReviewDrawerOpen}
          onClose={() => setReviewDrawerOpen(false)}
          onComplete={(reviewData) => {
            // 독후감 작성 완료 후 처리 (외부 상태 업데이트 등)
            console.log("작성된 독후감:", reviewData);
          }}
          folders={[]} // 필요 시 폴더 데이터 전달
        />
      </div>
    </Drawer>
  );
};

export default ReadingSession;
