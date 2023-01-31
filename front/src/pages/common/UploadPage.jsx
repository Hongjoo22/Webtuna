import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Loading from "../../components/common/Loading";
import {
  fetchProbability,
  fetchUpload,
} from "../../features/toons/uploadSlice";
import { changeCurrentpage } from "../../features/toons/navBarSlice";
import tuntun from "../../assets/toon/conanTun.png";
import MySwal from "../../components/common/SweetAlert";
import { forbidden, hover } from "../../assets/cursor/cursorItem";

function UploadPage() {
  sessionStorage.setItem("url", `/upload`);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(changeCurrentpage("upload"));
  }, [dispatch]);

  const { pathname } = useLocation();

  const [fileImage, setFileImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const saveFileImage = (event) => {
    setFileImage(URL.createObjectURL(event.target.files[0]));
  };

  function checkImage(e) {
    setIsLoading(true);
    predict().then((prediction) => {
      const probability = prediction.map((item) => {
        return parseFloat((item.probability * 100).toFixed(2));
      });
      const data = {
        probability,
      };
      dispatch(fetchUpload(data)).then((res) => {
        if (res.type === "fetchUpload/fulfilled") {
          dispatch(fetchProbability(probability));
          setTimeout(() => {
            setIsLoading(false);

            navigate("./result", { state: pathname });
          }, 1000);
        } else {
          MySwal.fire({
            title: "다시 시도해 주세요!",
            icon: "error",
            confirmButtonColor: "#feec91",
            confirmButtonText: "확인",
          });
          setIsLoading(false);
        }
      });
    });
  }

  async function predict() {
    const baseURL = "https://teachablemachine.withgoogle.com/models/eWqWOghSi/";
    const modelURL = baseURL + "model.json";
    const metadataURL = baseURL + "metadata.json";
    // eslint-disable-next-line
    const model = await tmImage.load(modelURL, metadataURL);
    const tempImage = document.getElementById("canvas");
    const prediction = await model.predict(tempImage, false);
    return prediction;
  }

  return (
    <div>
      {isLoading ? (
        <div>
          <Loading
            type={"upload"}
            text={"\u00A0 비슷한 썸네일 찾는 중..."}
          ></Loading>
          {fileImage && (
            <img
              id="canvas"
              alt="sample"
              src={fileImage}
              style={{ margin: "auto", display: "none" }}
            />
          )}
        </div>
      ) : (
        <Container>
          <PageBox>
            {fileImage ? (
              <>
                <MyeongToon>명탐정 툰툰</MyeongToon>
                <ImgBox>
                  <ToonImg
                    id="canvas"
                    alt="sample"
                    src={fileImage}
                    style={{ margin: "auto" }}
                  />
                </ImgBox>
              </>
            ) : (
              <>
                <TitleBox>
                  <UploadTitle>너의 그림과</UploadTitle>
                  <UploadTitle>비슷한 썸네일의 웹툰을 찾아줄게!</UploadTitle>
                </TitleBox>
                <TunImgBox>
                  <TunImg src={tuntun} alt="toon_img" />
                </TunImgBox>
              </>
            )}
            <BtnGroup>
              {fileImage ? (
                <InputBtn htmlFor="input_img">다시 업로드 하기</InputBtn>
              ) : (
                <InputBtn htmlFor="input_img">그림 업로드 하기</InputBtn>
              )}
              <input
                id="input_img"
                name="imggeUpload"
                type="file"
                accept="image/*"
                onChange={saveFileImage}
                style={{ display: "none" }}
              />
              <SubmitBtn
                active={fileImage ? true : false}
                onClick={fileImage ? checkImage : null}
              >
                제출
              </SubmitBtn>
            </BtnGroup>
          </PageBox>
        </Container>
      )}
    </div>
  );
}

const TitleBox = styled.div`
  position: relative;
  min-height: 50px;
  border: 2px solid black;
  border-radius: 10px;
  background-color: white;
  padding: 0.5vw 2vw;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  @media screen and (max-width: 750px) {
    flex-direction: column;
    padding: 10px 12px;
    gap: 0;
  }
  :after {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 0;
    content: "";
    border: 27px solid transparent;
    border-top-color: white;
    border-bottom: 0;
    margin-left: -13.3px;
    margin-bottom: -27px;
  }
  :before {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 0;
    content: "";
    border: 28px solid transparent;
    border-top-color: black;
    border-bottom: 0;
    margin-left: -14px;
    margin-bottom: -29.5px;
  }
`;

const UploadTitle = styled.p`
  font-size: 1.5vw;
  font-weight: 700;
  @media screen and (max-width: 750px) {
    font-size: 16px;
    line-height: 0;
  }
`;

const MyeongToon = styled.p`
  font-size: 2vw;
  font-weight: 700;
  margin-bottom: 3vw;
  @media screen and (max-width: 750px) {
    font-size: 20px;
    margin-bottom: 30px;
  }
`;

const SubmitBtn = styled.button`
  box-shadow: 2px 3px 2px rgba(0, 0, 0, 0.5);
  border: 0.3vw solid white;
  border-radius: 0.6vw;
  background-color: ${(props) => (props.active ? "#feec91" : "#e2e8f0")};
  padding: 10px 30px;
  margin-top: 20px;
  font-weight: 700;
  font-size: 1vw;
  :hover {
    cursor: ${(props) => !props.active && `url(${forbidden}) 13 13, auto`};
    background-color: ${(props) => (props.active ? "#ffef62" : "#e2e8f0")};
    border: ${(props) =>
      props.active ? "0.3vw solid #ffef62" : "0.3vw solid white;"};
  }
`;

const Container = styled.div`
  width: 92%;
  margin-left: auto;
  margin-right: auto;
  padding: 1vw 0;
  border: solid 2px;
  border-radius: 1rem;
  background-color: white;
`;

const PageBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 96%;
  margin-left: auto;
  margin-right: auto;
  min-height: 73vh;
  @media screen and (min-width: 1100px) {
    min-height: 68vh;
  }
  padding-top: 3vw;
  padding-bottom: 80px;
  @media screen and (max-width: 750px) {
    padding-top: 20px;
    padding-bottom: 90px;
  }
  border: solid 2px;
  border-radius: 0.8rem;
  background-color: #fff5c3;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImgBox = styled.div`
  width: 20vw;
  min-width: 300px;
  height: 20vw;
  min-height: 300px;
  border: 3px solid;
  background-color: white;
  border-radius: 10%;
  overflow: hidden;
`;

const TunImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20vw;
  height: 20vh;
  min-width: 320px;
  min-height: 320px;
  overflow: hidden;
`;

const ToonImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: fill;
  margin-left: 0.4vw;
`;

const TunImg = styled.img`
  width: 315px;
  height: 315px;
  object-fit: fill;
`;

const BtnGroup = styled.div`
  display: flex;
  justify-content: space-around;
  width: 20vw;
  min-width: 300px;
`;

const InputBtn = styled.label`
  box-shadow: 2px 3px 2px rgba(0, 0, 0, 0.5);
  border: 0.3vw solid white;
  border-radius: 0.6vw;
  background-color: #d1e2ff;
  padding: 10px 10px;
  margin-top: 20px;
  font-weight: 700;
  font-size: 1vw;
  cursor: url(${hover}) 13 13, auto;
  &:hover {
    background-color: #99c0ff;
    border: 0.3vw solid #99c0ff;
  }
`;

export default UploadPage;
