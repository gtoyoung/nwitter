import { adminInstance, firebaseInstance } from "fbase";

export const kakaoLogin = () => {
  window.Kakao.Auth.login({
    success: function (authObj) {
      getMyKakaoInfo(authObj);
    },
    fail: function (err) {
      console.log(JSON.stringify(err));
    },
  });
};

const getMyKakaoInfo = (authObj) => {
  const result = JSON.stringify(authObj);
  const auth_code = JSON.parse(result);
  //카카오 토큰 셋팅
  window.Kakao.Auth.setAccessToken(auth_code.access_token);
  window.Kakao.API.request({
    url: "/v2/user/me",
    success: function (response) {
      const body = response;
      const userId = `kakao_${body.id}`;
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
      updateOrCreateUser(userId, accountEmail, nickname, profileImage);
    },
    fail: function (error) {
      alert(error);
    },
  });
};

const updateOrCreateUser = (userId, email, displayName, photoURL) => {
  console.log("updating or creating a firebase user");
  adminInstance
    .auth()
    .createCustomToken(userId, { provider: "KAKAO" })
    .then((token) => {
      firebaseInstance
        .auth()
        .signInWithCustomToken(token)
        .then((result) => {
          var user = firebaseInstance.auth().currentUser;
          user.updateEmail(email);
          user.updateProfile({
            displayName: displayName,
            photoURL: photoURL,
          });
        })
        .catch((err) => {
          console.log("이미 가입된 아이임");
        });
    })
    .catch((err) => {
      console.log("이미 가입된 아이임");
    });
};

export const kakaoSignOut = () => {
  window.Kakao.Auth.logout();
};

// export const getKakaoFriends = (token) => {
//   window.Kakao.API.request({
//     url: "/v1/api/talk/friends",
//     success: function (response) {
//       console.log(response);
//     },
//   });
// };

// export const setAuth = () => {
//   window.Kakao.Auth.authorize({
//     redirectUri: "http://localhost:3000/friends",
//     scope: "friends",
//   });
// };
