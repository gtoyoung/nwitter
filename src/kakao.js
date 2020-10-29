import Axios from "axios";
import { adminInstance } from "fbase";
import cors from "cors";

const kakaoRequestMeUrl =
  "https://kapi.kakao.com/v2/user/me?secure_resource=true";

const requestMe = (kakaoAccessToken) => {
  console.log("Requesting user profile from Kakao API server.");
  return Axios.create({
    method: "GET",
    headers: { Authorization: "Bearer " + kakaoAccessToken },
    url: kakaoRequestMeUrl,
  });
};

const kakaoRequestTokenUrl = "https://kauth.kakao.com/oauth/token";

const requestAccessToken = (kakaoAuthCode) => {
  console.log("Requesting user access token from Kakao API server.");
  var bodyFormData = new FormData();
  bodyFormData.append("grant_type", "authorization_code");
  bodyFormData.append("client_id", "f050adffcbe36dec699194abfafe00b7");
  bodyFormData.append("redirect_uri", "http://localhost:3000/");
  bodyFormData.append("code", kakaoAuthCode);
  return Axios.create({
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    url: kakaoRequestTokenUrl,
    data: bodyFormData,
  });
};

const updateOrCreateUser = (userId, email, displayName, photoURL) => {
  console.log("updating or creating a firebase user");
  const updateParams = {
    provider: "KAKAO",
    displayName: displayName,
  };
  if (displayName) {
    updateParams["displayName"] = displayName;
  } else {
    updateParams["displayName"] = email;
  }
  if (photoURL) {
    updateParams["photoURL"] = photoURL;
  }
  console.log(updateParams);

  return adminInstance
    .auth()
    .updateUser(userId, updateParams)
    .catch((error) => {
      if (error.code === "auth/user-not-found") {
        updateParams["uid"] = userId;
        if (email) {
          updateParams["email"] = email;
        }

        // 신규 사용자 등록
        return adminInstance
          .auth()
          .createUser(updateParams)
          .catch((err) => {
            // 동일한 메일주소로 이미 가입되어 있는 경우에 사용자 검색하여 반환
            if (err.code === "auth/email-already-exists") {
              console.log(err);
              // console.log('auth/email-already-exists --------------- ', email);
              return adminInstance.auth().getUserByEmail(email);
            } else {
              throw err;
            }
          });
      }
      throw error;
    });
};

const createFirebaseToken = (kakaoAccessToken) => {
  requestMe()
    .get()
    .then((res) => {
      console.log("RequestMe: ", res);

      const body = JSON.parse(res);
      console.log(body);

      const userId = `kakao:${body.id}`;
      if (!userId) {
        return res
          .status(404)
          .send({ message: "There was no user with the given access token." });
      }
      let nickname = null;
      let profileImage = null;
      if (body.properties) {
        nickname = body.properties.nickname;
        profileImage = body.properties.profile_image;
      }
      let accountEmail = null;
      if (body.kakao_account) {
        accountEmail = body.kakao_account.email;
        console.log("Email", accountEmail);
      }
      return updateOrCreateUser(userId, accountEmail, nickname, profileImage);
    })
    .then((user) => {
      const userId = user.uid;
      console.log(`creating a custom firebase token based on uid ${userId}`);
      return adminInstance
        .auth()
        .createCustomToken(userId, { provider: "KAKAO" });
    })
    .catch((err) => {
      console.log("Error createFirebaseToken", err);
      throw err;
    });
};

export const KakaoAuth = (authCode) => {
  console.log(`Verifying Kakao Auth Code: ${authCode}`);
  let kakaoToken = null;
  let firebaseToken = null;
  requestAccessToken(authCode)
    .post()
    .then((res) => {
      console.log(res);
      const body = JSON.parse(res);
      console.log(body);

      kakaoToken = body.access_token;
      console.log("Kakao Access Token:", kakaoToken);
      return createFirebaseToken(kakaoToken);
    })
    .then((fireToken) => {
      firebaseToken = fireToken;
      console.log(`Returning firebase token to user: ${fireToken}`);
      //   return cors(req, res, () => {
      //     return res.status(200).json({
      //       data: {
      //         kakao_token: kakaoToken,
      //         firebase_token: fireToken,
      //       },
      //     });
      //   });
    })
    .catch((error) => {
      //   return cors(req, res, () => {
      //     if (error.error) {
      //       const body = JSON.parse(error.error);
      //       res.status(error.statusCode).json({
      //         error: {
      //           status: error.statusCode,
      //           message: body.error,
      //           details: body.error_description,
      //         },
      //       });
      //     } else {
      //       res.status(500).json({ error: "Error" });
      //     }
      //   });
    });
};
