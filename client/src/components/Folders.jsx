import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, Plus, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { Modal } from "./ui/Modal";

// FolderItem 컴포넌트를 forwardRef로 감싸서 ref 전달을 허용합니다.
const FolderItem = React.forwardRef(
  (
    { folder, selectedFolderId, onSelectFolder, onEditFolder, onDeleteFolder },
    ref
  ) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
      <div ref={ref} className="inline-flex">
        <button
          onClick={() => onSelectFolder(folder.id)}
          className={`px-4 py-2 text-left whitespace-nowrap focus:outline-none ${
            selectedFolderId === folder.id
              ? `${folder.color} ${folder.textColor}`
              : "bg-gray-200 text-gray-800"
          } rounded-l-full`}
        >
          {folder.name}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className={`px-3 py-2 focus:outline-none ${
            selectedFolderId === folder.id
              ? `${folder.color} ${folder.textColor}`
              : "bg-gray-200 text-gray-800"
          } rounded-r-full`}
        >
          <Edit2 className="w-3 h-3" />
        </button>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-lg font-bold">폴더 관리</h2>
            </div>
            <input
              type="text"
              defaultValue={folder.name}
              className="w-full p-2 border rounded"
              onBlur={(e) => onEditFolder(folder.id, e.target.value)}
            />
            <button
              onClick={() => {
                onDeleteFolder(folder.id);
                setIsModalOpen(false);
              }}
              className="w-full p-2 bg-red-500 text-white rounded flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              폴더 삭제
            </button>
          </div>
        </Modal>
      </div>
    );
  }
);

const Folders = ({
  folders,
  selectedFolderId,
  onSelectFolder,
  onAddFolder,
  onEditFolder,
  onDeleteFolder,
}) => {
  const scrollRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // 각 폴더의 ref를 관리하기 위한 객체입니다.
  const folderRefs = useRef({});

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollLeft += scrollAmount;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        setShowControls(scrollWidth > clientWidth);
      }
    };
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [folders]);

  // selectedFolderId가 변경될 때 해당 탭으로 스크롤합니다.
  useEffect(() => {
    if (selectedFolderId !== null && folderRefs.current[selectedFolderId]) {
      folderRefs.current[selectedFolderId].current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedFolderId]);

  const handleCreateFolder = () => {
    if (newFolderName.trim() === "") return;
    onAddFolder(newFolderName);
    setNewFolderName("");
    setIsNewFolderModalOpen(false);
  };

  return (
    <div className="relative px-7">
      {showControls && (
        <>
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
      <div
        ref={scrollRef}
        className="flex space-x-2 overflow-x-hidden scrollbar-hide py-2 px-1"
        style={{ scrollBehavior: "smooth" }}
      >
        <button
          onClick={() => onSelectFolder(null)}
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            selectedFolderId === null
              ? "bg-gray-800 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          전체보기
        </button>
        {folders.map((folder) => {
          if (!folderRefs.current[folder.id]) {
            folderRefs.current[folder.id] = React.createRef();
          }
          return (
            <FolderItem
              key={folder.id}
              ref={folderRefs.current[folder.id]}
              folder={folder}
              selectedFolderId={selectedFolderId}
              onSelectFolder={onSelectFolder}
              onEditFolder={onEditFolder}
              onDeleteFolder={onDeleteFolder}
            />
          );
        })}
        <div className="relative inline-flex">
          <button
            onClick={() => setIsNewFolderModalOpen(true)}
            className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 inline mr-1" />새 폴더
          </button>
        </div>
      </div>
      <Modal
        isOpen={isNewFolderModalOpen}
        onClose={() => setIsNewFolderModalOpen(false)}
      >
        <div className="space-y-4">
          <div className="mb-4">
            <h2 className="text-lg font-bold">새 폴더 만들기</h2>
          </div>
          <input
            type="text"
            placeholder="폴더 이름"
            className="w-full p-2 border rounded"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleCreateFolder();
              }
            }}
          />
          <button
            onClick={handleCreateFolder}
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            폴더 생성
          </button>
        </div>
      </Modal>
    </div>
  );
};

FolderItem.displayName = "FolderItem";

export default Folders;
