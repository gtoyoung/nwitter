import MapContent from "components/MapContent";
import Nweet from "components/Nweet";
import { authService, dbService } from "fbase";
import { kakaoSignOut, getKakaoFriends, setFirendsAuth, setAuth } from "kakao";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [myNweets, setMyNweets] = useState([]);

  const onLogOutClick = () => {
    if (userObj.uid.includes("kakao")) {
      kakaoSignOut();
    }
    authService.signOut();
    history.push("/");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  return (
    <>
      <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
          <input
            type="text"
            placeholder="Display name"
            value={newDisplayName}
            autoFocus
            onChange={onChange}
            className="formInput"
          />
          <input
            type="submit"
            value="Update Profile"
            className="formBtn"
            style={{
              marginTop: 10,
            }}
          />
        </form>
        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
          Log Out
        </span>
        <a id="kakao-btn">test</a>
        <div style={{ marginTop: 30 }}>
          {myNweets.map((nweet) => (
            <>
              <Nweet
                key={nweet.id}
                nweetObj={nweet}
                isOwner={nweet.creatorId === userObj.uid}
              />
            </>
          ))}
        </div>
      </div>
    </>
  );
};
