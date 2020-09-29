/*global kakao*/
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const MapContent = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=ca2f52994d83ed526c7625b0dbffd4cf&autoload=false";
    document.head.appendChild(script);

    navigator.geolocation.getCurrentPosition((pos) => {
      script.onload = () => {
        kakao.maps.load(() => {
          let container = document.getElementById("Mymap");
          let options = {
            center: new kakao.maps.LatLng(
              pos.coords.latitude,
              pos.coords.longitude
            ), //지도의 중심좌표.
            level: 4, //지도의 레벨(확대, 축소 정도)
          };

          const map = new kakao.maps.Map(container, options);
        });
      };
    });
  }, []);

  return <div id="Mymap" style={{ width: "400px", height: "300px" }}></div>;
};

export default MapContent;
