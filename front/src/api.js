const BASE_URL = 'https://j7a403.p.ssafy.io:8443/api/'
// const BASE_URL = 'http://localhost:8000/api/'

const ACCOUNTS_URL = "accounts/";
const WEBTOONS_URL = "webtoons/";

const USER_URL = "user/";

const LOGIN_URL = "login/";
const LOGOUT_URL = "logout/";
const INFO_URL = "info/";
const SIGNUP_URL = "signup/";
const EMAIL_URL = "email/";
const NICKNAME_URL = "nickname/";
const PASSWORD_URL = "check/";
const EDIT_URL = "update/";
const PROFILE_URL = "profile/";
const IMAGE_URL = "image/";

const SEARCH_IMG_URL = "search/image/";

const TOON_LIST_URL = "list/";
const FILTER_URL = "filter/";
const TAG_URL = "tag/";

const TOONBTI_URL = "games/question/";
const DETAIL_URL = "detail/";
const LIKE_URL = "like/";
const LOG_URL = "log/";
const RATING_URL = "rating/";

const SEARCH_URL = "search/";
const GET_URL = "get/";

const RECOMMEND_URL = "recommend/";

const api = {
  //main
  main: () => BASE_URL + WEBTOONS_URL,

  //loginSlice
  login: () => BASE_URL + ACCOUNTS_URL + USER_URL + LOGIN_URL,
  logout: () => BASE_URL + ACCOUNTS_URL + USER_URL + LOGOUT_URL,
  fetchInfo: () => BASE_URL + ACCOUNTS_URL + USER_URL + INFO_URL,

  // signupSlice
  signup: () => BASE_URL + ACCOUNTS_URL + USER_URL + SIGNUP_URL,
  checkEmail: () => BASE_URL + ACCOUNTS_URL + USER_URL + EMAIL_URL,
  checkNickname: () => BASE_URL + ACCOUNTS_URL + USER_URL + NICKNAME_URL,

  // editSlice
  checkPassword: () => BASE_URL + ACCOUNTS_URL + USER_URL + PASSWORD_URL,
  edit: () => BASE_URL + ACCOUNTS_URL + USER_URL + EDIT_URL,

  //profileSlice
  profile: () => BASE_URL + ACCOUNTS_URL + USER_URL + PROFILE_URL,
  profileImage: () => BASE_URL + ACCOUNTS_URL + USER_URL + IMAGE_URL,

  //uploadSlice
  fetchUpload: () => BASE_URL + WEBTOONS_URL + SEARCH_IMG_URL,

  //toonlistSlice
  fetchToonlist: (pageNum) =>
    BASE_URL + WEBTOONS_URL + TOON_LIST_URL + pageNum + "/",

  //filterSlice
  filterToons: (pageNum) =>
    BASE_URL + WEBTOONS_URL + FILTER_URL + pageNum + "/",

  //toonBTISlice
  fetchToonBTI: () => BASE_URL + TOONBTI_URL,

  //detailSlice
  detail: (webtoonId) => BASE_URL + WEBTOONS_URL + webtoonId + "/" + DETAIL_URL,
  webtoonLike: (webtoonId) =>
    BASE_URL + WEBTOONS_URL + webtoonId + "/" + LIKE_URL,
  webtoonLog: (webtoonId) =>
    BASE_URL + WEBTOONS_URL + webtoonId + "/" + LOG_URL,
  webtoonRating: (webtoonId) =>
    BASE_URL + WEBTOONS_URL + webtoonId + "/" + RATING_URL,
  tagLike: (tagId) =>
    BASE_URL + WEBTOONS_URL + TAG_URL + tagId + "/" + LIKE_URL,

  //searchSlice
  searchToons: (pageNum) =>
    BASE_URL + WEBTOONS_URL + SEARCH_URL + pageNum + "/",
  getTags: () => BASE_URL + WEBTOONS_URL + TAG_URL + GET_URL,

  // tuntun
  fetchtuntun: () => BASE_URL + WEBTOONS_URL + RECOMMEND_URL,
};

export default api;
