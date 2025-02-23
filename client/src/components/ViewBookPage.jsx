import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const ViewBookPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const book = state?.book;

  if (!book) {
    return (
      <div className="p-6">
        <p>독후감 데이터가 존재하지 않습니다.</p>
        <button onClick={() => navigate("/")} className="mt-4 text-blue-500">
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  const sections = [
    { title: "책 제목", content: book.title },
    { title: "책 종류", content: book.type },
    { title: "저자", content: book.content.author },
    { title: "이 책을 고른 이유", content: book.content.reason },
    { title: "특별한 이유", content: book.content.specialReason },
    { title: "가장 기억에 남는 장면", content: book.content.memorable },
    { title: "마음에 든 문장", content: book.content.favoriteSentence },
    { title: "주인공에 대한 생각", content: book.content.character },
    { title: "배운 점", content: book.content.learned },
    { title: "추천하는 이유", content: book.content.recommend },
    {
      title: "별점",
      content: book.content.rating ? `${book.content.rating}점` : "",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-600">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-2">독후감 보기</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-16 h-16 ${book.color} rounded-2xl flex items-center justify-center text-3xl`}
          >
            {book.cover}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{book.title}</h2>
            <p className="text-gray-500">{book.type}</p>
          </div>
        </div>

        <div className="space-y-6">
          {sections.map(
            (section, index) =>
              section.content && (
                <div key={index} className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-gray-800">{section.content}</p>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBookPage;
