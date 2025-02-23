import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

const ReactionPaperList = ({ books, onViewBook, onToggleBookmark }) => {
  const [presetTitles, setPresetTitles] = useState([]);

  useEffect(() => {
    const uniqueTitles = [...new Set(books.map((book) => book.title))];
    setPresetTitles(uniqueTitles);
  }, [books]);

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <div
          key={book.id}
          className="bg-white rounded-3xl p-5 cursor-pointer transform hover:scale-[1.02] transition-all shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div onClick={() => onViewBook(book)} className="flex-1">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 ${book.color} rounded-2xl flex items-center justify-center text-2xl`}
                >
                  {book.cover}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.type}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-blue-400 to-green-400`}
                        style={{ width: `${book.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {book.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => onToggleBookmark(book.id)}
              className={`p-2 rounded-full ${
                book.isBookmarked ? "bg-yellow-100" : "bg-gray-100"
              }`}
            >
              <Bookmark
                className={`w-5 h-5 ${
                  book.isBookmarked ? "text-yellow-500" : "text-gray-400"
                }`}
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReactionPaperList;
