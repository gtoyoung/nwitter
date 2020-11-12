import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService, firebaseInstance } from "../fbase";
// Initialize Firebase
// TODO: Replace with your project's customized code snippet

function App() {
  const messaging = firebaseInstance.messaging();
  Notification.requestPermission()
    .then(function () {
      console.log("Notification permission granted.");
      messaging
        .getToken(
          "BFNE9KXt9XVGqtOgRKfpYcyocrZhXOUj_MmygziyOngfbUqkkWAoNVaue1SU6fIiHKpdQuq_j0u85PhVhcqlDjM"
        )
        .then((token) => {
          console.log(token);
        });
    })
    .catch(function (err) {
      console.log("Unable to get permission to notify.", err);
    });

  let enableForegroundNotification = true;
  messaging.onMessage(function (payload) {
    console.log("Message received. ", payload);

    if (enableForegroundNotification) {
      const { title, ...options } = JSON.parse(payload.data.notification);
      navigator.serviceWorker.getRegistrations().then((registration) => {
        registration[0].showNotification(title, options);
      });
    }
  });

  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        var displayName = "";
        if (user.displayName === null) displayName = user.email;
        else displayName = user.displayName;
        setUserObj({
          displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "initialzing...."
      )}
    </>
  );
}

export default App;
