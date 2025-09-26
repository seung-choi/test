"use client";

import styles from "@/styles/pages/holecup/holecup.module.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getClub, postMapPin } from "@/api/main";
import ClubType from "@/types/Club.type";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { currentCourseState, currentHoleState, holecupMenuPopupState } from "@/lib/recoil";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import HolecupMenuPopup from "@/components/HolcupMenuPopup";
import { useRouter } from "next/navigation";

export interface MapPinAPI {
  holeId: number | null;
  mapMode: string;
  mapCd: string;
  mapX: string;
  mapY: string;
  mapZ: string;
}

const HoleCup = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const pinColors = ["#FB3B3B", "#FBD23C", "#71BE34", "#42444E", "#2F65CA", "#F0F0F0"];
  const [selectedPinColor, setSelectedPinColor] = useState<string>("");
  const [pinColor, setPinColor] = useState<string>("");
  const [selectedGreenCd, setSelectedGreenCd] = useState<string | null>(null);
  const [pointerGreenPos, setPointerGreenPos] = useState<{ x: number; y: number } | null>(null);
  const [pointerOriginGreenPos, setPointerOriginGreenPos] = useState<{
    x: number;
    y: number;
  }>();
  const [pointerOriginHolePinPos, setPointerOriginHolePinPos] = useState<{
    x: number;
    y: number;
  } | null>();
  const [finalGreenImgSize, setFinalGreenImgSize] = useState<{
    width: number;
    height: number;
  } | null>();
  const [finalGreenMap, setFinalGreeneMap] = useState<{ x: number; y: number } | null>();
  const [mapModeState, setMapModeState] = useState<string>("");
  const [holecupPinMove, setHolecupPinMove] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    state: boolean;
    mms: string;
  }>({
    state: false,
    mms: "",
  });
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const mapRef = useRef<HTMLImageElement | null>(null);

  const currentCourse = useRecoilValue(currentCourseState);
  const [currentHole, setCurrentHoleState] = useRecoilState(currentHoleState);
  const setHolecupMenuPopupOpen = useSetRecoilState(holecupMenuPopupState);

  const router = useRouter();

  const { data: clubData } = useQuery<ClubType>({
    queryKey: ["clubData"],
    queryFn: getClub,
  });

  const { mutate: postMapMutate } = useMutation({
    mutationFn: postMapPin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubData"] });
      setToast({
        state: true,
        mms: t("holecup.pinSuccess"),
      });
      setTimeout(() => {
        setToast({
          state: false,
          mms: "",
        });
      }, 3000);
    },
    onError: () => {
      setToast({
        state: true,
        mms: t("holecup.pinError"),
      });
    },
  });

  const getCorrectedClickCoords = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return { x: 0, y: 0 };

    const rect = mapRef.current.getBoundingClientRect();

    // iOS Safari 등에서 rotate(90deg)인 상태의 client 좌표 보정
    if (window.matchMedia("(orientation: portrait)").matches) {
      const rotatedX = e.clientY - rect.top;
      const rotatedY = rect.right - e.clientX;
      return { x: rotatedX, y: rotatedY };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // 원본 홀맵에서의 홀컵핀 좌표 계산 함수
  const calculateHolePinPosition = (
    greenPinPos: { x: number; y: number }, // finalGreenImgSize에서 클릭한 좌표
    initialOriginPos: { x: number; y: number }, // 원본 홀맵에서 원본 그린 이미지의 0,0 좌표
    originGreenImgSize: number, // 원본 그린 이미지 사이즈
    rectGreenImgSize: number, // scale된 원본 그린 이미지 사이즈
    finalGreenImgSize: { width: number; height: number }, // 최종 채워진 이미지 사이즈
    rotateDEG: number, // 회전 각도 (도 단위)
  ) => {
    // JavaScript _maps.synchronize 로직 참고
    const [centerX, centerY] = [
      Number(initialOriginPos.x) + originGreenImgSize / 2,
      Number(initialOriginPos.y) + originGreenImgSize / 2,
    ];

    const [offsetX, offsetY] = [
      centerX - finalGreenImgSize.width / 2,
      centerY - finalGreenImgSize.height / 2,
    ];

    const scale = originGreenImgSize / rectGreenImgSize;
    const rotate = -rotateDEG; // 역회전

    const [moveX, moveY, scaleX, scaleY] = [
      (finalGreenImgSize.width - finalGreenImgSize.width * scale) / 2,
      (finalGreenImgSize.height - finalGreenImgSize.height * scale) / 2,
      (finalGreenImgSize.width * scale) / finalGreenImgSize.width,
      (finalGreenImgSize.height * scale) / finalGreenImgSize.height,
    ];

    let [rotatedX, rotatedY] = [greenPinPos.x, greenPinPos.y];

    // 회전 변환 적용
    if (rotate !== 0) {
      const radians = (Math.PI / 180) * rotate;
      const centerX = finalGreenImgSize.width / 2;
      const centerY = finalGreenImgSize.height / 2;

      rotatedX =
        centerX +
        (greenPinPos.x - centerX) * Math.cos(radians) -
        (greenPinPos.y - centerY) * Math.sin(radians);
      rotatedY =
        centerY +
        (greenPinPos.x - centerX) * Math.sin(radians) +
        (greenPinPos.y - centerY) * Math.cos(radians);
    }

    // 최종 좌표 계산
    const [x, y] = [offsetX + rotatedX * scaleX + moveX, offsetY + rotatedY * scaleY + moveY];

    return { x, y };
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      typeof window === "undefined" ||
      !mapRef.current ||
      !finalGreenImgSize ||
      !finalGreenMap ||
      selectedPinColor === ""
    )
      return;
    setHolecupPinMove(true);
    // 랜더링된 Green 이미지상의 pin 좌표
    const { x: clickX, y: clickY } = getCorrectedClickCoords(e);
    setPointerGreenPos({ x: clickX, y: clickY });

    // 가공된 Green 이미지상의 pin 좌표
    const { width, height } = mapRef.current.getBoundingClientRect();
    const scaleX = finalGreenImgSize.width / width;
    const scaleY = finalGreenImgSize.height / height;

    const greenPinPos = { x: clickX * scaleX, y: clickY * scaleY };

    const greenInfo = currentHoleData?.mapList.find(
      (map) =>
        map.mapMode === mapModeState && map.mapCd === selectedGreenCd && map.mapType === "IMG",
    );

    // 원본 홀맵에서 원본 Green 이미지의 0,0 좌표
    const initialOriginPos = greenInfo?.mapY?.split("x").map(Number) || [0, 0];
    const originGreenImgSize = Number(greenInfo?.mapZ?.split("x")[0]) || 180; // 원본 Green 이미지 사이즈
    const rectGreenImgSize = Number(greenInfo?.mapZ?.split("x")[1]) || 270; // scale된 원본 Green이미지 사이즈
    const rotateDEG = Number(greenInfo?.mapZ?.split("x")[2]) || 0; // 회전 각도

    // 최종 holePinPos 계산
    const holePinPos = calculateHolePinPosition(
      greenPinPos, // finalGreenImgSize에서 클릭한 좌표
      { x: initialOriginPos[0], y: initialOriginPos[1] }, // 원본 홀맵에서 원본 Green 이미지의 0,0 좌표
      originGreenImgSize, // 원본 Green 이미지 사이즈
      rectGreenImgSize, // scale된 원본 Green이미지 사이즈
      finalGreenImgSize, // 최종 채워진 이미지 사이즈
      rotateDEG, // 회전 각도
    );

    setPointerOriginGreenPos(greenPinPos);
    setPointerOriginHolePinPos(holePinPos);
    setPinColor(selectedPinColor);
  };

  const currentCourseData = useMemo(() => {
    return clubData?.courseList.find((course) => course.courseId === currentCourse.id);
  }, [clubData, currentCourse]);

  const currentHoleData = useMemo(() => {
    if (!currentCourseData || !currentHole.id) return undefined;
    return currentCourseData.holeList.find((hole) => hole.holeId === currentHole.id);
  }, [currentCourseData, currentHole]);

  const currentGreenImageList = useMemo(() => {
    if (!currentHoleData?.mapList || !clubData?.clubMode) return [];
    return currentHoleData.mapList.filter(
      (map) =>
        map.mapMode === mapModeState && map.mapCd.startsWith("GREEN_") && map.mapType === "IMG",
    );
  }, [currentHoleData, selectedGreenCd, mapModeState]);

  const pinGreenList = useMemo(() => {
    if (!currentHoleData?.mapList || !clubData?.clubMode) return [];
    return currentHoleData.mapList.filter(
      (map) =>
        map.mapMode === mapModeState && map.mapCd.startsWith("PIN_GREEN_") && map.mapType === "DOM",
    );
  }, [currentHoleData, selectedGreenCd, mapModeState]);

  const currentGreensImage = useMemo(() => {
    if (!currentHoleData?.mapList || !clubData?.clubMode) return null;
    return currentHoleData.mapList.find(
      (map) => map.mapMode === mapModeState && map.mapCd === "GREENS" && map.mapType === "IMG",
    );
  }, [currentHoleData, clubData, selectedGreenCd, mapModeState]);

  const selectedGreenImageUrl = useMemo(() => {
    return currentGreenImageList.find((img) => img.mapCd === selectedGreenCd)?.mapUrl || "";
  }, [currentGreenImageList, selectedGreenCd]);

  useEffect(() => {
    if (!clubData) return;

    if (currentCourseData?.holeList.length === 0 || currentHole?.id) return;

    const defaultHole = currentCourseData?.holeList.find((hole) => hole.holeNo === 1);
    if (defaultHole) {
      setCurrentHoleState({ id: defaultHole.holeId, no: 1 });
    }
  }, [clubData, currentCourse]);

  useEffect(() => {
    if (currentGreenImageList.length > 0 && !selectedGreenCd) {
      setSelectedGreenCd(currentGreenImageList[0].mapCd);
    }
  }, [currentGreenImageList, selectedGreenCd]);

  useEffect(() => {
    setImageLoaded(false);
  }, [selectedGreenImageUrl]);

  useEffect(() => {
    if (clubData && mapModeState === "") {
      const targetCourse = clubData.courseList.find(
        (course) => course.courseId === currentCourse.id,
      );

      const hasLandscapeGreenImage = targetCourse?.holeList?.[0]?.mapList?.some(
        (map) =>
          map.mapMode === "LANDSCAPE" &&
          map.mapType === "IMG" &&
          map.mapCd.startsWith("GREEN_") &&
          !!map.mapUrl,
      );

      if (hasLandscapeGreenImage) {
        setMapModeState("LANDSCAPE");
      } else {
        setMapModeState("PORTRAIT");
      }
    }
  }, [clubData, mapModeState]);

  useEffect(() => {
    if (pinGreenList.length === 0) {
      setPointerGreenPos(null);
    }
    if (
      selectedGreenCd &&
      pinGreenList.length > 0 &&
      currentGreenImageList.length > 0 &&
      imageLoaded
    ) {
      const suffix = selectedGreenCd.replace("GREEN_", "");
      const greenImageData = currentGreenImageList.find((img) => img.mapCd.endsWith(suffix));

      let finalSize = null;
      let finalMap = null;

      if (greenImageData?.mapX) {
        // scale된 사이즈에서 finalSize만큼 채워넣음
        const [w, h] = greenImageData.mapX.split("x").map(Number);
        finalSize = { width: w, height: h };
        setFinalGreenImgSize(finalSize);
      }

      if (greenImageData?.mapY) {
        const [x, y] = greenImageData.mapY.split("x").map(Number);
        finalMap = { x, y };
        setFinalGreeneMap(finalMap);
      }

      const matchedPin = pinGreenList.find((pin) => pin.mapCd === `PIN_GREEN_${suffix}`);

      if (!matchedPin) {
        setPointerGreenPos(null);
      } else if (
        matchedPin?.mapX != null &&
        matchedPin?.mapY != null &&
        finalSize &&
        mapRef.current
      ) {
        const { width: renderedWidth, height: renderedHeight } =
          mapRef.current.getBoundingClientRect();
        const scaleX = renderedWidth / finalSize.width;
        const scaleY = renderedHeight / finalSize.height;

        setPointerGreenPos({
          x: Number(matchedPin.mapX) * scaleX,
          y: Number(matchedPin.mapY) * scaleY,
        });
        setSelectedPinColor(matchedPin.mapZ || "");
      }
    }
  }, [selectedGreenCd, currentHole, currentCourse, mapModeState, imageLoaded, clubData]);

  useEffect(() => {
    setHolecupPinMove(false);
  }, [selectedGreenCd, mapModeState, currentCourse, currentHole]);

  const handleSubmit = () => {
    if (!pointerGreenPos || !finalGreenImgSize || !mapRef.current || !mapModeState) return;

    const payload: MapPinAPI[] = [];

    if (pointerOriginHolePinPos && pointerOriginGreenPos) {
      payload.push({
        holeId: currentHole.id,
        mapMode: mapModeState,
        mapCd: "PIN_HOLE",
        mapX: pointerOriginHolePinPos.x.toString(),
        mapY: pointerOriginHolePinPos.y.toString(),
        mapZ: pinColor,
      });
      payload.push({
        holeId: currentHole.id,
        mapMode: mapModeState,
        mapCd: `PIN_${selectedGreenCd}`,
        mapX: pointerOriginGreenPos.x.toString(),
        mapY: pointerOriginGreenPos.y.toString(),
        mapZ: pinColor,
      });
    }

    if (payload.length > 0) {
      postMapMutate(payload);
    }
  };

  if (!clubData) return;

  return (
    <>
      <div className={styles.holecup}>
        <div className={styles["holecup-content"]}>
          <button
            type="button"
            className={styles["arrow-button"]}
            onClick={() => router.push("/monitoring")}
          >
            <span className="blind">뒤로가기</span>
          </button>
          <ul className={styles["holecup-pin"]}>
            {pinColors.map((pinColor) => (
              <li key={pinColor}>
                <button
                  type="button"
                  className={`${styles["holecup-pin-item"]} ${pinColor === selectedPinColor ? styles.active : ""}`}
                  onClick={() => setSelectedPinColor(pinColor)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="29"
                    height="31"
                    viewBox="0 0 29 31"
                    fill="none"
                  >
                    <path
                      d="M22.5 28.5C22.5 28.5058 22.4996 28.5578 22.4023 28.6611C22.3028 28.7669 22.1314 28.8929 21.8677 29.0284C21.3418 29.2987 20.548 29.5569 19.5255 29.7792C17.4887 30.222 14.6509 30.5 11.5 30.5C8.34905 30.5 5.51135 30.222 3.47449 29.7792C2.45198 29.5569 1.65823 29.2987 1.13229 29.0284C0.868647 28.8929 0.697231 28.7669 0.597717 28.6611C0.500441 28.5578 0.5 28.5058 0.5 28.5C0.5 28.4942 0.500441 28.4422 0.597717 28.3389C0.697231 28.2331 0.868647 28.1071 1.13229 27.9716C1.65823 27.7013 2.45198 27.4431 3.47449 27.2208C5.51135 26.778 8.34905 26.5 11.5 26.5C14.6509 26.5 17.4887 26.778 19.5255 27.2208C20.548 27.4431 21.3418 27.7013 21.8677 27.9716C22.1314 28.1071 22.3028 28.2331 22.4023 28.3389C22.4996 28.4422 22.5 28.4942 22.5 28.5Z"
                      fill="#17462A"
                      stroke="#191E1B"
                    />
                    <path
                      d="M13 17L13 18.5165L14.3939 17.9191L26.2492 12.8383C27.8655 12.1456 27.8655 9.85437 26.2492 9.16171L14.3939 4.08085L13 3.48346L13 5L13 17Z"
                      fill={pinColor}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M8 3C8 1.34315 9.34315 0 11 0H12C13.6569 0 15 1.34315 15 3V28H8V3Z"
                      fill="white"
                    />
                    <path
                      d="M10 3.5C10 2.67157 10.6716 2 11.5 2C12.3284 2 13 2.67157 13 3.5V28H10V3.5Z"
                      fill="#727272"
                    />
                    <path d="M10 9H13V14H10V9Z" fill="#383838" />
                    <path d="M10 21H13V28H10V21Z" fill="#383838" />
                  </svg>
                </button>
                <span className={styles.circle} style={{ backgroundColor: pinColor }}></span>
              </li>
            ))}
          </ul>

          <div className={styles["holecup-map"]}>
            {selectedGreenImageUrl ? (
              <img
                alt="selected green"
                src={selectedGreenImageUrl}
                ref={mapRef}
                onClick={handleMapClick}
                onLoad={() => setImageLoaded(true)}
              />
            ) : (
              <div className={styles["no-image"]}>{t("holecup.noImage")}</div>
            )}
            {pointerGreenPos && (
              <svg
                className={styles["pointer-pin"]}
                style={{ top: pointerGreenPos.y, left: pointerGreenPos.x }}
                xmlns="http://www.w3.org/2000/svg"
                width="29"
                height="31"
                viewBox="0 0 29 31"
                fill="none"
              >
                <path
                  d="M22.5 28.5C22.5 28.5058 22.4996 28.5578 22.4023 28.6611C22.3028 28.7669 22.1314 28.8929 21.8677 29.0284C21.3418 29.2987 20.548 29.5569 19.5255 29.7792C17.4887 30.222 14.6509 30.5 11.5 30.5C8.34905 30.5 5.51135 30.222 3.47449 29.7792C2.45198 29.5569 1.65823 29.2987 1.13229 29.0284C0.868647 28.8929 0.697231 28.7669 0.597717 28.6611C0.500441 28.5578 0.5 28.5058 0.5 28.5C0.5 28.4942 0.500441 28.4422 0.597717 28.3389C0.697231 28.2331 0.868647 28.1071 1.13229 27.9716C1.65823 27.7013 2.45198 27.4431 3.47449 27.2208C5.51135 26.778 8.34905 26.5 11.5 26.5C14.6509 26.5 17.4887 26.778 19.5255 27.2208C20.548 27.4431 21.3418 27.7013 21.8677 27.9716C22.1314 28.1071 22.3028 28.2331 22.4023 28.3389C22.4996 28.4422 22.5 28.4942 22.5 28.5Z"
                  fill="#17462A"
                  stroke="#191E1B"
                />
                <path
                  d="M13 17L13 18.5165L14.3939 17.9191L26.2492 12.8383C27.8655 12.1456 27.8655 9.85437 26.2492 9.16171L14.3939 4.08085L13 3.48346L13 5L13 17Z"
                  fill={selectedPinColor}
                  stroke="white"
                  strokeWidth="2"
                />
                <path
                  d="M8 3C8 1.34315 9.34315 0 11 0H12C13.6569 0 15 1.34315 15 3V28H8V3Z"
                  fill="white"
                />
                <path
                  d="M10 3.5C10 2.67157 10.6716 2 11.5 2C12.3284 2 13 2.67157 13 3.5V28H10V3.5Z"
                  fill="#727272"
                />
                <path d="M10 9H13V14H10V9Z" fill="#383838" />
                <path d="M10 21H13V28H10V21Z" fill="#383838" />
              </svg>
            )}
            {toast.state && <div className={styles["toast"]}>{toast.mms}</div>}
          </div>

          <div className={styles["holecup-green"]}>
            <div className={styles["map-mode-toggle"]}>
              <button
                className={`${styles["landscape"]} ${mapModeState === "LANDSCAPE" ? styles["active"] : ""}`}
                onClick={() => setMapModeState("LANDSCAPE")}
              >
                <span className="blind">LANDSCAPE</span>
              </button>
              <button
                className={`${styles["portrait"]} ${mapModeState === "PORTRAIT" ? styles["active"] : ""}`}
                onClick={() => setMapModeState("PORTRAIT")}
              >
                <span className="blind">PORTRAIT</span>
              </button>
            </div>
            <div className={styles["holecup-green-box"]}>
              <div className={styles["img-wrap"]}>
                {currentGreensImage?.mapUrl ? (
                  <img alt="greens img" src={currentGreensImage?.mapUrl} />
                ) : (
                  <div className={styles["no-image"]}>{t("holecup.noImage")}</div>
                )}
              </div>
              <div className={styles["button-wrap"]}>
                {currentGreenImageList.map((img) => (
                  <button
                    key={img.mapCd}
                    type="button"
                    className={selectedGreenCd === img.mapCd ? styles.active : ""}
                    onClick={() => setSelectedGreenCd(img.mapCd)}
                  >
                    {img.mapCd}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              className={styles["save-button"]}
              onClick={handleSubmit}
              disabled={!holecupPinMove}
            >
              {t("holecup.save")}
            </button>
          </div>
        </div>

        <div className={styles["holecup-info"]}>
          <div className={styles["title-wrap"]}>
            <h5 className={styles.course}>{currentCourse.Nm}</h5>
          </div>
          <div className={styles["holecup-menu-box"]}>
            <ul className={`${styles["hole-list"]} scroll-hidden`}>
              {currentCourseData?.holeList?.length ? (
                currentCourseData.holeList.map((hole) => (
                  <li key={hole.holeId}>
                    <button
                      type="button"
                      className={`${styles["hole-item"]} ${currentHole?.id === hole.holeId ? styles.active : ""}`}
                      onClick={() => setCurrentHoleState({ id: hole.holeId, no: hole.holeNo })}
                    >
                      {hole.holeNo}
                    </button>
                  </li>
                ))
              ) : (
                <div className={styles["no-list"]}>{t("holecup.noCourse")}</div>
              )}
            </ul>
          </div>
        </div>
      </div>
      <button
        type="button"
        className={`${styles["floating-menu-button"]} ${styles["holecup-button"]}`}
        onClick={() => setHolecupMenuPopupOpen(true)}
      >
        <span>홀컵핀</span>
      </button>
      <HolecupMenuPopup courseList={clubData?.courseList || []} />
    </>
  );
};

export default HoleCup;
