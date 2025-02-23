import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Folders from "../components/Folders.jsx";
import ReactionPaperList from "../components/ReactionPaperList.jsx";
import WriteReviewDrawer from "../components/WriteReviewPage.jsx";
import ReadingSession from "../components/ReadingSession.jsx";
import { bookData } from "../data/bookData.js";
import { foldersData } from "../data/foldersData";
import { Book, Send } from "lucide-react";
import { COLORS } from "../utils/colors.js";

const Home = () => {
  const [folders, setFolders] = useState(foldersData);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [books, setBooks] = useState(bookData);
  // const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [bookmarkMode, setBookmarkMode] = useState(null);
  const [isReadingSessionOpen, setReadingSessionOpen] = useState(false);
  const [isReviewDrawerOpen, setReviewDrawerOpen] = useState(false);

  // const [showBookmarked, setShowBookmarked] = useState(false);
  // const [selectedBook, setSelectedBook] = useState(null);
  const [basicInfo, setBasicInfo] = useState({
    title: "",
    author: "",
    totalPages: 0,
  });

  const navigate = useNavigate();

  const toggleBookmark = (bookId) => {
    setBooks(
      books.map((book) =>
        book.id === bookId
          ? { ...book, isBookmarked: !book.isBookmarked }
          : book
      )
    );
  };

  const handleSaveBasicInfo = (info) => {
    setBasicInfo(info);
    console.log("저장된 기본 정보:", info);
  };

  const handleViewBook = (book) => {
    // setSelectedBook(book);
    navigate(`/books/${book.id}`, { state: { book } });
  };

  const handleNewBook = (bookData) => {
    const newBook = {
      id: books.length + 1,
      ...bookData,
      isBookmarked: false,
      readingProgress: {
        totalPages: bookData.totalPages || 0,
        currentPage: 0,
        lastReadDate: new Date().toISOString().split("T")[0],
        notes: [],
      },
      folderId: Number(bookData.folderId),
      status: "시작",
      progress: 0,
      color:
        Object.values(COLORS)[
          Math.floor(Math.random() * Object.values(COLORS).length)
        ],
    };
    setBooks([...books, newBook]);
  };

  const handleAddFolder = (folderName) => {
    const newFolder = {
      id: folders.length + 1,
      name: folderName,
      color: `bg-${
        ["yellow", "blue", "green", "red"][Math.floor(Math.random() * 4)]
      }-500`,
      textColor: "text-white",
    };

    setFolders([...folders, newFolder]);
  };

  const handleEditFolder = (id, newName) => {
    setFolders(
      folders.map((folder) =>
        folder.id === id ? { ...folder, name: newName } : folder
      )
    );
  };

  const handleDeleteFolder = (id) => {
    setFolders(folders.filter((folder) => folder.id !== id));
  };

  const filteredBooks = books.filter((book) => {
    if (bookmarkMode) return book.bookmark;
    if (selectedFolderId) return book.folderId === selectedFolderId;
    return true;
  });

  return (
    <>
      <div>
        <Header />
        <div className="px-6">
          <button
            onClick={() => setReadingSessionOpen(true)}
            className="w-full bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-2xl p-4 mb-4 relative overflow-hidden group"
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
        </div>
        <Folders
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
          onAddFolder={handleAddFolder}
          onEditFolder={handleEditFolder}
          onDeleteFolder={handleDeleteFolder}
        />
        <ReactionPaperList
          books={filteredBooks}
          onViewBook={handleViewBook}
          onNewBook={handleNewBook}
          onToggleBookmark={toggleBookmark}
        />

        <ReadingSession
          book={{}}
          onSaveBasicInfo={handleSaveBasicInfo}
          onCompleteReading={(readingData) => {
            console.log("독서 세션 완료:", readingData);
          }}
          isOpen={isReadingSessionOpen}
          onClose={() => setReadingSessionOpen(false)}
        />

        <WriteReviewDrawer
          isOpen={isReviewDrawerOpen}
          onClose={() => setReviewDrawerOpen(false)}
          onComplete={(reviewData) => {
            console.log("작성된 독후감:", reviewData);
          }}
          basicInfo={basicInfo}
          folders={[]}
        />
      </div>
    </>
  );
};

export default Home;
