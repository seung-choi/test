import BookingType from "@/types/Booking.type";
import ClubType from "@/types/Club.type";
import React, { useRef, useState, useMemo } from "react";
import styles from "@/styles/components/monitoring/MapMonitoring.module.scss";
import { useCourseMapConfig } from "@/hooks/useCourseMapConfig";
import { gpsToPx } from "@/utils/pg";

interface MapMonitoringProps {
  clubData: ClubType;
  booking: BookingType[];
  onBookingClick: (booking: BookingType) => void;
  onStandByPopupOpen: () => void;
}

const MapMonitoring = ({
  clubData,
  booking,
  onBookingClick,
  onStandByPopupOpen,
}: MapMonitoringProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // courseMapList에서 mapCd가 "COURSE"이고 mapType이 "IMG"인 요소의 mapUrl 찾기
  const courseMapImage = useMemo(() => {
    return (
      clubData?.courseMapList?.find(
        (mapItem) => mapItem.mapCd === "COURSE" && mapItem.mapType === "IMG",
      ) || null
    );
  }, [clubData?.courseMapList]);

  // courseMapImage의 mapX에서 ImageWidth와 ImageHeight 추출 ("1920x1200" 형식)
  const { imageWidth, imageHeight } = useMemo(() => {
    const imageDimensions = courseMapImage?.mapX?.split("x") || ["1920", "1200"];
    return {
      imageWidth: imageDimensions[0] || "1920",
      imageHeight: imageDimensions[1] || "1200",
    };
  }, [courseMapImage?.mapX]);

  // courseMapList에서 시작점 GPS 좌표 찾기
  const startPointData = useMemo(() => {
    const startPoint = clubData?.courseMapList?.find(
      (mapItem) => mapItem.mapCd === "MARKER_COURSE_START" && mapItem.mapType === "GPS",
    );
    return {
      startPointGPSLat: startPoint?.mapY || "",
      startPointGPSLng: startPoint?.mapX || "",
    };
  }, [clubData?.courseMapList]);

  // courseMapList에서 끝점 GPS 좌표 찾기
  const endPointData = useMemo(() => {
    const endPoint = clubData?.courseMapList?.find(
      (mapItem) => mapItem.mapCd === "MARKER_COURSE_END" && mapItem.mapType === "GPS",
    );
    return {
      endPointGPSLat: endPoint?.mapY || "",
      endPointGPSLng: endPoint?.mapX || "",
    };
  }, [clubData?.courseMapList]);

  // useCourseMapConfig 훅을 컴포넌트 최상위에서 호출
  const { config: courseMapConfig, isConfigReady } = useCourseMapConfig({
    imgRef,
    ImageWidth: imageWidth,
    ImageHeight: imageHeight,
    startPointGPSLat: startPointData.startPointGPSLat,
    startPointGPSLng: startPointData.startPointGPSLng,
    endPointGPSLat: endPointData.endPointGPSLat,
    endPointGPSLng: endPointData.endPointGPSLng,
  });

  return (
    <div className={styles["map-monitoring-container"]}>
      <div className={styles["map-monitoring-header"]}>
        <div className={styles["map-monitoring-header-status"]}>
          <span className={styles["map-monitoring-header-status-title"]}>경기팀</span>
          {clubData?.courseList.map((course) => {
            // 해당 코스에 해당하는 예약 데이터 필터링
            const courseBookings =
              booking?.filter((booking: BookingType) => booking.courseId === course.courseId) || [];

            // 게임 진행중인 팀 수 계산 (전반/후반 진행중인 팀만)
            const playingBookings = courseBookings.filter(
              (booking) => booking.status === "OP" || booking.status === "IP",
            );

            return (
              <div className={styles["map-monitoring-header-status-course"]}>
                <span
                  className={styles["course-color"]}
                  style={{ backgroundColor: course.courseCol }}
                ></span>
                <div className={styles["course-name"]}>{course.courseNm}</div>
                <div className={styles["course-state-count"]}>{playingBookings.length}팀</div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className={styles["map-monitoring-header-standby"]}
          onClick={onStandByPopupOpen}
        >
          대기 현황
        </button>
      </div>
      <div className={styles["map-monitoring-content"]}>
        <div className={styles["map-view"]}>
          <img
            className={styles["hole-img"]}
            src={courseMapImage?.mapUrl || ""}
            alt="코스 맵 이미지"
            style={{ width: "auto", height: "auto" }}
            ref={imgRef}
            onLoad={() => setIsLoaded(true)}
          />
          {isLoaded &&
            isConfigReady &&
            booking?.map((bookingItem, index) => {
              const outCourse = clubData.courseList.find(
                (c) => c.courseId === bookingItem.outCourseId,
              );
              try {
                const { x, y } = gpsToPx(
                  { latitude: bookingItem.latitude, longitude: bookingItem.longitude },
                  courseMapConfig,
                );

                return (
                  <div
                    key={`cart-${bookingItem.bookingId}-${index}`}
                    className={styles["cart-item"]}
                    style={{ left: x, top: y }}
                    onClick={() => onBookingClick(bookingItem)}
                  >
                    {/* 예약명 표시 */}
                    <strong
                      className={styles["cart-item-booking-name"]}
                      style={{ backgroundColor: outCourse?.courseCol }}
                    >
                      {bookingItem.bookingNm}
                    </strong>
                    {/* 카트 아이콘 */}
                    <span
                      className={styles["cart-item-icon"]}
                      style={{ borderColor: outCourse?.courseCol }}
                    >
                      <img
                        src="/assets/image/icon-cart-gray.svg"
                        alt="cart"
                        style={{ width: "8px", color: "#444" }}
                      />
                    </span>
                    <span
                      className={styles["cart-item-line"]}
                      style={{ backgroundColor: outCourse?.courseCol }}
                    ></span>
                  </div>
                );
              } catch (error) {
                // 에러 발생 시 해당 마커는 렌더링하지 않음
                return null;
              }
            })}
        </div>
      </div>
    </div>
  );
};

export default MapMonitoring;
