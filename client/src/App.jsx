import React, { useState, useEffect } from 'react';
import { Book, ChevronLeft, Star, Send, Award } from 'lucide-react';

const COLORS = {
  RED: { bg: 'bg-red-400', text: 'text-red-500', gradient: 'from-red-400' },
  YELLOW: { bg: 'bg-yellow-400', text: 'text-yellow-500', gradient: 'from-yellow-400' },
  GREEN: { bg: 'bg-green-400', text: 'text-green-500', gradient: 'from-green-400' },
  BLUE: { bg: 'bg-blue-400', text: 'text-blue-500', gradient: 'from-blue-400' }
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([
    { 
      id: 1, 
      title: "해와 달이 된 오누이", 
      type: "전래동화",
      status: "완료",
      progress: 100,
      cover: "🌙",
      color: COLORS.YELLOW,
      folderId: 1,
      content: {
        author: "작가 정보 없음",
        reason: "우리나라의 전래동화가 궁금했어요",
        specialReason: "",
        memorable: "달님이 된 오누이가 멋있었어요",
        favoriteSentence: "",
        character: "용감한 오누이가 마음에 들었어요",
        learned: "용기있게 행동하는 게 중요해요",
        recommend: "재미있는 전래동화를 좋아하는 친구들에게 추천해요",
        rating: 4.5
      }
    },
    { 
      id: 2, 
      title: "흥부와 놀부", 
      type: "전래동화",
      status: "작성중",
      progress: 33,
      cover: "🏠",
      color: COLORS.GREEN,
      folderId: 2,
      content: {
        author: "작가 정보 없음",
        reason: "착한 흥부가 어떻게 잘 살게 되었는지 궁금했어요",
        specialReason: "",
        memorable: "",
        favoriteSentence: "",
        character: "",
        learned: "",
        recommend: "",
        rating: 0
      }
    }
  ]);

  const [folders, setFolders] = useState([
    { id: 1, name: '전래동화', color: 'bg-yellow-500', textColor: 'text-gray-800' },
    { id: 2, name: '동화', color: 'bg-blue-500', textColor: 'text-white' }
  ]);

  const handleNewBook = (bookData) => {
    const newBook = {
      id: books.length + 1,
      ...bookData,
      folderId: Number(bookData.folderId),
      status: "완료",
      progress: 100,
      color: Object.values(COLORS)[Math.floor(Math.random() * 4)]
    };
    setBooks([...books, newBook]);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'home' && (
        <KidsHomePage 
          books={books}
          folders={folders}
          onNewBook={() => setCurrentPage('write')}
          onViewBook={(book) => {
            setSelectedBook(book);
            setCurrentPage('view');
          }}
        />
      )}
      {currentPage === 'write' && (
        <WriteReviewPage 
          onBack={() => setCurrentPage('home')}
          onComplete={handleNewBook}
          folders={folders}
        />
      )}
      {currentPage === 'view' && selectedBook && (
        <ViewBookPage 
          book={selectedBook}
          onBack={() => setCurrentPage('home')}
        />
      )}
    </div>
  );
};

const KidsHomePage = ({ books, folders, onNewBook, onViewBook }) => {
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [currentBookPage, setCurrentBookPage] = useState(1);
  const booksPerPage = 5;

  // 폴더 변경 시 페이지 번호 초기화
  useEffect(() => {
    setCurrentBookPage(1);
  }, [selectedFolderId]);

  const filteredBooks = selectedFolderId 
    ? books.filter(book => book.folderId === selectedFolderId)
    : books;

  const indexOfLastBook = currentBookPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            나의 독서장
          </h1>
          <p className="text-gray-500 text-sm mt-1">오늘은 어떤 책을 읽었나요?</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-red-400 flex items-center justify-center">
          <Star className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* 폴더 필터링 UI */}
      <div className="mb-4 flex space-x-2 overflow-x-auto">
        <button 
          onClick={() => setSelectedFolderId(null)}
          className={`px-4 py-2 rounded-full ${selectedFolderId === null ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          전체보기
        </button>
        {folders.map(folder => (
          <button 
            key={folder.id}
            onClick={() => setSelectedFolderId(folder.id)}
            className={`px-4 py-2 rounded-full ${selectedFolderId === folder.id ? `${folder.color} ${folder.textColor}` : 'bg-gray-200 text-gray-800'}`}
          >
            {folder.name}
          </button>
        ))}
      </div>

      <button 
        onClick={onNewBook}
        className="w-full bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-2xl p-4 mb-8 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Book className="w-6 h-6" />
            <span className="text-lg font-medium">새로운 독후감 쓰기</span>
          </div>
          <Send className="w-5 h-5" />
        </div>
      </button>

      <div className="space-y-4">
        {currentBooks.map(book => (
          <div 
            key={book.id}
            onClick={() => onViewBook(book)}
            className="bg-white rounded-3xl p-5 cursor-pointer transform hover:scale-[1.02] transition-all shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${book.color.bg} rounded-2xl flex items-center justify-center text-2xl`}>
                {book.cover}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.type}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${book.color.gradient} to-green-400`}
                      style={{ width: `${book.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{book.progress}%</span>
                </div>
              </div>
              {book.status === '완료' && (
                <Award className={`w-5 h-5 ${book.color.text}`} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 페이징 컨트롤 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button 
            onClick={() => setCurrentBookPage(prev => Math.max(prev - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded"
            disabled={currentBookPage === 1}
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button 
              key={i+1}
              onClick={() => setCurrentBookPage(i+1)}
              className={`px-3 py-1 rounded ${currentBookPage === i+1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              {i+1}
            </button>
          ))}
          <button 
            onClick={() => setCurrentBookPage(prev => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 bg-gray-200 rounded"
            disabled={currentBookPage === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

const WriteReviewPage = ({ onBack, onComplete, folders }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "기본 정보",
      questions: [
        { field: "folderId", question: "폴더 선택", placeholder: "폴더를 선택해주세요", type: "select", isContent: false },
        { field: "title", question: "책 제목", placeholder: "책 제목을 입력해주세요", type: "input", isContent: false },
        { field: "type", question: "책 종류", placeholder: "예: 전래동화", type: "input", isContent: false },
        { field: "author", question: "저자", placeholder: "저자 이름을 입력해주세요", type: "input", isContent: true }
      ]
    },
    {
      title: "책 선택 이유",
      questions: [
        { field: "reason", question: "이 책을 고른 이유", placeholder: "책을 고른 이유를 적어주세요", type: "textarea", isContent: true },
        { field: "specialReason", question: "특별한 이유", placeholder: "책을 선택한 특별한 이유가 있다면 적어주세요", type: "textarea", isContent: true }
      ]
    },
    {
      title: "인상 깊은 내용",
      questions: [
        { field: "memorable", question: "가장 기억에 남는 장면", placeholder: "기억에 남는 장면을 적어주세요", type: "textarea", isContent: true },
        { field: "favoriteSentence", question: "마음에 든 문장", placeholder: "마음에 든 문장을 적어주세요", type: "textarea", isContent: true },
        { field: "character", question: "주인공에 대한 생각", placeholder: "주인공의 행동 중 좋았던 점을 적어주세요", type: "textarea", isContent: true }
      ]
    },
    {
      title: "나의 생각",
      questions: [
        { field: "learned", question: "배운 점", placeholder: "책에서 배운 점을 적어주세요", type: "textarea", isContent: true },
        { field: "recommend", question: "추천하는 이유", placeholder: "왜 이 책을 추천하고 싶은지 적어주세요", type: "textarea", isContent: true },
        { field: "rating", question: "별점 (1~5, 반점 가능)", placeholder: "별점을 입력해주세요", type: "number", isContent: true }
      ]
    }
  ];

  const [form, setForm] = useState({
    folderId: '',
    title: '',
    type: '',
    cover: '📚',
    content: {
      author: '',
      reason: '',
      specialReason: '',
      memorable: '',
      favoriteSentence: '',
      character: '',
      learned: '',
      recommend: '',
      rating: ''
    }
  });

  const handleChange = (field, value, isContent) => {
    if (isContent) {
      setForm({
        ...form,
        content: {
          ...form.content,
          [field]: field === 'rating' ? Number(value) : value
        }
      });
    } else {
      setForm({
        ...form,
        [field]: value
      });
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // 검증 로직 추가 가능
    onComplete(form);
  };

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button onClick={onBack} className="text-gray-600">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 ml-2">새로운 독후감</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-6">
          {steps.map((s, i) => (
            <div key={i} className={`flex-1 text-center ${i === step ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${i === step ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {i + 1}
              </div>
              <span className="text-xs">{s.title}</span>
            </div>
          ))}
        </div>

        {/* 현재 단계의 질문 렌더링 */}
        <div className="bg-white rounded-2xl p-6 space-y-6 mb-6">
          {steps[step].questions.map((q, i) => {
            const fieldName = q.field;
            const value = q.isContent ? form.content[fieldName] : form[fieldName];
            return (
              <div key={i} className="mb-6 last:mb-0">
                <label className="block text-gray-700 font-medium mb-2">{q.question}</label>
                {q.type === 'input' || q.type === 'number' ? (
                  <input
                    type={q.type}
                    value={value}
                    onChange={(e) => handleChange(fieldName, e.target.value, q.isContent)}
                    className="w-full p-3 border rounded-xl"
                    placeholder={q.placeholder}
                    {...(q.type === 'number' ? { step: "0.5", min: "1", max: "5" } : {})}
                  />
                ) : q.type === 'select' ? (
                  <select
                    value={value}
                    onChange={(e) => handleChange(fieldName, e.target.value, q.isContent)}
                    className="w-full p-3 border rounded-xl"
                  >
                    <option value="">폴더 선택</option>
                    {folders.map(folder => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                ) : (
                  <textarea
                    value={value}
                    onChange={(e) => handleChange(fieldName, e.target.value, q.isContent)}
                    className="w-full p-3 border rounded-xl h-24"
                    placeholder={q.placeholder}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button onClick={handlePrevious} className={`px-6 py-2 rounded-full ${step > 0 ? 'bg-gray-200' : 'invisible'}`}>
            이전
          </button>
          <button onClick={handleNext} className="bg-gradient-to-r from-yellow-400 to-red-400 text-white px-6 py-2 rounded-full">
            {step === steps.length - 1 ? '완료' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewBookPage = ({ book, onBack }) => {
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
    { title: "별점", content: book.content.rating ? `${book.content.rating}점` : "" }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="text-gray-600">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-2">독후감 보기</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 ${book.color.bg} rounded-2xl flex items-center justify-center text-3xl`}>
            {book.cover}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{book.title}</h2>
            <p className="text-gray-500">{book.type}</p>
          </div>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            section.content && (
              <div key={index} className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{section.title}</h3>
                <p className="text-gray-800">{section.content}</p>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
