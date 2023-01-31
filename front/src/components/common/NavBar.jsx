import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  changeCurrentpage
} from "../../features/toons/navBarSlice";
import styled from "styled-components";
import Tooltip from "@mui/material/Tooltip";
import Home from "../../assets/navbar/Home.png";
import All from "../../assets/navbar/All.png";
import PaintStyleRecommend from "../../assets/navbar/PaintStyleRecommend.png";
import ToonBTI from "../../assets/navbar/ToonBTI.png";
import ToonToonRecommend from "../../assets/navbar/ToonToonRecommend.png";
import { hover } from "../../assets/cursor/cursorItem";

const Nav = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%; 
  background-color: #feec91;
  height: auto;
  border-top: solid 2px black;
  border-right: solid 2px black;
  border-left: solid 2px black;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  z-index: 2;
`;

const Items = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemGroup = styled.div`
  width: 45%;
  display: flex;
  justify-content: space-evenly;
  @media screen and (max-width: 750px) {
    width: 38%;
    justify-content: space-around;
  }
  align-items: center;
`;

const Item = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 2px 5px;
  margin: 3px 0;
  border-radius: 30px;
  font-weight: 500;
  @media screen and (min-width: 750px) {
    width: 150px;
  }
  @media screen and (max-width: 750px) {
    border-radius: 10px;
  }
  height: 100%;
  cursor: url(${hover}) 13 13, auto; 
`;

const ActiveItem = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 2px 5px;
  margin: 3px 0;
  border-radius: 30px;
  font-weight: 600;
  background-color: #fddc35;
  /* border: 2px solid black; */
  @media screen and (min-width: 750px) {
    width: 150px;
  }
  @media screen and (max-width: 750px) {
    border-radius: 10px;
  }
  height: 100%;
  cursor: url(${hover}) 13 13, auto; 
`;

const Toontoon = styled.div`
  position: absolute;
  left: 50%;
  margin-left: -37.5px;
  bottom: 8px;
  box-shadow: 1px 5px 2px rgba(0,0,0,0.5);
  border: 4px black double;
  border-radius: 100%;
  background-color: white;
  overflow: hidden;
  cursor: url(${hover}) 13 13, auto;
`;

const ActiveToon = styled.div`
  position: absolute;
  left: 50%;
  margin-left: -37.5px;
  bottom: 8px;
  box-shadow: 1px 5px 2px rgba(0,0,0,0.5);
  border: 4px #fddc35 double;
  border-radius: 100%;
  background-color: white;
  overflow: hidden;
  cursor: url(${hover}) 13 13, auto;
`;

const ToonImg = styled.img`
  width: 75px;
  height: 75px;
`;

const IconImg = styled.img`
  width: 40px;
  height: 40px;
`;

const IconText = styled.p`
  width: 100px;
  margin: 0;
  text-align: center;
  @media screen and (max-width: 750px) {
    display: none;
  }
`;

function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentpage = useSelector((state) => state.navbar.currentpage) || "";

  function moveMain() {
    navigate(`/`);
    dispatch(changeCurrentpage("main"))
    window.scrollTo(0, 0);
  }

  function moveList() {
    navigate(`/webtoonList`);
    dispatch(changeCurrentpage("toons"))
    window.scrollTo(0, 0);
  }

  function moveToontoon() {
    sessionStorage.setItem("url", `/toontoon`);
    navigate(`/toontoon`);
    dispatch(changeCurrentpage("myeong"))
    window.scrollTo(0, 0);
  }

  function moveUpload() {
    navigate(`/upload`);
    dispatch(changeCurrentpage("upload"))
    window.scrollTo(0, 0);
  }

  function moveToonbti() {
    navigate(`/toonbti`);
    dispatch(changeCurrentpage("toonbti"))
    window.scrollTo(0, 0);
  }

  return (
    <Nav>
      <Items>
        <ItemGroup>
          {currentpage === "main" ? (
            <ActiveItem onClick={moveMain}>
              <IconImg src={Home} alt="홈" />
              <IconText>홈</IconText>
            </ActiveItem>
          ) : (
            <Item onClick={moveMain}>
              <IconImg src={Home} alt="홈" />
              <IconText>홈</IconText>
            </Item>
          )}
          {currentpage === "toons" ? (
            <ActiveItem onClick={moveList}>
              <IconImg src={All} alt="전체 웹툰" />
              <IconText>전체 목록</IconText>
            </ActiveItem>
          ) : (
            <Item onClick={moveList}>
              <IconImg src={All} alt="전체 웹툰" />
              <IconText>전체 목록</IconText>
            </Item>
          )}
        </ItemGroup>
        <Tooltip title={`툰툰이의 추천 받아볼래?`} placement="top" arrow>
          {currentpage === "myeong" ? (
            <ActiveToon onClick={moveToontoon}>
              <ToonImg src={ToonToonRecommend} alt="툰툰추천" />
            </ActiveToon>
          ) : (
            <Toontoon onClick={moveToontoon}>
              <ToonImg src={ToonToonRecommend} alt="툰툰추천" />
            </Toontoon>
          )}
        </Tooltip>
        <ItemGroup>
          {currentpage === "upload" ? (
            <ActiveItem onClick={moveUpload}>
              <IconImg src={PaintStyleRecommend} alt="명탐정 툰툰" />
              <IconText>명탐정 툰툰</IconText>
            </ActiveItem>
          ) : (
            <Item onClick={moveUpload}>
              <IconImg src={PaintStyleRecommend} alt="명탐정 툰툰" />
              <IconText>명탐정 툰툰</IconText>
            </Item>
          )}
          {currentpage === "toonbti" ? (
            <ActiveItem onClick={moveToonbti}>
              <IconImg src={ToonBTI} alt="툰비티아이" />
              <IconText>ToonBTI</IconText>
            </ActiveItem>
          ) : (
            <Item onClick={moveToonbti}>
              <IconImg src={ToonBTI} alt="툰비티아이" />
              <IconText>ToonBTI</IconText>
            </Item>
          )}
        </ItemGroup>
      </Items>
    </Nav>
  );
}

export default NavBar;
