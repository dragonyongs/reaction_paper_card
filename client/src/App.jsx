import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import ViewBookPage from "./components/ViewBookPage";
// import WriteReviewPage from "./components/WriteReviewPage";
// import { foldersData } from "./data/foldersData";

function App() {
  // const handleReviewComplete = (formData) => {
  //   console.log("새 독후감 데이터:", formData);
  // };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books/:bookId" element={<ViewBookPage />} />
        {/* <Route
          path="/write-review"
          element={
            <WriteReviewPage
              onBack={() => window.history.back()}
              onComplete={handleReviewComplete}
              folders={foldersData}
            />
          }
        /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
