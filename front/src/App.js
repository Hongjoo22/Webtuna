import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import GlobalStyle from "./GlobalStyle";
import Loading from "./components/common/Loading";
import HeaderBar from "./components/common/HeaderBar";
import NavBar from "./components/common/NavBar";
import {
  changeLoginState,
  changeCurrentUser,
} from "./features/accounts/loginSlice";
import Today from "./components/common/Today";
import ClickSound from "../src/music/571119__elfstonepress__boing-sfx.mp3";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  const clickSound = new Audio(ClickSound);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      dispatch(changeLoginState());
      const userInfo = JSON.parse(sessionStorage.getItem("user"));
      dispatch(changeCurrentUser(userInfo));
    }
  }, [dispatch]);

  const isLoading = useSelector((state) => state.search.isLoading);
  const isPossibleModal = useSelector((state) => state.login.isPossibleModal);
  const isLockyModal = useSelector((state) => state.login.luckyModal);

  function test() {
    clickSound.play();
  }

  function clickEffect(e) {
    let d = document.createElement("div");
    d.className = "clickEffect";
    d.style.top = e.clientY + "px";
    d.style.left = e.clientX + "px";
    document.body.appendChild(d);
    d.addEventListener("animationend", function () {
      d.parentElement.removeChild(d);
    });
  }
  document.addEventListener("click", clickEffect);

  return (
    <>
      <div onClick={test}>
        <GlobalStyle />
        <HeaderBar></HeaderBar>
        {isPossibleModal && isLockyModal && <Today></Today>}
        {isLoading ? <Loading></Loading> : <Outlet></Outlet>}
        <NavBar></NavBar>
      </div>
    </>
  );
}

export default App;
