import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import MainPage from "./pages/common/MainPage";
import SignupPage from "./pages/accounts/SignupPage";
import AddInfoPage from "./pages/accounts/AddInfoPage";
import LoginPage from "./pages/accounts/LoginPage";
import ProfilePage from "./pages/accounts/ProfilePage";
import ToonToonPage from "./pages/common/ToonToonPage";
import WebtoonPage from "./pages/common/WebtoonPage";
import FilterPage from "./pages/common/FilterPage";
import ToonBTIPage from "./pages/common/ToonBTIPage";
import UploadPage from "./pages/common/UploadPage";
import UploadResultPage from "./pages/common/UploadResultPage";
import NotFoundPage from "./pages/common/NotFoundPage";
import DetailPage from "./pages/DetailPage";
import EditPage from "./pages/accounts/EditPage";
import SearchPage from "./pages/common/SearchPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="signup" element={<SignupPage />} />
          <Route path="addinfo" element={<AddInfoPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="edit" element={<EditPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="webtoonlist" element={<WebtoonPage />} />
          <Route path="filter" element={<FilterPage />} />
          <Route path="toontoon" element={<ToonToonPage />} />
          <Route path="toonbti" element={<ToonBTIPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="upload/result" element={<UploadResultPage />} />
          <Route path="detail/:toonId" element={<DetailPage />} />
          <Route path="search/" element={<SearchPage />}>
            <Route path=":keyword" element={<SearchPage />} />
          </Route>
          <Route path="" element={<MainPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Provider>
  </BrowserRouter>
);
