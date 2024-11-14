import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const MapComponent = ({ location }) => {
  const [currentLocation, setCurrentLocation] = useState(null); // 현재 위치
  const [directions, setDirections] = useState(null); // 경로 상태
  const [loading, setLoading] = useState(false); // 경로 로딩 상태
  const [routeDetails, setRouteDetails] = useState({ distance: "", duration: "" }); // 거리, 시간 정보
  const [infoWindowPosition, setInfoWindowPosition] = useState(null); // 정보창 위치 상태
  const [infoWindowVisible, setInfoWindowVisible] = useState(false); // 정보창 표시 여부
  const [destination, setDestination] = useState(null); // 목적지 좌표 (기본값 없음)

  // Google Maps API와 Geocoding 서비스 로드
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"], // Geocoding을 사용하려면 "places" 라이브러리도 추가해야 합니다.
  });

  // 사용자의 현재 위치를 가져오는 함수
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(userLocation); // 위치 업데이트
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Geocoding API를 사용하여 특정 건물 이름에 대한 좌표를 자동으로 가져오는 함수
  const getGeocode = (address) => {
    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
          const location = results[0].geometry.location;
          setDestination({
            lat: location.lat(),
            lng: location.lng(),
          });
        } else {
          alert("건물 이름을 찾을 수 없습니다.");
        }
      });
    }
  };

  // Directions API를 사용하여 대중교통 경로를 요청하는 함수
  const getDirections = (origin, destination) => {
    setLoading(true); // 경로 요청 시 로딩 상태 설정

    // DirectionsService가 로드되었는지 확인하고 사용
    if (window.google && window.google.maps) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.TRANSIT, // 대중교통 경로
        },
        (result, status) => {
          setLoading(false); // 경로 요청 후 로딩 종료
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result); // 경로가 정상적으로 반환되면 결과 저장
          } else {
            console.error("Error fetching directions:", status);
            alert("경로를 찾을 수 없습니다.");
          }
        }
      );
    } else {
      console.error("Google Maps API is not loaded yet");
    }
  };

  // 위치와 목적지가 업데이트될 때마다 경로를 자동으로 요청
  useEffect(() => {
    if (currentLocation && destination) {
      getDirections(currentLocation, destination); // 출발지와 목적지 모두 설정되었을 때 경로 요청
    }
  }, [currentLocation, destination]); // currentLocation 또는 destination이 변경될 때마다 경로 요청

  // 경로 클릭 시 거리와 시간을 추출하여 업데이트
  const handleRouteClick = (event) => {
    if (directions && directions.routes && directions.routes[0] && directions.routes[0].legs[0]) {
      const route = directions.routes[0].legs[0];
      setRouteDetails({
        distance: route.distance.text,
        duration: route.duration.text,
      });
      setInfoWindowPosition(event.latLng); // 클릭한 위치에 정보창 표시
      setInfoWindowVisible(true); // 정보창 표시
    }
  };

  // `useEffect`를 사용해 건물 이름 입력에 따른 목적지 위치를 자동으로 찾기
  useEffect(() => {
    if (isLoaded && location && destination === null) {
      getGeocode(location); // 부모에서 받은 location 값으로 좌표를 구함
    }
  }, [isLoaded, location, destination]); // location 값이 변경될 때마다 경로를 다시 찾도록

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation || { lat: 37.5665, lng: 126.978 }} // 기본 위치 서울(위도, 경도)로 설정
        zoom={14}
        onClick={handleRouteClick} // 경로 클릭 시 호출되는 이벤트 핸들러
        language="ko" // 구글 맵 UI 언어를 한글로 설정
      >
        {/* 사용자 위치 마커 */}
        {currentLocation && <Marker position={currentLocation} label="내 위치" />}

        {/* 목적지 마커 (동적으로 설정된 목적지) */}
        {destination && <Marker position={destination} label="목적지" />}

        {/* 경로 렌더링 */}
        {directions && !loading && (
          <DirectionsRenderer
            directions={directions}
            options={{
              preserveViewport: true,
              suppressMarkers: true, // 기본 마커는 숨김
            }}
          />
        )}

        {/* 경로 로딩 중이면 로딩 메시지 */}
        {loading && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              background: "rgba(255, 255, 255, 0.7)",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            경로를 찾는 중...
          </div>
        )}

        {/* InfoWindow로 거리와 시간 표시 */}
        {infoWindowVisible && (
          <InfoWindow
            position={infoWindowPosition}
            onCloseClick={() => setInfoWindowVisible(false)}
          >
            <div>
              <h4>경로 정보</h4>
              <p><strong>거리:</strong> {routeDetails.distance}</p>
              <p><strong>소요 시간:</strong> {routeDetails.duration}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  ) : (
    <div>Loading...</div>
  );
};

export default MapComponent;
