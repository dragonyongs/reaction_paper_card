import { useState } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { ChevronLeft } from "lucide-react";

const WriteReviewDrawer = ({ isOpen, onClose, onComplete, folders }) => {
  const steps = [
    {
      title: "기본 정보",
      questions: [
        {
          field: "folderId",
          question: "폴더 선택",
          placeholder: "폴더를 선택해주세요",
          type: "select",
          isContent: false,
        },
        {
          field: "title",
          question: "책 제목",
          placeholder: "책 제목을 입력해주세요",
          type: "input",
          isContent: false,
        },
        {
          field: "type",
          question: "책 종류",
          placeholder: "예: 전래동화",
          type: "input",
          isContent: false,
        },
        {
          field: "author",
          question: "저자",
          placeholder: "저자 이름을 입력해주세요",
          type: "input",
          isContent: true,
        },
      ],
    },
    {
      title: "책 선택 이유",
      questions: [
        {
          field: "reason",
          question: "이 책을 고른 이유",
          placeholder: "책을 고른 이유를 적어주세요",
          type: "textarea",
          isContent: true,
        },
        {
          field: "specialReason",
          question: "특별한 이유",
          placeholder: "책을 선택한 특별한 이유가 있다면 적어주세요",
          type: "textarea",
          isContent: true,
        },
      ],
    },
    {
      title: "인상 깊은 내용",
      questions: [
        {
          field: "memorable",
          question: "가장 기억에 남는 장면",
          placeholder: "기억에 남는 장면을 적어주세요",
          type: "textarea",
          isContent: true,
        },
        {
          field: "favoriteSentence",
          question: "마음에 든 문장",
          placeholder: "마음에 든 문장을 적어주세요",
          type: "textarea",
          isContent: true,
        },
        {
          field: "character",
          question: "주인공에 대한 생각",
          placeholder: "주인공의 행동 중 좋았던 점을 적어주세요",
          type: "textarea",
          isContent: true,
        },
      ],
    },
    {
      title: "나의 생각",
      questions: [
        {
          field: "learned",
          question: "배운 점",
          placeholder: "책에서 배운 점을 적어주세요",
          type: "textarea",
          isContent: true,
        },
        {
          field: "recommend",
          question: "추천하는 이유",
          placeholder: "왜 이 책을 추천하고 싶은지 적어주세요",
          type: "textarea",
          isContent: true,
        },
        {
          field: "rating",
          question: "별점 (1~5, 반점 가능)",
          placeholder: "별점을 입력해주세요",
          type: "number",
          isContent: true,
        },
      ],
    },
  ];

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    folderId: "",
    title: "",
    type: "",
    cover: "📚",
    content: {
      author: "",
      reason: "",
      specialReason: "",
      memorable: "",
      favoriteSentence: "",
      character: "",
      learned: "",
      recommend: "",
      rating: "",
    },
  });

  const handleChange = (field, value, isContent) => {
    if (isContent) {
      setForm({
        ...form,
        content: {
          ...form.content,
          [field]: field === "rating" ? Number(value) : value,
        },
      });
    } else {
      setForm({
        ...form,
        [field]: value,
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
    onClose();
    // 초기화 (원하면 리셋)
    setForm({
      folderId: "",
      title: "",
      type: "",
      cover: "📚",
      content: {
        author: "",
        reason: "",
        specialReason: "",
        memorable: "",
        favoriteSentence: "",
        character: "",
        learned: "",
        recommend: "",
        rating: "",
      },
    });
    setStep(0);
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      direction="right"
      size={window.innerWidth < 640 ? "100%" : "400px"}
      className="overflow-y-auto"
    >
      <div className="h-full flex flex-col p-6">
        <div className="flex items-center mb-6">
          <button onClick={onClose} className="text-gray-600">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 ml-2">
            새로운 독후감
          </h1>
        </div>

        {/* 진행 단계 UI */}
        <div className="flex justify-between mb-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex-1 text-center ${
                i === step ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${
                  i === step ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                {i + 1}
              </div>
              <span className="text-xs">{s.title}</span>
            </div>
          ))}
        </div>

        {/* 현재 단계의 질문 렌더링 */}
        <div className="bg-white rounded-2xl p-6 space-y-6 mb-6 shadow flex-1 overflow-auto">
          {steps[step].questions.map((q, i) => {
            const fieldName = q.field;
            const value = q.isContent
              ? form.content[fieldName]
              : form[fieldName];
            return (
              <div key={i} className="mb-6 last:mb-0">
                <label className="block text-gray-700 font-medium mb-2">
                  {q.question}
                </label>
                {q.type === "input" || q.type === "number" ? (
                  <input
                    type={q.type}
                    value={value}
                    onChange={(e) =>
                      handleChange(fieldName, e.target.value, q.isContent)
                    }
                    className="w-full p-3 border rounded-xl"
                    placeholder={q.placeholder}
                    {...(q.type === "number"
                      ? { step: "0.5", min: "1", max: "5" }
                      : {})}
                  />
                ) : q.type === "select" ? (
                  <select
                    value={value}
                    onChange={(e) =>
                      handleChange(fieldName, e.target.value, q.isContent)
                    }
                    className="w-full p-3 border rounded-xl"
                  >
                    <option value="">폴더 선택</option>
                    {folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <textarea
                    value={value}
                    onChange={(e) =>
                      handleChange(fieldName, e.target.value, q.isContent)
                    }
                    className="w-full p-3 border rounded-xl h-24"
                    placeholder={q.placeholder}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* 단계 이동 버튼 */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            className={`px-6 py-2 rounded-full ${
              step > 0 ? "bg-gray-200" : "invisible"
            }`}
          >
            이전
          </button>
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-yellow-400 to-red-400 text-white px-6 py-2 rounded-full"
          >
            {step === steps.length - 1 ? "완료" : "다음"}
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default WriteReviewDrawer;
