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
import { v4 as uuidv4 } from "uuid";
import { KakaoAuth } from "kakao";
const Auth = () => {
  const onSocialClick = async (event) => {
    let provider;
    const {
      target: { name },
    } = event;
    if (name === "kakao") {
      window.Kakao.Auth.login({
        success: function (authObj) {
          var result = JSON.stringify(authObj);
          KakaoAuth(JSON.parse(result).access_token);
        },
        fail: function (err) {
          console.log(JSON.stringify(err));
        },
      });
    } else {
      if (name === "google") {
        provider = new firebaseInstance.auth.GoogleAuthProvider();
      } else if (name === "github") {
        provider = new firebaseInstance.auth.GithubAuthProvider();
      }
      const data = await authService.signInWithPopup(provider);
    }
  };

  const loginKakao = (kakaoAccessToken) => {
    window.Kakao.API.request({
      url: "/v2/user/me",
      success: function (response) {
        var profile = response.kakao_account.profile; // nickname, thumbnail_image_url,profile_image_url 이있음
        var uuid = uuidv4();
        var email = response.kakao_account.email;
        var customClaims = {
          provider: "KAKAO",
          email: email,
          displayName: profile.nickname,
        };
        adminInstance
          .auth()
          .createCustomToken(uuid, customClaims)
          .then((token) => {
            firebaseInstance
              .auth()
              .signInWithCustomToken(token)
              .catch((err) => {
                alert(err.message);
              });
          });
      },
      fail: function (error) {
        alert(error);
      },
    });
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
        <button onClick={onSocialClick} name="kakao" className="authBtn">
          Continue with Kakao <FontAwesomeIcon icon={faApple} />
        </button>
      </div>
    </div>
  );
};
export default Auth;
