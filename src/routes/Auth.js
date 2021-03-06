import AuthForm from "components/AuthForm";
import { adminInstance, authService, firebaseInstance } from "fbase";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
  faApple,
} from "@fortawesome/free-brands-svg-icons";
import "cors";
import { kakaoLogin } from "kakao";
const Auth = () => {
  const onSocialClick = async (event) => {
    let provider;
    const {
      target: { name },
    } = event;
    if (name === "kakao") {
      kakaoLogin();
    } else {
      if (name === "google") {
        provider = new firebaseInstance.auth.GoogleAuthProvider();
      } else if (name === "github") {
        provider = new firebaseInstance.auth.GithubAuthProvider();
      }
      const data = await authService.signInWithPopup(provider);
    }
  };

  return (
    <div className="authContainer">
      <img
        src={require("../home.jpg")}
        style={{ width: 100, height: 100, borderRadius: 100 / 2 }}
      />
      <br />
      <span>Dovb`s Witter</span>
      <br />
      <AuthForm />
      <div className="authBtns">
        <button onClick={onSocialClick} name="google" className="authBtn">
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={onSocialClick} name="github" className="authBtn">
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
        {/* <button onClick={onSocialClick} name="kakao" className="authBtn">
          Continue with Kakao <FontAwesomeIcon icon={faApple} />
        </button> */}
      </div>
    </div>
  );
};
export default Auth;
