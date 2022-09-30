import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  checkEmail,
  checkNickname,
  changeEmail,
  changeNickname,
  changePassword,
  changePwdVerify,
  changeGender,
  changeBirth,
  changeIsPossibleEmail,
} from "../../features/accounts/signupSlice";
import { changePossibleSearch } from "../../features/toons/searchSlice";

function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signupInfo = useSelector((state) => state.signup.signupInfo);

  useEffect(() => {
    dispatch(changePossibleSearch(false));
    return () => {
      dispatch(changePossibleSearch(true));
    };
  }, [dispatch]);

  const [isCheckNickname, setIsCheckNickname] = useState(false);
  const [isCheckEmail, setIsCheckEmail] = useState(false);
  const [isRightEmail, setIsRightEmail] = useState(false);
  const [passwordError, setPasswordError] = useState("비밀번호를 입력해주세요");

  function chkPW(pw) {
    var num = pw.search(/[0-9]/g);
    var eng = pw.search(/[a-z]/gi);
    var spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    if (pw.length < 8 || pw.length > 20) {
      setPasswordError("8자리 ~ 20자리 이내로 입력해주세요.");
      return false;
    } else if (pw.search(/\s/) !== -1) {
      setPasswordError("비밀번호는 공백 없이 입력해주세요.");
      return false;
    } else if (num < 0 || eng < 0 || spe < 0) {
      setPasswordError("영문,숫자, 특수문자를 혼합하여 입력해주세요.");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  }
  function chkEmail(str) {
    const reg_email =
      /^([0-9a-zA-Z_-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

    if (!reg_email.test(str)) {
      return false;
    } else {
      return true;
    }
  }

  const isPossibleNickname = useSelector(
    (state) => state.signup.isPossibleNickname
  );
  const isPossibleEmail = useSelector((state) => state.signup.isPossibleEmail);

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      onCheckNicknameHandler(e);
    }
  };

  function onNicknameHandler(e) {
    e.preventDefault();
    dispatch(changeNickname(e.target.value));
  }
  function onEmailHandler(e) {
    e.preventDefault();
    dispatch(changeEmail(e.target.value));
  }

  function onPasswordHandler(e) {
    e.preventDefault();
    chkPW(e.target.value);
    dispatch(changePassword(e.target.value));
  }

  function onPwdVerifyHandler(e) {
    e.preventDefault();
    dispatch(changePwdVerify(e.target.value));
  }

  function onGenderHandler(e) {
    dispatch(changeGender(e.target.value));
  }
  function onBirthHandler(e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    dispatch(changeBirth(e.target.value));
  }

  function onCheckEmailHandler(e) {
    e.preventDefault();
    const data = {
      email: signupInfo.email,
    };
    if (chkEmail(data.email)) {
      dispatch(checkEmail(data)).then(() => {
        setIsCheckEmail(true);
        setIsRightEmail(true);
      });
    } else {
      dispatch(changeIsPossibleEmail(false));
      setIsCheckEmail(true);
      setIsRightEmail(false);
    }
  }

  function onCheckNicknameHandler(e) {
    e.preventDefault();
    const data = {
      nickname: signupInfo.nickname,
    };
    dispatch(checkNickname(data)).then(() => {
      setIsCheckNickname(true);
    });
  }

  function signupSubmit(e) {
    e.preventDefault();
    if (
      signupInfo.gender &&
      signupInfo.birth.length >= 8 &&
      isPossibleEmail &&
      isPossibleNickname &&
      !passwordError &&
      signupInfo.password === signupInfo.pwdVerify
    ) {
      navigate("/addinfo");
    }
  }
  return (
    <PageBox>
      <SignupBox>
        <PageTitle>회원가입</PageTitle>
        <FormGroup>
          <FormItem>
            <FormTitle>이메일</FormTitle>
            <SignupInput
              type="email"
              value={signupInfo.email}
              autoComplete="on"
              placeholder="이메일을 입력해주세요."
              onChange={onEmailHandler}
              error={isCheckEmail && !isPossibleEmail}
              onkeyup={onCheckEmailHandler}
            />

            <CheckBtn onClick={onCheckEmailHandler}>중복확인</CheckBtn>
          </FormItem>
          <ConfirmMsg error={isCheckEmail && !isPossibleEmail}>
            {isCheckEmail
              ? isPossibleEmail
                ? "사용 가능한 이메일입니다."
                : isRightEmail
                ? "사용 불가능한 이메일입니다."
                : "이메일 형식이 올바르지 않습니다."
              : null}
          </ConfirmMsg>
          <FormItem>
            <FormTitle>닉네임</FormTitle>
            <SignupInput
              type="text"
              value={signupInfo.nickname}
              autoComplete="on"
              placeholder="닉네임을 입력해주세요."
              onChange={onNicknameHandler}
              error={isCheckNickname && !isPossibleNickname}
              onKeyPress={handleOnKeyPress}
            />
            <CheckBtn onClick={onCheckNicknameHandler}>중복확인</CheckBtn>
          </FormItem>
          <ConfirmMsg error={isCheckNickname && !isPossibleNickname}>
            {isCheckNickname
              ? isPossibleNickname
                ? "사용 가능한 닉네임입니다."
                : "사용 불가능한 닉네임입니다."
              : null}
          </ConfirmMsg>
          <FormItem>
            <FormTitle>비밀번호</FormTitle>
            <SignupInput
              type="password"
              value={signupInfo.password}
              autoComplete="off"
              placeholder="비밀번호를 입력해주세요."
              onChange={onPasswordHandler}
              error={signupInfo.password !== signupInfo.pwdVerify}
            />
          </FormItem>
          <ConfirmMsg error={true}>{passwordError}</ConfirmMsg>
          <FormItem>
            <FormTitle>비밀번호 확인</FormTitle>
            <SignupInput
              type="password"
              value={signupInfo.pwdVerify}
              autoComplete="off"
              placeholder="비밀번호를 입력해주세요."
              onChange={onPwdVerifyHandler}
            />
          </FormItem>
          <ConfirmMsg error={true}>
            {signupInfo.password !== signupInfo.pwdVerify &&
              "비밀번호가 일치하지 않습니다."}
          </ConfirmMsg>
          <SelectBox>
            <GenderBox onChange={onGenderHandler}>
              <GenderTitle>성별</GenderTitle>
              <GenderInput id="female" type="radio" value="F" name="gender" />
              <FemaleLabel active={signupInfo.gender === "F"} htmlFor="female">
                여
              </FemaleLabel>
              <GenderInput id="male" type="radio" value="M" name="gender" />
              <MaleLabel active={signupInfo.gender === "M"} htmlFor="male">
                남
              </MaleLabel>
            </GenderBox>
            <BirthBox>
              <BirthTitle>생년월일</BirthTitle>
              <BirthInput
                type="text"
                maxLength="8"
                onKeyUp={onBirthHandler}
                placeholder="ex) 20220921"
              />
            </BirthBox>
          </SelectBox>
          <BtnBox>
            <SubmitBtn
              active={
                signupInfo.gender &&
                signupInfo.birth.length >= 8 &&
                isPossibleEmail &&
                isPossibleNickname &&
                !passwordError &&
                signupInfo.password === signupInfo.pwdVerify
              }
              onClick={signupSubmit}
            >
              다음
            </SubmitBtn>
          </BtnBox>
        </FormGroup>
      </SignupBox>
    </PageBox>
  );
}

const PageBox = styled.div`
  display: flex;
  height: 80vh;
  justify-content: center;
  @media screen and (max-width: 800px) {
    width: 100%;
    height: 100%;
    gap: 20px;
  }
  p {
    font-weight: bold;
  }
`;

const PageTitle = styled.p`
  font-size: 4vh;
`;

const SignupBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  background-color: white;
  border: 3px solid black;
  border-radius: 10px;
  height: 80vh;
  overflow: hidden;
  @media screen and (max-width: 800px) {
    width: 95%;
  }
`;

const FormGroup = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  @media screen and (max-width: 800px) {
    width: 90%;
  }
`;

const FormItem = styled.div`
  display: flex;
  align-items: center;
  margin-left: 40vw;
  width: 100%;
  justify-content: start;
  @media screen and (max-width: 900px) {
    margin-left: 25vw;
    align-items: center;
  }
  @media screen and (max-width: 800px) {
    margin-left: 15vw;
    align-items: center;
  }
`;

const FormTitle = styled.p`
  width: 10vw;
  font-size: 2vh;
  @media screen and (max-width: 1000px) {
    width: 15vw;
    font-size: 1.8vh;
  }
  @media screen and (max-width: 800px) {
    width: 15vw;
    font-size: 1.5vh;
  }
`;

const GenderBox = styled.div`
  display: flex;
`;

const GenderTitle = styled.p`
  width: 5vw;
  font-size: 2vh;
  @media screen and (max-width: 800px) {
    width: 5vh;
    font-size: 1.5vh;
  }
`;

const BirthBox = styled.div`
  display: flex;
`;

const BirthTitle = styled.p`
  width: 8vw;
  font-size: 2vh;
  @media screen and (max-width: 800px) {
    width: 10vw;
    font-size: 1.5vh;
  }
`;

const CheckBtn = styled.button`
  border: none;
  /* width: 50%; */
  font-weight: bold;
  background-color: white;
  :hover {
    font-size: 90%;
    cursor: pointer;
  }
`;

const SignupInput = styled.input`
  width: 50vh;
  height: 4vh;
  border: ${(props) =>
    props.error ? "2px solid #EEA6A6" : "2px solid #D1E2FF"};
  border-radius: 10px;
  text-align: center;
  @media screen and (max-width: 800px) {
    width: 40%;
  }
`;

const BirthInput = styled.input`
  width: 30vh;
  height: 4vh;
  border: ${(props) =>
    props.error ? "2px solid #EEA6A6" : "2px solid #D1E2FF"};
  border-radius: 10px;
  text-align: center;
  @media screen and (max-width: 800px) {
    width: 40%;
  }
`;

const ConfirmMsg = styled.p`
  margin-left: -5vw;
  font-size: 1.8vh;
  color: ${(props) => (props.error ? "#EEA6A6" : " #48618d")};
`;

const SelectBox = styled.div`
  display: flex;
  margin-left: 40vw;
  width: 100%;
  align-items: center;
  justify-content: start;

  @media screen and (max-width: 800px) {
    margin-left: 15vw;
    align-items: center;
  }
`;
const GenderInput = styled.input`
  display: none;
`;

const MaleLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 30px;
  padding: 5px;
  width: 40px;
  height: 30px;
  border: 1px solid #d1e2ff;
  border-radius: 5px;
  background-color: ${(props) => props.active && " #d1e2ff"};
  :hover {
    cursor: pointer;
  }
  @media screen and (max-width: 800px) {
    margin: 0px 15px;
  }
`;

const FemaleLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  margin-left: 20%;
  width: 40px;
  height: 30px;
  border: 1px solid #d1e2ff;
  border-radius: 5px;
  background-color: ${(props) => props.active && " #d1e2ff"};
  @media screen and (max-width: 800px) {
    margin-left: 5%;
  }
  :hover {
    cursor: pointer;
  }
`;

const BtnBox = styled.div`
  display: flex;
  justify-content: end;
`;

const SubmitBtn = styled.button`
  position: absolute;
  bottom: 12%;
  right: 10%;
  font-size: 20px;
  font-weight: bold;
  background-color: ${(props) => (props.active ? "#feec91" : "AFAFAF")};
  padding: 10px 20px;
  border-radius: 15px;
  border: 3px solid white;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  width: "50px";
  height: "30px";
  :hover {
    cursor: ${(props) => props.active && "pointer"};
  }
`;

export default SignupPage;
