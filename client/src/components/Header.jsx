import { useState } from "react";
import { Bookmark } from "lucide-react";

function Header() {
  const [bookmarkMode, setBookmarkMode] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            나의 독서장
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            오늘은 어떤 책을 읽었나요?
          </p>
        </div>
        <button
          onClick={() => setBookmarkMode(!bookmarkMode)}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            bookmarkMode ? "bg-yellow-400" : "bg-gray-200"
          }`}
        >
          <Bookmark
            className={`w-5 h-5 ${
              bookmarkMode ? "text-white" : "text-gray-600"
            }`}
          />
        </button>
      </div>
    </>
  );
}

export default Header;
