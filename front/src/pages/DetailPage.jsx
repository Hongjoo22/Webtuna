import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  detail,
  noLoginDetail,
  webtoonLike,
  webtoonLog,
  webtoonRating,
  tagLike,
} from "../features/details/detailSlice";
import { fetchInfo } from "../features/accounts/loginSlice";
import { changeCurrentpage } from "../features/toons/navBarSlice";
import styled from "styled-components";
import BookMark from "../assets/detail/BookMark.png";
import ChartShow from "../components/common/Chart";
import Loading from "../components/common/Loading";
import ModalFrame from "../components/common/ModalFrame";
import MoveTop from "../components/common/MoveTop";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import FullHeart from "../assets/detail/FullHeart.png";
import EmptyHeart from "../assets/detail/EmptyHeart.png";
import MySwal from "../components/common/SweetAlert";
import Left from "../../src/assets/detail/Left.png";
import Right from "../../src/assets/detail/Right.png";
import Empty from "../../src/assets/tuntunEmpty.png";
import { forbidden, hover } from "../assets/cursor/cursorItem";
import "./DetailPage.css";

function DetailPage() {
  let { toonId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [webToonInfo, setWebToonInfo] = useState();
  const [otherWebToons, setOtherWebToons] = useState();
  const [paintGraphData, setPaintGraphData] = useState();
  const [ratingGraphData, setRatingGraphData] = useState();
  const [ratingCount, setRatingCount] = useState();
  const [modal, setModal] = useState(false);
  const [count, setCount] = useState(1);
  const [slideCount, setSlideCount] = useState();
  const [authors, setAuthors] = useState();
  const [ageGroupLabel, setAgeGroupLabel] = useState();
  const [ageGroupData, setAgeGroupData] = useState();
  const [ageGroupColor, setAgeGroupColor] = useState();
  const [averageRating, setAverageRating] = useState();
  // const [modalRating, setModalRating] = useState(5);
  const day = ["None", "월", "화", "수", "목", "금", "토", "일", "완결"];
  const maleColor = [
    "rgba(46, 157, 248, 0.2)",
    "rgba(47, 147, 229, 0.593)",
    "rgba(101, 193, 243, 0.73)",
    "rgba(77, 119, 236, 0.451)",
    "rgba(37, 163, 191, 0.451)",
  ];
  const femaleColor = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(213, 70, 101, 0.358)",
    "rgba(213, 70, 168, 0.358)",
    "rgba(206, 97, 97, 0.37)",
    "rgba(200, 78, 38, 0.37)",
  ];
  let maleIndex = 0;
  let femaleIndex = 0;

  let userData = useSelector((state) => state.login.currentUser);
  let loginState = sessionStorage.getItem("token");
  let slide;

  const { pathname } = useLocation();

  function getDetail() {
    sessionStorage.setItem("url", `/detail/${toonId}`);
    window.scrollTo(0, 0);
    if (!loginState) {
      dispatch(noLoginDetail(toonId)).then((res) => {
        let temp = 0;
        let total = 0;
        for (let i = 1; i < 11; i++) {
          temp += res.payload.data.webtoon_rate[i] * (0.5 * i);
          total += res.payload.data.webtoon_rate[i];
        }
        setAverageRating(Math.round((temp / total) * 10) / 10);

        setWebToonInfo(res.payload);
        setPaintGraphData([
          res.payload.data.image_type1 / 2 + 15,
          res.payload.data.image_type2 / 2 + 15,
          res.payload.data.image_type3 / 2 + 15,
          res.payload.data.image_type4 / 2 + 15,
          res.payload.data.image_type5 / 2 + 15,
          res.payload.data.image_type6 / 2 + 15,
        ]);
        setRatingGraphData([
          ((res.payload.data.webtoon_rate[1] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[2] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[3] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[4] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[5] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[6] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[7] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[8] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[9] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[10] * 100) / total).toFixed(2),
        ]);
        getAgeGroupData();
        setRatingCount(getRatingCount(res.payload.data));
        setOtherWebToons(res.payload.author_webtoons);
        setSlideCount(
          Math.ceil(Number(res.payload.author_webtoons.length) / 4)
        );
        let tempauthors = "";
        for (const num in res.payload.data.authors) {
          if (num > 0) {
            tempauthors += " / ";
            tempauthors += res.payload.data.authors[num].name;
          } else {
            tempauthors += res.payload.data.authors[num].name;
          }
        }
        setAuthors(tempauthors);
        setIsLoading(false);
        setTimeout(() => {
          slide = document.getElementById("slide");
          slide.style.left = "0vw";
          setCount(1);
        }, 100);
      });
    } else {
      dispatch(detail(toonId)).then((res) => {
        let temp = 0;
        let total = 0;
        for (let i = 1; i < 11; i++) {
          temp += res.payload.data.webtoon_rate[i] * (0.5 * i);
          total += res.payload.data.webtoon_rate[i];
        }
        setAverageRating(Math.round((temp / total) * 10) / 10);

        setWebToonInfo(res.payload);
        setPaintGraphData([
          res.payload.data.image_type1 / 2 + 15,
          res.payload.data.image_type2 / 2 + 15,
          res.payload.data.image_type3 / 2 + 15,
          res.payload.data.image_type4 / 2 + 15,
          res.payload.data.image_type5 / 2 + 15,
          res.payload.data.image_type6 / 2 + 15,
        ]);
        setRatingGraphData([
          ((res.payload.data.webtoon_rate[1] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[2] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[3] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[4] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[5] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[6] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[7] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[8] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[9] * 100) / total).toFixed(2),
          ((res.payload.data.webtoon_rate[10] * 100) / total).toFixed(2),
        ]);
        getAgeGroupData();
        setRatingCount(getRatingCount(res.payload.data));
        setOtherWebToons(res.payload.author_webtoons);
        setSlideCount(
          Math.ceil(Number(res.payload.author_webtoons.length) / 4)
        );
        let tempauthors = "";
        for (const num in res.payload.data.authors) {
          if (num > 0) {
            tempauthors += " / ";
            tempauthors += res.payload.data.authors[num].name;
          } else {
            tempauthors += res.payload.data.authors[num].name;
          }
        }
        setAuthors(tempauthors);
        setIsLoading(false);
        setTimeout(() => {
          slide = document.getElementById("slide");
          slide.style.left = "0vw";
          setCount(1);
          if (document.getElementById("test") != null) {
            document
              .getElementById("test")
              .addEventListener("click", heartClickEffect);
          }
        }, 100);
      });
    }
  }

  function getAgeGroupData() {
    if (!loginState) {
      dispatch(noLoginDetail(toonId)).then((res) => {
        if (res.payload.gender_age.length !== 0) {
          let tempLabel = [];
          let tempColor = [];
          for (let i = 0; i < res.payload.gender_age.length; i++) {
            tempLabel.push(
              (res.payload.gender_age[i][0].substr(0, 2) === "00"
                ? "10세 미만"
                : res.payload.gender_age[i][0].substr(0, 2) === "90"
                  ? "90세 이상"
                  : res.payload.gender_age[i][0].substr(0, 2) + "대") +
              (res.payload.gender_age[i][0].substr(-1) === "F"
                ? " 여성"
                : " 남성")
            );
            tempColor.push(
              res.payload.gender_age[i][0].substr(-1) === "F"
                ? femaleColor[femaleIndex++]
                : maleColor[maleIndex++]
            );
          }
          setAgeGroupLabel(tempLabel);
          setAgeGroupColor(tempColor);
          let tempData = [];
          let total = 0;
          for (let i = 0; i < res.payload.gender_age.length; i++) {
            total += res.payload.gender_age[i][1];
          }
          for (let i = 0; i < res.payload.gender_age.length; i++) {
            tempData.push(
              ((res.payload.gender_age[i][1] * 100) / total).toFixed(2)
            );
          }
          setAgeGroupData(tempData);
        } else {
          setAgeGroupData(0);
        }
      });
    } else {
      dispatch(detail(toonId)).then((res) => {
        if (res.payload.gender_age.length !== 0) {
          let tempLabel = [];
          let tempColor = [];
          for (let i = 0; i < res.payload.gender_age.length; i++) {
            tempLabel.push(
              (res.payload.gender_age[i][0].substr(0, 2) === "00"
                ? "10세 미만"
                : res.payload.gender_age[i][0].substr(0, 2) === "90"
                  ? "90세 이상"
                  : res.payload.gender_age[i][0].substr(0, 2) + "대") +
              (res.payload.gender_age[i][0].substr(-1) === "F"
                ? " 여성"
                : " 남성")
            );
            tempColor.push(
              res.payload.gender_age[i][0].substr(-1) === "F"
                ? femaleColor[femaleIndex++]
                : maleColor[maleIndex++]
            );
          }
          setAgeGroupLabel(tempLabel);
          setAgeGroupColor(tempColor);
          let tempData = [];
          let total = 0;
          for (let i = 0; i < res.payload.gender_age.length; i++) {
            total += res.payload.gender_age[i][1];
          }
          for (let i = 0; i < res.payload.gender_age.length; i++) {
            tempData.push(
              ((res.payload.gender_age[i][1] * 100) / total).toFixed(2)
            );
          }
          setAgeGroupData(tempData);
        } else {
          setAgeGroupData(0);
        }
      });
    }
  }

  function getRatingData() {
    dispatch(detail(toonId)).then((res) => {
      let temp = 0;
      let total = 0;
      for (let i = 1; i < 11; i++) {
        temp += res.payload.data.webtoon_rate[i] * (0.5 * i);
        total += res.payload.data.webtoon_rate[i];
      }
      setAverageRating(Math.round((temp / total) * 10) / 10);

      setRatingGraphData([
        ((res.payload.data.webtoon_rate[1] * 100) / total).toFixed(2),
        ((res.payload.data.webtoon_rate[2] * 100) / total).toFixed(2),
        ((res.payload.data.webtoon_rate[3] * 100) / total).toFixed(2),
        ((res.payload.data.webtoon_rate[4] * 100) / total).toFixed(2),
        ((res.payload.data.webtoon_rate[5] * 100) / total).toFixed(2),
        ((res.payload.data.webtoon_rate[6] * 100) / total).toFixed(2),
        ((res.payload.data.webtoon_rate[7] * 100) / total).toFixed(2),
        ((res.payload.data.webtoon_rate[8] * 100) / total).toFixed(2),
        ((res.payload.data.webtoon_rate[9] * 100) / total).toFixed(2),
        ((res.payload.data.webtoon_rate[10] * 100) / total).toFixed(2),
      ]);
      webToonInfo.is_rated = 1;
      setRatingCount(getRatingCount(res.payload.data));
    });
  }

  function getRatingCount(data) {
    let total = 0;
    for (let i = 0; i < 11; i++) {
      total += data.webtoon_rate[i];
    }

    return total;
  }

  function switchModal() {
    setModal((prev) => !prev);
  }

  function changeRating(e) {
    let ratingBtn = document.getElementById("ratingButton");
    MySwal.fire({
      title: `${e.target.value}점이 확실합니까?`,
      text: "한 번 준 별점은 변경할 수 없습니다!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#faaf00",
      cancelButtonColor: "gray",
      confirmButtonText: "네",
      cancelButtonText: "아니오",
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          icon: "success",
          title: "별점이 반영되었습니다!",
          confirmButtonColor: "#faaf00",
        });
        ratingBtn.className += " disabledbutton";
        let data = { toonId, rating: e.target.value };
        dispatch(webtoonRating(data)).then((res) => {
          if (res.error) {
          } else {
            getRatingData();
          }
        });
        setModal(false);
      }
    });
  }

  function heartClick() {
    dispatch(webtoonLike(toonId)).then((res) => {
      if (res.error) {
      } else {
        getAgeGroupData();
        dispatch(fetchInfo()).then(() => {
          if (document.getElementById("test") != null) {
            document
              .getElementById("test")
              .addEventListener("click", heartClickEffect);
          }
        });
      }
    });
  }

  function logAndLink() {
    if (loginState === null) {
    } else {
      dispatch(webtoonLog(toonId)).then((res) => {
        if (res.error) {
        } else {
          dispatch(fetchInfo()).then(() => {
          });
        }
      });
    }
    window.open(webToonInfo.data.page);
  }

  function moveDetail(e) {
    setIsLoading(true);
    toonId = e.target.parentNode.parentNode.id;
    navigate(`/detail/${toonId}`);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 200);
  }

  function tagSwitch(e) {
    if (e.target.id) {
      dispatch(tagLike(e.target.id)).then((res) => {
        if (res.error) {
        } else {
          dispatch(fetchInfo()).then((res) => {
            sessionStorage.setItem("user", JSON.stringify(res.payload.user));
          });
        }
      });
    } else {
      dispatch(tagLike(e.target.parentNode.id)).then((res) => {
        if (res.error) {
        } else {
          dispatch(fetchInfo()).then((res) => {
            sessionStorage.setItem("user", JSON.stringify(res.payload.user));
          });
        }
      });
    }
  }

  function left(e) {
    slide = document.getElementById("slide");
    let tempClassName = e.target.className;
    e.target.className += " disabledbutton";
    slide.className += " trans";
    if (count === 1) {
      return;
    } else {
      let temp = Number(
        slide.style.left.substring(0, slide.style.left.length - 2)
      );
      slide.style.left = temp + 68.1 + "vw";
      setCount((prev) => prev - 1);
      setTimeout(() => {
        slide.className = "SARecommends";
        e.target.className = tempClassName;
      }, 1000);
    }
  }

  function right(e) {
    slide = document.getElementById("slide");
    let tempClassName = e.target.className;
    e.target.className += " disabledbutton";
    slide.className += " trans";
    if (count === slideCount) {
      return;
    } else {
      let temp = Number(
        slide.style.left.substring(0, slide.style.left.length - 2)
      );
      slide.style.left = temp - 68.1 + "vw";
      setCount((prev) => prev + 1);
      setTimeout(() => {
        slide.className = "SARecommends";
        e.target.className = tempClassName;
      }, 1000);
    }
  }

  function toLogin() {
    MySwal.fire({
      title: "로그인 후 이용해주세요.",
      icon: "warning",
      confirmButtonColor: "#feec91",
      confirmButtonText: "확인",
      reverseButtons: true,
    });
    navigate("/login", { state: pathname });
  }

  function heartClickEffect(e) {
    let d = document.createElement("img");
    d.src = FullHeart;
    d.className = "heartClickEffect";
    d.style.top = e.clientY + "px";
    d.style.left = e.clientX + "px";
    document.body.appendChild(d);
    d.addEventListener("animationend", function () {
      d.parentElement.removeChild(d);
    });
  }

  useEffect(() => {
    dispatch(changeCurrentpage(""));
    setIsLoading(true);
    getDetail();
  }, [toonId]);

  const PaintStyleData = {
    margintop: 3,
    marginleft: 0,
    width: 25,
    mwidth: 280,
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
        label: "이 웹툰의 그림체 분석",
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

  const AgeGroupData = {
    margintop: 3,
    marginleft: 0,
    width: 23,
    mwidth: 240,
    labels: ageGroupLabel,
    datasets: [
      {
        type: "pie",
        label: "이 웹툰을 좋아하는 연령대",
        fill: true,
        backgroundColor: ageGroupColor,
        borderColor: ["white", "white", "white", "white", "white"],
        pointBorderColor: "#fff",
        pointBackgroundColor: "rgba(179,181,198,1)",
        data: ageGroupData,
      },
    ],
  };

  const AgeGrouoOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "이 웹툰을 좋아하는 성별 연령 TOP5",
      },
      tooltip: {
        enabled: true,
        usePointStyle: true,
        callbacks: {
          label: (data) => {
            return data.formattedValue + "%";
          },
        },
      },
    },
  };

  const RatingGraphData = {
    margintop: 3,
    marginleft: 0,
    width: 40,
    mwidth: 320,
    labels: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    datasets: [
      {
        type: "bar",
        label: "이 웹툰의 별점 분포",
        fill: true,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        pointBorderColor: "#fff",
        pointBackgroundColor: "rgba(179,181,198,1)",
        data: ratingGraphData,
      },
    ],
  };

  const RatingGraphOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "이 웹툰의 별점 분포",
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (data) => {
            return data.formattedValue + "%";
          },
        },
      },
    },
  };

  return (
    <>
      {isLoading ? (
        <Loading></Loading>
      ) : (
        <PageBox>
          <MoveTop></MoveTop>
          <BackGround>
            <DetailZone>
              <Thumbnail>
                <ThumbnailImage
                  src={webToonInfo.data.thumbnail}
                  alt="썸네일"
                ></ThumbnailImage>
              </Thumbnail>
              <Info>
                <Title>{webToonInfo.data.title}</Title>
                <Author>{authors}</Author>
                <RatingZone>
                  <RatingText>
                    별점 ★ {averageRating} ({ratingCount}명)
                  </RatingText>
                  {loginState === null ? (
                    <RatingButton onClick={toLogin}>별점 주기</RatingButton>
                  ) : webToonInfo.is_rated === 1 ? (
                    <AlreadyRating>참여 완료</AlreadyRating>
                  ) : (
                    <RatingButton onClick={switchModal} id="ratingButton">
                      별점 주기
                    </RatingButton>
                  )}
                  {modal ? (
                    <ModalFrame
                      _handleModal={switchModal}
                      width="30%"
                      height="auto"
                    >
                      <ModalTitle>당신의 별점은?</ModalTitle>
                      <StarZone>
                        <Rating
                          name="half-rating"
                          defaultValue={5.0}
                          precision={0.5}
                          icon={
                            <StarIcon
                              style={{ width: "5.2vw", height: "5.2vw" }}
                            ></StarIcon>
                          }
                          emptyIcon={
                            <StarIcon
                              style={{
                                width: "5.2vw",
                                height: "5.2vw",
                              }}
                            />
                          }
                          onChange={changeRating}
                        />
                      </StarZone>
                    </ModalFrame>
                  ) : null}
                </RatingZone>
                <Genre>
                  {webToonInfo.data.genres.map(
                    (genre) => genre.genre_type + " "
                  )}
                </Genre>
                <Day>
                  {webToonInfo.data.days[0].day_id === 8
                    ? "완결 웹툰"
                    : webToonInfo.data.days.length === 1
                      ? `${day[webToonInfo.data.days[0].day_id]}요일 연재`
                      : webToonInfo.data.days
                        .slice(0, -1)
                        .map((dayy) => day[dayy.day_id]) +
                      " , " +
                      webToonInfo.data.days
                        .slice(-1)
                        .map((dayy) => day[dayy.day_id]) +
                      "요일 연재"}
                </Day>
                <MWebToonLink>
                  {userData.liked_webtoons === undefined ? (
                    <EHeart
                      src={EmptyHeart}
                      alt="노찜"
                      onClick={toLogin}
                    ></EHeart>
                  ) : userData.liked_webtoons.includes(Number(toonId)) ? (
                    <FHeart
                      src={FullHeart}
                      alt="찜"
                      onClick={heartClick}
                    ></FHeart>
                  ) : (
                    <EHeart
                      src={EmptyHeart}
                      alt="노찜"
                      onClick={heartClick}
                      id="test"
                    ></EHeart>
                  )}
                  <LinkButton onClick={logAndLink}>
                    <>웹툰 보러가기</>
                  </LinkButton>
                </MWebToonLink>
              </Info>
              <SubInfo>
                <WebToonLink>
                  {userData.liked_webtoons === undefined ? (
                    <EHeart
                      src={EmptyHeart}
                      alt="노찜"
                      onClick={toLogin}
                    ></EHeart>
                  ) : userData.liked_webtoons.includes(Number(toonId)) ? (
                    <FHeart
                      src={FullHeart}
                      alt="찜"
                      onClick={heartClick}
                    ></FHeart>
                  ) : (
                    <EHeart
                      src={EmptyHeart}
                      alt="노찜"
                      onClick={heartClick}
                      id="test"
                    ></EHeart>
                  )}
                  <LinkButton onClick={logAndLink}>
                    <>웹툰 보러가기</>
                  </LinkButton>
                </WebToonLink>
                <Summary>{webToonInfo.data.summary}</Summary>
              </SubInfo>
            </DetailZone>
            <MSummary>{webToonInfo.data.summary}</MSummary>
            {webToonInfo.data.tags.length === 0 ||
              webToonInfo.data.tags === undefined ? (
              <NoTag>
                <>태그가 존재하지 않습니다.</>
              </NoTag>
            ) : (
              <TagZone>
                {webToonInfo.data.tags.map((tag) =>
                  loginState === null ? (
                    <Tag key={tag.tag_id} id={tag.tag_id}>
                      <BookMarkImage src={BookMark} alt="북마크" />
                      <TagName onClick={toLogin}>{tag.name}</TagName>
                    </Tag>
                  ) : userData.tags?.includes(tag.tag_id) ? (
                    <LikedTag
                      key={tag.tag_id}
                      id={tag.tag_id}
                      onClick={tagSwitch}
                    >
                      <BookMarkImage src={BookMark} alt="북마크" />
                      <TagName>{tag.name}</TagName>
                      <MinusButton>-</MinusButton>
                    </LikedTag>
                  ) : (
                    <Tag key={tag.tag_id} id={tag.tag_id} onClick={tagSwitch}>
                      <BookMarkImage src={BookMark} alt="북마크" />
                      <TagName>{tag.name}</TagName>
                      <PlusButton>+</PlusButton>
                    </Tag>
                  )
                )}
              </TagZone>
            )}

            <WebToonAnalysisZone>
              <AnalysisBack>
                <Analysis>
                  <PaintStyleAnalysis>
                    <ChartTitle1>그림체 분석</ChartTitle1>
                    <ChartShow
                      data={PaintStyleData}
                      options={PaintStyleOptions}
                    ></ChartShow>
                  </PaintStyleAnalysis>
                  <AgeGroupAnalysis>
                    <ChartTitle1>연령대 분석</ChartTitle1>
                    {ageGroupData === 0 ? (
                      <AgeGroupEmpty>
                        <EmptyImg src={Empty} />
                        <Bubble>
                          <>
                            데이터가 부족해요...
                            <br /> 이 웹툰을 찜해서 <br />
                            그래프를 만들어주세요
                          </>
                        </Bubble>
                      </AgeGroupEmpty>
                    ) : (
                      <ChartShow
                        data={AgeGroupData}
                        options={AgeGrouoOptions}
                      ></ChartShow>
                    )}
                  </AgeGroupAnalysis>
                </Analysis>
                <RatingGraph>
                  <ChartTitle2>별점 그래프</ChartTitle2>
                  <ChartShow
                    data={RatingGraphData}
                    options={RatingGraphOptions}
                  ></ChartShow>
                </RatingGraph>
              </AnalysisBack>
            </WebToonAnalysisZone>
            <PaintStyleRecommendZone>
              <GroupHeader>그림체가 비슷한 웹툰</GroupHeader>
              <PSRecommends>
                {webToonInfo.similar_webtoon.length === 0 ||
                  webToonInfo.similar_webtoon === undefined ? (
                  <OtherWebToonEmpty>
                    <EmptyImg src={Empty} />
                    <Bubble>그림체가 비슷한 웹툰이 없어요...</Bubble>
                  </OtherWebToonEmpty>
                ) : (
                  webToonInfo.similar_webtoon.map((similarWebtoon) => (
                    <DrawingWebToon
                      key={similarWebtoon.webtoon_id}
                      id={similarWebtoon.webtoon_id}
                    >
                      <ImgBox onClick={moveDetail}>
                        <OtherWebToonThumbnail
                          src={similarWebtoon.thumbnail}
                          alt="그림체가 비슷한 웹툰 이미지"
                        ></OtherWebToonThumbnail>
                      </ImgBox>
                      <ToonInfo onClick={moveDetail}>
                        <OtherWebToonTitle>
                          {similarWebtoon.title}
                        </OtherWebToonTitle>
                        <OtherWebToonAuthor>
                          {similarWebtoon.author_name.length === 1
                            ? similarWebtoon.author_name[0]
                            : similarWebtoon.author_name
                              .slice(0, -1)
                              .map((author) => author) +
                            " / " +
                            similarWebtoon.author_name
                              .slice(-1)
                              .map((author) => author)}
                        </OtherWebToonAuthor>
                      </ToonInfo>
                    </DrawingWebToon>
                  ))
                )}
              </PSRecommends>
            </PaintStyleRecommendZone>
            <SameAuthorRecommendZone>
              <Box>
                <GroupHeader>같은 작가의 다른 웹툰</GroupHeader>
                {slideCount >= 2 ? (
                  <>
                    {count === 1 ? null : (
                      <PrevBtn src={Left} onClick={left} alt="좌"></PrevBtn>
                    )}
                    {count === slideCount ? null : (
                      <NextBtn src={Right} onClick={right} alt="우"></NextBtn>
                    )}
                  </>
                ) : null}
                <SARecommendsBack>
                  <div className="SARecommends" id="slide">
                    {otherWebToons.length === 0 ||
                      otherWebToons === undefined ? (
                      <OtherWebToonEmpty>
                        <EmptyImg src={Empty} />
                        <Bubble>작가님의 다른 웹툰이 없어요...</Bubble>
                      </OtherWebToonEmpty>
                    ) : (
                      otherWebToons.map((otherWebToon) => (
                        <OtherWebToon
                          key={otherWebToon.webtoon_id}
                          id={otherWebToon.webtoon_id}
                        >
                          <ImgBox onClick={moveDetail}>
                            <OtherWebToonThumbnail
                              src={otherWebToon.thumbnail}
                              alt="같은 작가의 다른 웹툰 이미지"
                            ></OtherWebToonThumbnail>
                          </ImgBox>
                          <ToonInfo onClick={moveDetail}>
                            <OtherWebToonTitle>
                              {otherWebToon.title}
                            </OtherWebToonTitle>
                            <OtherWebToonAuthor>
                              {otherWebToon.author_name.length === 1
                                ? otherWebToon.author_name[0]
                                : otherWebToon.author_name
                                  .slice(0, -1)
                                  .map((author) => author) +
                                " / " +
                                otherWebToon.author_name
                                  .slice(-1)
                                  .map((author) => author)}
                            </OtherWebToonAuthor>
                          </ToonInfo>
                        </OtherWebToon>
                      ))
                    )}
                  </div>
                </SARecommendsBack>
              </Box>
            </SameAuthorRecommendZone>
          </BackGround>
        </PageBox>
      )}
    </>
  );
}

const PageBox = styled.div`
  width: 92%;
  margin-left: auto;
  margin-right: auto;
  padding: 1vw 0;
  border: solid 2px;
  border-radius: 1rem;
  background-color: white;
`;

const BackGround = styled.div`
  width: 96%;
  margin-left: auto;
  margin-right: auto;
  padding: 0.5vw 0.5vw 1vw;
  background-color: #fff5c3;
  border: solid 2px;
  border-radius: 0.8rem;
  padding-bottom: 5vw;
`;

const DetailZone = styled.div`
  width: 80%;
  height: 24vw;
  margin: 0 auto;
  @media screen and (max-width: 750px) {
    height: 150px;
    margin: 50px auto 0;
  }
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const NoTag = styled.div`
  width: 75%;
  height: 4vw;
  @media screen and (max-width: 750px) {
    height: 30px;
  }
  display: flex;
  align-items: center;
  padding: 1.5vw 2vw;
  margin: 2vw auto;
  border: solid 0.1vw;
  border-radius: 1vw;
  background-color: white;
  font-size: 1.2vw;
  @media screen and (max-width: 1100px) {
    font-size: 1.1vw;
  }
  @media screen and (max-width: 750px) {
    font-size: 10px;
  }
`;

const Thumbnail = styled.div`
  background-color: white;
  width: 20vw;
  height: 20vw;
  border: 0.3vw solid white;
  border-radius: 0.8vw;
  box-shadow: 3px 5px 2px rgba(0, 0, 0, 0.5);
  @media screen and (max-width: 750px) {
    width: 140px;
    height: 150px;
  }
`;

const ThumbnailImage = styled.img`
  object-fit: fill;
  border-radius: 0.8vw;
  width: 100%;
  height: 100%;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  width: 36%;
  height: 20vw;
  @media screen and (max-width: 750px) {
    position: relative;
    width: 75%;
    height: 150px;
  }
  padding-left: 2vw;
`;

const Title = styled.div`
  font-size: 1.8vw;
  @media screen and (max-width: 1100px) {
    font-size: 1.6vw;
  }
  @media screen and (max-width: 750px) {
    font-size: 12px;
  }
  font-weight: 600;
  margin-bottom: 0.2vw;
`;

const Author = styled.div`
  font-size: 1.6vw;
  @media screen and (max-width: 1100px) {
    font-size: 1.4vw;
  }
  @media screen and (max-width: 750px) {
    font-size: 11px;
  }
`;

const RatingZone = styled.div`
  display: flex;
  gap: 1vw;
`;

const RatingText = styled.div`
  margin: 1.2vw 0 0.4vw;
  font-size: 1.4vw;
  @media screen and (max-width: 1100px) {
    font-size: 1.2vw;
  }
  @media screen and (max-width: 750px) {
    font-size: 10px;
  }
`;

const RatingButton = styled.div`
  box-shadow: 2px 3px 2px rgba(0, 0, 0, 0.5);
  font-size: 0.9vw;
  @media screen and (max-width: 1100px) {
    font-size: 10px;
  }
  margin: 1.2vw 0 0.4vw;
  padding: 0.2vw 0.8vw 0.4vw;
  border: 0.2vw solid white;
  border-radius: 0.6vw;
  background-color: #d1e2ff;
  cursor: url(${hover}) 13 13, auto;
  &:hover {
    background-color: #99c0ff;
    border: 0.2vw solid #99c0ff;
  }
`;

const AlreadyRating = styled.div`
  box-shadow: 2px 3px 2px rgba(0, 0, 0, 0.5);
  font-size: 0.9vw;
  @media screen and (max-width: 1100px) {
    font-size: 10px;
  }
  margin: 1.2vw 0 0.4vw;
  padding: 0.2vw 0.8vw 0.4vw;
  border: 0.2vw solid white;
  border-radius: 0.6vw;
  background-color: #e2e8f0;
  cursor: url(${forbidden}) 13 13, auto;
`;

const ModalTitle = styled.div`
  margin-top: 3vw;
  font-size: 1.6vw;
  @media screen and (max-width: 1100px) {
    font-size: 1.4vw;
  }
  @media screen and (max-width: 750px) {
    font-size: 11px;
  }
`;

const StarZone = styled.div`
  margin: 2vw 0;
`;

const Genre = styled.div`
  margin-bottom: 0.4vw;
  font-size: 1.4vw;
  @media screen and (max-width: 1100px) {
    font-size: 1.2vw;
  }
  @media screen and (max-width: 750px) {
    font-size: 10px;
  }
`;

const Day = styled.div`
  font-size: 1.4vw;
  @media screen and (max-width: 1100px) {
    font-size: 1.2vw;
  }
  @media screen and (max-width: 750px) {
    font-size: 10px;
  }
`;

const SubInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media screen and (max-width: 750px) {
    display: none;
  }
  align-items: flex-end;
  width: 40%;
  height: 20vw;
  padding-left: 2vw;
`;

const WebToonLink = styled.div`
  display: flex;
  flex-direction: row-reverse;
  gap: 1vw;
  width: 100%;
`;

const MWebToonLink = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  @media screen and (min-width: 750px) {
    display: none;
  }
  flex-direction: row-reverse;
  gap: 1vw;
`;

const LinkButton = styled.div`
  box-shadow: 2px 3px 2px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  font-size: 1.2vw;
  @media screen and (max-width: 1100px) {
    font-size: 10px;
  }
  padding: 0.5vw 1.6vw;
  border: 0.2vw solid white;
  border-radius: 1.2vw;
  background-color: #d1e2ff;
  cursor: url(${hover}) 13 13, auto;
  &:hover {
    background-color: #99c0ff;
    border: 0.2vw solid #99c0ff;
  }
`;

const FHeart = styled.img`
  cursor: url(${hover}) 13 13, auto;
  width: 40px;
  height: 40px;
  @media screen and (max-width: 1100px) {
    width: 32px;
    height: 32px;
  }
  @media screen and (max-width: 750px) {
    width: 24px;
    height: 24px;
  }
  transition: 0.5s;
  &:hover {
    opacity: 0.5;
  }
`;

const EHeart = styled.img`
  cursor: url(${hover}) 13 13, auto;
  width: 40px;
  height: 40px;
  @media screen and (max-width: 1100px) {
    width: 32px;
    height: 32px;
  }
  @media screen and (max-width: 750px) {
    width: 24px;
    height: 24px;
  }
  transition: 0.5s;
  &:hover {
    transform: scale(1.2);
  }
`;

const Summary = styled.div`
  background-color: white;
  border: 0.1vw solid black;
  border-radius: 0.5vw;
  font-size: 1vw;
  @media screen and (max-width: 1100px) {
    font-size: 10px;
  }
  padding: 0.5vw 0.8vw 1vw 0.8vw;
  width: 90%;
  height: 70%;
  overflow: auto;
  @media screen and (max-width: 750px) {
    display: none;
  }
  &::-webkit-scrollbar {
    width: 0.8vw;
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

const MSummary = styled.div`
  background-color: white;
  border: 0.1vw solid black;
  border-radius: 1vw;
  font-size: 10px;
  margin: 10px auto 0;
  padding: 0.5vw 0.8vw 1vw 0.8vw;
  width: 78%;
  height: 50px;
  overflow: auto;
  @media screen and (min-width: 750px) {
    display: none;
  }
  &::-webkit-scrollbar {
    width: 0.8vw;
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

const GroupHeader = styled.p`
  width: 80%;
  margin: 3vw 0 0.5vw 1vw;
  font-size: 1.8vw;
  @media screen and (max-width: 1100px) {
    font-size: 1.6vw;
  }
  @media screen and (max-width: 750px) {
    font-size: 12px;
    margin-top: 20px;
    margin-bottom: 5px;
  }
`;

const TagZone = styled.div`
  width: 78%;
  display: flex;
  flex-flow: wrap;
  padding: 1.5vw 0.8vw;
  margin: 2vw auto;
  border: solid 0.1vw;
  border-radius: 1vw;
  background-color: white;
`;

const LikedTag = styled.div`
  box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.5);
  display: flex;
  cursor: url(${hover}) 13 13, auto;
  background-color: #d1e2ff;
  border: 0.15vw solid white;
  border-radius: 1vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0.5vw;
  &:hover {
    background-color: #99c0ff;
  }
`;

const Tag = styled.div`
  box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.5);
  display: flex;
  cursor: url(${hover}) 13 13, auto;
  border: 0.15vw solid white;
  border-radius: 1vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0.5vw;
  &:hover {
    background-color: #99c0ff;
  }
`;

const BookMarkImage = styled.img`
  flex: 1;
  width: 1.2vw;
  height: 2vw;
  padding-left: 1vw;
`;

const TagName = styled.div`
  flex: 1;
  margin-left: 0.8vw;
  margin-right: 0.8vw;
  margin-top: 0.2vw;
  font-size: 1.5vw;
`;

const MinusButton = styled.div`
  flex: 1;
  margin-left: 0.38vw;
  margin-right: 0.2vw;
  margin-top: -0.2vw;
  padding-right: 0.36vw;
  font-size: 2vw;
`;

const PlusButton = styled.div`
  flex: 1;
  margin-left: 0.38vw;
  margin-right: 0.2vw;
  margin-top: -0.2vw;
  font-size: 2vw;
`;

const PaintStyleRecommendZone = styled.div`
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
`;

const PSRecommends = styled.div`
  display: flex;
  background-color: white;
  border-radius: 1vw;
  border: 0.1vw solid black;
  padding: 2vw 0;
  justify-content: space-evenly;
`;

const SameAuthorRecommendZone = styled.div`
  width: 88%;
  margin: 0 auto;
  position: relative;
`;

const Box = styled.div`
  width: 91%;
  margin: 0 auto;
`;

const PrevBtn = styled.img`
  cursor: url(${hover}) 13 13, auto;
  position: absolute;
  width: 2vw;
  top: 12vw;
  left: 0;
  z-index: 1;
`;

const NextBtn = styled.img`
  cursor: url(${hover}) 13 13, auto;
  position: absolute;
  width: 2vw;
  top: 12vw;
  right: 0;
  z-index: 1;
`;

const SARecommendsBack = styled.div`
  display: flex;
  background-color: white;
  overflow: hidden;
  border-radius: 1vw;
  border: 0.1vw solid black;
  padding: 0.8vw 0 1vw;
  margin-bottom: 2vw;
  @media screen and (max-width: 750px) {
    margin-bottom: 50px;
  }
`;

const OtherWebToonEmpty = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
`;

const AgeGroupEmpty = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  @media screen and (max-width: 750px) {
    margin-top: 20px;
  }
`;

const EmptyImg = styled.img`
  width: 10vw;
  height: 10vw;
`;

const Bubble = styled.div`
  margin-left: 1vw;
  display: flex;
  align-items: center;
  position: relative;
  font-size: 1.2vw;
  @media screen and (max-width: 1100px) {
    font-size: 1vw;
  }
  @media screen and (max-width: 750px) {
    font-size: 10px;
    margin-left: 15px;
  }
  padding: 8px 30px 10px;
  background: #ffffff;
  border: 3px solid black;
  border-radius: 10px;
  :after {
    right: 100%;
    top: 50%;
    border: solid transparent;
    content: "";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(255, 255, 255, 0);
    border-right-color: #ffffff;
    border-width: 16px;
    margin-top: -16px;
  }
  :before {
    right: 100%;
    top: 50%;
    border: solid transparent;
    content: "";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(254, 236, 145, 0);
    border-right-color: black;
    border-width: 20px;
    margin-top: -20px;
  }
`;

const DrawingWebToon = styled.div`
  cursor: url(${hover}) 13 13, auto;
  width: 15vw;
  border-radius: 0.8vw;
  box-shadow: 2px 3px 2px rgba(0, 0, 0, 0.5);
`;

const OtherWebToon = styled.div`
  cursor: url(${hover}) 13 13, auto;
  width: 15vw;
  margin: 0 1vw;
  border-radius: 0.8vw;
  box-shadow: 2px 3px 2px rgba(0, 0, 0, 0.5);
`;

const ImgBox = styled.div`
  background-color: white;
  width: 100%;
  height: 15vw;
  border-top-left-radius: 0.8vw;
  border-top-right-radius: 0.8vw;
  cursor: url(${hover}) 13 13, auto;
`;

const OtherWebToonThumbnail = styled.img`
  object-fit: fill;
  width: 14vw;
  width: 100%;
  height: 100%;
  border-top-left-radius: 0.8vw;
  border-top-right-radius: 0.8vw;
`;

const ToonInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
  border-bottom-left-radius: 0.8vw;
  border-bottom-right-radius: 0.8vw;
  cursor: url(${hover}) 13 13, auto;
`;

const OtherWebToonTitle = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.3vw;
  font-weight: 600;
  margin: 0;
  padding-left: 0.5vw;
  padding-right: 0.5vw;
`;

const OtherWebToonAuthor = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1vw;
  font-weight: 500;
  margin: 0;
  padding-left: 0.5vw;
  padding-right: 0.5vw;
`;

const WebToonAnalysisZone = styled.div`
  width: 80%;
  margin: 0 auto;
`;

const AnalysisBack = styled.div`
  border: 0.1vw solid black;
  background-color: white;
  border-radius: 1vw;
`;

const Analysis = styled.div`
  padding: 1vw;
  border-radius: 1vw;
  display: flex;
  justify-content: space-evenly;
  @media screen and (max-width: 750px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }
`;

const PaintStyleAnalysis = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1vw;
  border-radius: 1vw;
`;

const AgeGroupAnalysis = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 1vw;
  padding: 1vw;
`;

const RatingGraph = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3vw;
  @media screen and (max-width: 750px) {
    margin-bottom: 10px;
  }
`;

const ChartTitle1 = styled.div`
  font-size: 1.6vw;
  @media screen and (max-width: 1100px) {
    font-size: 1.4vw;
  }
  @media screen and (max-width: 750px) {
    font-size: 11px;
  }
`;

const ChartTitle2 = styled.div`
  font-size: 1.6vw;
  @media screen and (max-width: 1100px) {
    font-size: 1.4vw;
  }
  @media screen and (max-width: 750px) {
    font-size: 11px;
  }
`;

export default DetailPage;
