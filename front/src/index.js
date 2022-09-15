import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import MainPage from "./pages/common/MainPage";
import SignupPage from "./pages/accounts/SignupPage";
import LoginPage from "./pages/accounts/LoginPage";
import ProfilePage from "./pages/accounts/ProfilePage";
import ToonToonPage from "./pages/common/ToonToonPage";
import WebtoonPage from "./pages/common/WebtoonPage";
import MBTIPage from "./pages/common/MBTIPage";
import UploadPage from "./pages/common/UploadPage";
import NotFoundPage from "./pages/common/NotFoundPage";
import DetailPage from "./pages/DetailPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="signup" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="webtoonlist" element={<WebtoonPage />} />
          <Route path="toontoon" element={<ToonToonPage />} />
          <Route path="mbti" element={<MBTIPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="detail/:toonId" element={<DetailPage />} />
          <Route path="" element={<MainPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Provider>
  </BrowserRouter>
);