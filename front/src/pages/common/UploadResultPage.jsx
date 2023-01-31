import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import styled from "styled-components";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { cleanResultData } from "../../features/toons/uploadSlice";
import { changeCurrentpage } from "../../features/toons/navBarSlice";
import ChartShow from "../../components/common/Chart";

function UploadResultPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toonInfo = useSelector((state) => state.upload.webtoonInfo);
  const probability = useSelector((state) => state.upload.probability);
  const [paintGraphData, setPaintGraphData] = useState();
  const { state } = useLocation();

  const PaintStyleData = {
    width: 20,
    mwidth: 300,
    labels: [
      "동글납작",
      "반짝섬세",
      "깔끔단정",
      "터프투박",
      "단순캐릭",
      "요즘트렌디",
    ],
    datasets: [
      {
        type: "radar",
        label: "업로드한 이미지의 그림체",
        fill: true,
        backgroundColor: "#5fc4f67b",
        borderColor: "#29adf07d",
        pointBorderColor: "#4bbffa",
        pointBackgroundColor: "#65ccff",
        data: paintGraphData,
      },
    ],
  };

  const PaintStyleOptions = {
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 70,
      },
    },
  };

  useEffect(() => {
    dispatch(changeCurrentpage("upload"));
    setTimeout(() => {
      setPaintGraphData([
        probability[0] / 2 + 15,
        probability[1] / 2 + 15,
        probability[2] / 2 + 15,
        probability[3] / 2 + 15,
        probability[4] / 2 + 15,
        probability[5] / 2 + 15,
      ]);
    }, 500);
    return () => {
      dispatch(cleanResultData(undefined));
    };
  }, [dispatch, probability]);

  function moveDetail() {
    navigate(`/detail/${toonInfo.webtoon_id}`);
  }

  if (!toonInfo || !state) {
    return <Navigate to="/upload" replace={true} />;
  } else {
    return (
      <Container>
        <PageBox>
          <ResultHeader>찾았다 웹툰!!</ResultHeader>
          <ResultBox>
            <ImgBox>
              <ToonImg src={toonInfo.thumbnail} alt="thumbnail_image" />
            </ImgBox>
            <InfoBox>
              <ResultTitle>{toonInfo.title}</ResultTitle>
              <ResultSummary>{toonInfo.summary}</ResultSummary>
            </InfoBox>
            <ChartBox>
              <ChartShow
                data={PaintStyleData}
                options={PaintStyleOptions}
              ></ChartShow>
            </ChartBox>
          </ResultBox>
          <BtnGroup>
            <ResultBtn active={true} onClick={moveDetail}>
              상세 정보
            </ResultBtn>
            <ResultBtn
              active={true}
              onClick={() => {
                navigate("/upload");
              }}
            >
              <FlexBox>
                <RestartAltIcon />
                <TextAgain>다시 하기</TextAgain>
              </FlexBox>
            </ResultBtn>
          </BtnGroup>
        </PageBox>
      </Container>
    );
  }
}
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
  width: 96%;
  min-height: 73vh;
  @media screen and (min-width: 1100px) {
    min-height: 68vh;
  }
  margin-left: auto;
  margin-right: auto;
  padding-top: 2vw;
  padding-bottom: 70px;
  @media screen and (max-width: 800px) {
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

const ResultHeader = styled.p`
  font-size: 1.8vw;
  @media screen and (max-width: 1200px) {
    font-size: 24px;
  }
  font-weight: 700;
  margin-bottom: 5vw;
  text-align: center;
`;

const ResultBox = styled.div`
  width: 80%;
  @media screen and (max-width: 1100px) {
    width: 90%;
  }
  margin-left: auto;
  margin-right: auto;
  display: flex;
  gap: 2vw;
  @media screen and (max-width: 800px) {
    flex-direction: column;
    gap: 20px;
  }
  justify-content: space-between;
`;

const ImgBox = styled.div`
  width: 20vw;
  height: 20vw;
  min-width: 300px;
  min-height: 300px;
  border: 0.3vw solid white;
  border-radius: 0.8vw;
  box-shadow: 3px 5px 2px rgba(0,0,0,0.5);
  @media screen and (max-width: 800px) {
    width: 240px;
    height: 240px;
    margin-left: auto;
    margin-right: auto;
  }
  background-color: white;
  overflow: hidden;
`;

const ToonImg = styled.img`
  object-fit: fill;
  width: 100%;
  height: 100%;
`;

const InfoBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 800px) {
    gap: 10px;
  }
`;

const ChartBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ResultTitle = styled.p`
  font-size: 1.5vw;
  font-weight: 600;
  margin: 0;
  @media screen and (max-width: 800px) {
    font-size: 20px;
    text-align: center;
  }
`;

const ResultSummary = styled.div`
  font-size: 1vw;
  width: 80%;
  height: 15vw;
  @media screen and (max-width: 1200px) {
    height: 240px;
  }
  padding: 8px 10px;
  background-color: white;
  border: 2px solid;
  border-radius: 0.5vw;
  overflow: auto;
  @media screen and (max-width: 800px) {
    height: 80px;
    border-radius: 3px;
  }
  &::-webkit-scrollbar {
    width: 1vw;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #bab9b9;
    border-radius: 3vw;
  }
  &::-webkit-scrollbar-track {
    background-color: #e7e4e4;
    border-radius: 3vw;
  }
`;

const BtnGroup = styled.div`
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  gap: 3vw;
  margin-top: 3vw;
  margin-bottom: 4vw;
  @media screen and (max-width: 800px) {
    gap: 20px;
    margin-top: 20px;
    margin-bottom: 70px;
  }
`;

const ResultBtn = styled.button`
  box-shadow: 2px 3px 2px rgba(0,0,0,0.5);  
  border: 0.2vw solid white;
  border-radius: 0.6vw;
  background-color: #d1e2ff;
  width: 40%;
  @media screen and (max-width: 1100px) {
    width: 48%;
  }
  padding: 5px 0;
  font-size: 0.8vw;
  font-weight: 700;
  &:hover {
    background-color: #99c0ff;
    border: 0.2vw solid #99c0ff;
  }
`;

const FlexBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextAgain = styled.p`
  margin: 0;
`;

export default UploadResultPage;
