import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "./features/toons/mainSlice";
import loginReducer from "./features/accounts/loginSlice";
import signupReducer from "./features/accounts/signupSlice";
import editReducer from "./features/accounts/editSlice";
import uploadReducer from "./features/toons/uploadSlice";
import toonBTIReducer from "./features/toons/toonBTISlice";
import toonlistReducer from "./features/toons/toonlistSlice";
import filterReducer from "./features/toons/filterSlice";
import searchReducer from "./features/toons/searchSlice";
import tuntunReducer from "./features/toons/tuntunSlice";
import navbarReducer from "./features/toons/navBarSlice";

const store = configureStore({
  reducer: {
    main: mainReducer,

    login: loginReducer,
    signup: signupReducer,
    edit: editReducer,

    upload: uploadReducer,
    toonBTI: toonBTIReducer,

    toonlist: toonlistReducer,
    filter: filterReducer,
    search: searchReducer,

    tuntun: tuntunReducer,

    navbar: navbarReducer,
  },
});

export default store;
