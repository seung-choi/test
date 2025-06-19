"use client";

import styles from "@/styles/pages/holecup/holecup.module.scss";
import {useEffect, useMemo, useRef, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getClub, postMapPin} from "@/api/main";
import ClubType from "@/types/Club.type";
import Menu from "@/components/Menu";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentCourseState, currentHoleState } from "@/lib/recoil";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export interface MapPinAPI {
    holeId: number | null,
    mapMode: string,
    mapCd: string,
    mapX: string,
    mapY: string,
    mapZ: string
}

const HoleCup = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const pinColors = ["#FB3B3B", "#FBD23C", "#71BE34", "#42444E", "#2F65CA", "#F0F0F0"];
    const [selectedPinColor, setSelectedPinColor] = useState<string>("");
    const [pinLSColor, setPinLSColor] = useState<string>("");
    const [pinPTColor, setPinPTColor] = useState<string>("");
    const [selectedGreenCd, setSelectedGreenCd] = useState<string | null>(null);
    const [pointerGreenPos, setPointerGreenPos] = useState<{ x: number; y: number } | null>(null);
    const [finalGreenPos, setFinalGreenPos] = useState<{ x: number; y: number } | null>(null);
    const [pointerOriginLSGreenPos, setPointerOriginLSGreenPos] = useState<{ x: number; y: number }>();
    const [pointerOriginLSHolePinPos, setPointerOriginLSHolePinPos] = useState<{ x: number; y: number } | null>();
    const [pointerOriginPTGreenPos, setPointerOriginPTGreenPos] = useState<{ x: number; y: number }>();
    const [pointerOriginPTHolePinPos, setPointerOriginPTHolePinPos] = useState<{ x: number; y: number } | null>();
    const [finalGreenImgSize, setFinalGreenImgSize] = useState<{ width: number; height: number } | null>();
    const [finalGreenMap, setFinalGreeneMap] = useState<{ x: number; y: number } | null>();
    const [scaleGreenImgSize, setScaleGreenImgSize] = useState<number>(0);
    const [originGreenImgSize, setOriginGreenImgSize] = useState<number>(0);
    const [mapModeState, setMapModeState] = useState<string>("");
    const [holecupPinMove, setHolecupPinMove] = useState<boolean>(false);
    const [toast, setToast] = useState<{
        state: boolean,
        mms : string
    }>({
        state : false,
        mms: ""
    });
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const mapRef = useRef<HTMLImageElement | null>(null);

    const currentCourse = useRecoilValue(currentCourseState);
    const [currentHole, setCurrentHoleState] = useRecoilState(currentHoleState);


    const { data: clubData } = useQuery<ClubType>({
        queryKey: ["clubData"],
        queryFn: getClub,
    });

    const { mutate: postMapMutate } = useMutation({
        mutationFn: postMapPin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clubData"] });
            setToast({
                state : true,
                mms: t("holecup.pinSuccess"),
            });
            setTimeout(() => {
                setToast({
                    state: false,
                    mms: ""
                });
            }, 3000);

        },
        onError: () => {
            setToast({
                state : true,
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

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (typeof window === "undefined" || !mapRef.current || !finalGreenImgSize || !finalGreenMap || !finalGreenPos) return;
        setHolecupPinMove(true);
        // 랜더링된 Green 이미지상의 pin 좌표
        const { x: clickX, y: clickY } = getCorrectedClickCoords(e);
        setPointerGreenPos({ x: clickX, y: clickY });

        // 원본 Green 이미지상의 pin 좌표
        const { width, height } = mapRef.current.getBoundingClientRect();
        const scaleX = finalGreenImgSize.width / width;
        const scaleY = finalGreenImgSize.height / height;

        if(mapModeState === "PORTRAIT") {
            setPointerOriginPTGreenPos({ x: clickX * scaleX, y: clickY * scaleY });
            setPinPTColor(selectedPinColor);
        } else {
            setPointerOriginLSGreenPos({ x: clickX * scaleX, y: clickY * scaleY });
            setPinLSColor(selectedPinColor);
        }

        const movePos  = {
            x: (clickX * scaleX) - finalGreenPos?.x,
            y: (clickY * scaleY) - finalGreenPos?.y
        }

        const scale = originGreenImgSize / scaleGreenImgSize;

        const scalePos = {
            x: movePos.x * scale,
            y: movePos.y * scale,
        }

        if(mapModeState === "PORTRAIT") {
            setPointerOriginPTHolePinPos(
              {
                  x: Number(currentInitialOriginHolePos?.x) + Number(scalePos.x),
                  y: Number(currentInitialOriginHolePos?.y) + Number(scalePos.y)
              }
            )
        } else {
            setPointerOriginLSHolePinPos(
              {
                  x: Number(currentInitialOriginHolePos?.x) + Number(scalePos.x),
                  y: Number(currentInitialOriginHolePos?.y) + Number(scalePos.y)
              }
            )
        }
    };

    const currentCourseData = useMemo(() => {
        return clubData?.courseList.find(course => course.courseId === currentCourse.id);
    }, [clubData, currentCourse]);

    const currentHoleData = useMemo(() => {
        if (!currentCourseData || !currentHole.id) return undefined;
        return currentCourseData.holeList.find(hole => hole.holeId === currentHole.id);
    }, [currentCourseData, currentHole]);

    const currentInitialOriginHolePos = useMemo(() => {
        if (!currentHoleData) return undefined;

        const foundMap = currentHoleData?.mapList.find(
          map => map.mapMode === mapModeState && map.mapCd === "PIN_HOLE" && map.mapType === "DOM"
        );

        if (!foundMap || !foundMap.mapY) return undefined;

        return {
            x: foundMap.mapX,
            y: foundMap.mapY
        };
    }, [currentHoleData, mapModeState]);

    const currentGreenImageList = useMemo(() => {
        if (!currentHoleData?.mapList || !clubData?.clubMode) return [];
        return currentHoleData.mapList.filter(
            map => map.mapMode === mapModeState && map.mapCd.startsWith("GREEN_") && map.mapType === "IMG"
        );
    }, [currentHoleData, selectedGreenCd, mapModeState]);

    const pinGreenList = useMemo(() => {
        if (!currentHoleData?.mapList || !clubData?.clubMode) return [];
        return currentHoleData.mapList.filter(
            map => map.mapMode === mapModeState && map.mapCd.startsWith("PIN_GREEN_") && map.mapType === "DOM"
        );
    }, [currentHoleData, selectedGreenCd, mapModeState]);

    const currentGreensImage = useMemo(() => {
        if (!currentHoleData?.mapList || !clubData?.clubMode) return null;
        return currentHoleData.mapList.find(
            map => map.mapMode === mapModeState &&
                map.mapCd === "GREENS" &&
                map.mapType === "IMG"
        );
    }, [currentHoleData, clubData, selectedGreenCd, mapModeState]);

    const selectedGreenImageUrl = useMemo(() => {
        return currentGreenImageList.find(img => img.mapCd === selectedGreenCd)?.mapUrl || "";
    }, [currentGreenImageList, selectedGreenCd]);

    useEffect(() => {
        if (!clubData) return;

        const currentCourseData = clubData.courseList.find(course => course.courseId === currentCourse.id);

        if(currentCourseData?.holeList.length === 0 || null) return;

        const defaultHole = currentCourseData?.holeList.find(hole => hole.holeNo === 1);
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
            const targetCourse = clubData.courseList.find(course => course.courseId === currentCourse.id);

            const hasLandscapeGreenImage =
              targetCourse?.holeList?.[0]?.mapList?.some(
                map =>
                  map.mapMode === "LANDSCAPE" &&
                  map.mapType === "IMG" &&
                  map.mapCd.startsWith("GREEN_") &&
                  !!map.mapUrl
              );

            if (hasLandscapeGreenImage) {
                setMapModeState("LANDSCAPE");
            } else {
                setMapModeState("PORTRAIT");
            }
        }
    }, [clubData, mapModeState]);

    useEffect(() => {
        if(pinGreenList.length === 0) {
            setPointerGreenPos(null);
        }
        if (selectedGreenCd && pinGreenList.length > 0 && currentGreenImageList.length > 0 && imageLoaded) {
            const suffix = selectedGreenCd.replace("GREEN_", "");
            const greenImageData = currentGreenImageList.find(img => img.mapCd.endsWith(suffix));

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

            if (greenImageData?.mapZ) {
                const [origin, scale] = greenImageData.mapZ.split("x").map(Number);
                // 원본 이미지 사이즈
                setOriginGreenImgSize(origin);
                setScaleGreenImgSize(scale);
            }

            const matchedPin = pinGreenList.find(pin => pin.mapCd === `PIN_GREEN_${suffix}`);

            if(!matchedPin) {
                setPointerGreenPos(null);
            } else if (
                matchedPin?.mapX != null &&
                matchedPin?.mapY != null &&
                finalSize &&
                mapRef.current
            ) {
                const { width: renderedWidth, height: renderedHeight } = mapRef.current.getBoundingClientRect();
                const scaleX = renderedWidth / finalSize.width;
                const scaleY = renderedHeight / finalSize.height;

                setFinalGreenPos({
                    x: Number(matchedPin.mapX),
                    y: Number(matchedPin.mapY)
                });

                setPointerGreenPos({
                    x: Number(matchedPin.mapX) * scaleX,
                    y: Number(matchedPin.mapY) * scaleY,
                });
                setSelectedPinColor(matchedPin.mapZ || "");
            }
        }
    }, [selectedGreenCd, currentHole, currentCourse, mapModeState, imageLoaded]);


    useEffect(() => {
        setHolecupPinMove(false);
    }, [selectedGreenCd, mapModeState,currentCourse, currentHole]);

    const handleSubmit = () => {
        if (!pointerGreenPos || !finalGreenImgSize || !mapRef.current) return;

        const payload: MapPinAPI[] = [];

        if (pointerOriginLSHolePinPos) {
            payload.push({
                holeId: currentHole.id,
                mapMode: "LANDSCAPE",
                mapCd: "PIN_HOLE",
                mapX: pointerOriginLSHolePinPos.x.toString(),
                mapY: pointerOriginLSHolePinPos.y.toString(),
                mapZ: pinLSColor,
            });
        }

        if (pointerOriginLSGreenPos) {
            payload.push({
                holeId: currentHole.id,
                mapMode: "LANDSCAPE",
                mapCd: `PIN_${selectedGreenCd}`,
                mapX: pointerOriginLSGreenPos.x.toString(),
                mapY: pointerOriginLSGreenPos.y.toString(),
                mapZ: pinLSColor,
            });
        }

        if (pointerOriginPTHolePinPos) {
            payload.push({
                holeId: currentHole.id,
                mapMode: "PORTRAIT",
                mapCd: "PIN_HOLE",
                mapX: pointerOriginPTHolePinPos.x.toString(),
                mapY: pointerOriginPTHolePinPos.y.toString(),
                mapZ: pinPTColor,
            });
        }

        if (pointerOriginPTGreenPos) {
            payload.push({
                holeId: currentHole.id,
                mapMode: "PORTRAIT",
                mapCd: `PIN_${selectedGreenCd}`,
                mapX: pointerOriginPTGreenPos.x.toString(),
                mapY: pointerOriginPTGreenPos.y.toString(),
                mapZ: pinPTColor,
            });
        }

        if (payload.length > 0) {
            postMapMutate(payload);
        }
    };

    if(!clubData) return;

    return (
        <>
            <div className={styles.holecup}>
                <div className={styles["holecup-content"]}>
                    <ul className={styles["holecup-pin"]}>
                        {pinColors.map(pinColor => (
                            <li key={pinColor}>
                                <button
                                    type="button"
                                    className={`${styles["holecup-pin-item"]} ${pinColor === selectedPinColor ? styles.active : ""}`}
                                    onClick={() => setSelectedPinColor(pinColor)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="31" viewBox="0 0 29 31" fill="none">
                                        <path d="M22.5 28.5C22.5 28.5058 22.4996 28.5578 22.4023 28.6611C22.3028 28.7669 22.1314 28.8929 21.8677 29.0284C21.3418 29.2987 20.548 29.5569 19.5255 29.7792C17.4887 30.222 14.6509 30.5 11.5 30.5C8.34905 30.5 5.51135 30.222 3.47449 29.7792C2.45198 29.5569 1.65823 29.2987 1.13229 29.0284C0.868647 28.8929 0.697231 28.7669 0.597717 28.6611C0.500441 28.5578 0.5 28.5058 0.5 28.5C0.5 28.4942 0.500441 28.4422 0.597717 28.3389C0.697231 28.2331 0.868647 28.1071 1.13229 27.9716C1.65823 27.7013 2.45198 27.4431 3.47449 27.2208C5.51135 26.778 8.34905 26.5 11.5 26.5C14.6509 26.5 17.4887 26.778 19.5255 27.2208C20.548 27.4431 21.3418 27.7013 21.8677 27.9716C22.1314 28.1071 22.3028 28.2331 22.4023 28.3389C22.4996 28.4422 22.5 28.4942 22.5 28.5Z" fill="#17462A" stroke="#191E1B"/>
                                        <path d="M13 17L13 18.5165L14.3939 17.9191L26.2492 12.8383C27.8655 12.1456 27.8655 9.85437 26.2492 9.16171L14.3939 4.08085L13 3.48346L13 5L13 17Z" fill={pinColor} stroke="white" strokeWidth="2"/>
                                        <path d="M8 3C8 1.34315 9.34315 0 11 0H12C13.6569 0 15 1.34315 15 3V28H8V3Z" fill="white"/>
                                        <path d="M10 3.5C10 2.67157 10.6716 2 11.5 2C12.3284 2 13 2.67157 13 3.5V28H10V3.5Z" fill="#727272"/>
                                        <path d="M10 9H13V14H10V9Z" fill="#383838"/>
                                        <path d="M10 21H13V28H10V21Z" fill="#383838"/>
                                    </svg>
                                </button>
                                <span className={styles.circle} style={{ backgroundColor: pinColor }}></span>
                            </li>
                        ))}
                    </ul>

                    <div className={styles["holecup-map"]}>
                        {selectedGreenImageUrl ? <img alt="selected green" src={selectedGreenImageUrl} ref={mapRef} onClick={handleMapClick} onLoad={() => setImageLoaded(true)} /> : <div className={styles["no-image"]}>{t("holecup.noImage")}</div>}
                        {pointerGreenPos &&
                            <svg className={styles["pointer-pin"]} style={{ top: pointerGreenPos.y, left: pointerGreenPos.x }} xmlns="http://www.w3.org/2000/svg" width="29" height="31" viewBox="0 0 29 31" fill="none">
                                <path d="M22.5 28.5C22.5 28.5058 22.4996 28.5578 22.4023 28.6611C22.3028 28.7669 22.1314 28.8929 21.8677 29.0284C21.3418 29.2987 20.548 29.5569 19.5255 29.7792C17.4887 30.222 14.6509 30.5 11.5 30.5C8.34905 30.5 5.51135 30.222 3.47449 29.7792C2.45198 29.5569 1.65823 29.2987 1.13229 29.0284C0.868647 28.8929 0.697231 28.7669 0.597717 28.6611C0.500441 28.5578 0.5 28.5058 0.5 28.5C0.5 28.4942 0.500441 28.4422 0.597717 28.3389C0.697231 28.2331 0.868647 28.1071 1.13229 27.9716C1.65823 27.7013 2.45198 27.4431 3.47449 27.2208C5.51135 26.778 8.34905 26.5 11.5 26.5C14.6509 26.5 17.4887 26.778 19.5255 27.2208C20.548 27.4431 21.3418 27.7013 21.8677 27.9716C22.1314 28.1071 22.3028 28.2331 22.4023 28.3389C22.4996 28.4422 22.5 28.4942 22.5 28.5Z" fill="#17462A" stroke="#191E1B"/>
                                <path d="M13 17L13 18.5165L14.3939 17.9191L26.2492 12.8383C27.8655 12.1456 27.8655 9.85437 26.2492 9.16171L14.3939 4.08085L13 3.48346L13 5L13 17Z" fill={selectedPinColor} stroke="white" strokeWidth="2"/>
                                <path d="M8 3C8 1.34315 9.34315 0 11 0H12C13.6569 0 15 1.34315 15 3V28H8V3Z" fill="white"/>
                                <path d="M10 3.5C10 2.67157 10.6716 2 11.5 2C12.3284 2 13 2.67157 13 3.5V28H10V3.5Z" fill="#727272"/>
                                <path d="M10 9H13V14H10V9Z" fill="#383838"/>
                                <path d="M10 21H13V28H10V21Z" fill="#383838"/>
                            </svg>
                        }
                        {toast.state &&
                            <div className={styles["toast"]}>{toast.mms}</div>
                        }
                    </div>

                    <div className={styles["holecup-green"]}>
                        <div className={styles["map-mode-toggle"]}>
                            <button className={`${styles["landscape"]} ${mapModeState === "LANDSCAPE" ? styles["active"] : ""}`} onClick={() => setMapModeState("LANDSCAPE")}>
                                <span className="blind">LANDSCAPE</span>
                            </button>
                            <button className={`${styles["portrait"]} ${mapModeState === "PORTRAIT" ? styles["active"] : ""}`} onClick={() => setMapModeState("PORTRAIT")}>
                                <span className="blind">PORTRAIT</span>
                            </button>
                        </div>
                        <div className={styles["holecup-green-box"]}>
                            <div className={styles["img-wrap"]}>
                                {currentGreensImage?.mapUrl ?
                                  <img alt="greens img" src={currentGreensImage?.mapUrl} />
                                    :
                                  <div className={styles["no-image"]}>{t("holecup.noImage")}</div>
                                }
                            </div>
                            <div className={styles["button-wrap"]}>
                                {currentGreenImageList.map(img => (
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
                        <button type="button" className={styles["save-button"]} onClick={handleSubmit} disabled={!holecupPinMove}>{t("holecup.save")}</button>
                    </div>
                </div>

                <div className={styles["holecup-info"]}>
                    <div className={styles["title-wrap"]}>
                        <h5 className={styles.course}>{currentCourse.Nm}</h5>
                    </div>
                    <div className={styles["holecup-menu-box"]}>
                        <ul className={`${styles["hole-list"]} scroll-hidden`}>
                            {currentCourseData?.holeList?.length ? (
                              currentCourseData.holeList.map(hole => (
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
            <Menu courseList={clubData?.courseList || []} />
        </>
    );
};

export default HoleCup;
