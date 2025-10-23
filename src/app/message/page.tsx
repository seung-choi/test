"use client";

import styles from "@/styles/pages/message/message.module.scss";
import { useMemo, useState } from "react";
import SendMessage from "@/components/monitoring/SendMessage";
import { useQuery } from "@tanstack/react-query";
import { getBooking, getClub } from "@/api/main";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import transformBookingData from "@/utils/transformBookingData";
import BookingType from "@/types/Booking.type";

const Message = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [selctedBookingList, setSelctedBookingList] = useState<BookingType[]>([]);
  const [sendTo, setSendTo] = useState<string>("");
  const [selectedAll, setSelectedAll] = useState<boolean>(false);
  const [selectedCourses, setSelectedCourses] = useState<{ courseId: number; courseNm: string }[]>(
    [],
  );
  const [selectedcarts, setSelectedCarts] = useState<number[]>([]);

  const router = useRouter();

  const { data: clubData } = useQuery({
    queryKey: ["clubData"],
    queryFn: () => getClub(),
  });

  const { data: bookingData } = useQuery({
    queryKey: ["bookingData"],
    queryFn: () => getBooking(),
  });

  const refinedBookingData = useMemo(() => {
    if (!clubData || !bookingData) return [];
    return transformBookingData(bookingData, clubData);
  }, [bookingData, clubData]);

  const handleArrow = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(1);
    }
  };

  // 전체 체크박스 변경 핸들러
  const handleChangeAll = ({ target }: { target: HTMLInputElement }) => {
    const isChecked = target.checked;
    if (isChecked) {
      setSelectedAll(true);
      setSelectedCarts([]);
      setSelectedCourses([]);
    } else {
      setSelectedAll(false);
    }
  };

  // 코스별 체크박스 변경 핸들러
  const handleChangeCourse = ({ target }: { target: HTMLInputElement }) => {
    const courseId = Number(target.id);
    const isChecked = target.checked;

    if (isChecked) {
      // 코스 선택 시 전체, 카트별 체크박스 모두 해제
      setSelectedCarts([]);
      setSelectedAll(false);

      // 선택된 코스 정보 찾기
      const course = clubData?.courseList?.find((c) => c.courseId === courseId);
      if (course) {
        // 선택된 코스 객체 추가
        const newSelectedCourses = [
          ...selectedCourses,
          { courseId: course.courseId, courseNm: course.courseNm },
        ];
        setSelectedCourses(newSelectedCourses);
      }
    } else {
      // 코스 선택 해제 - 해당 courseId를 가진 객체 제거
      const newSelectedCourses = selectedCourses.filter((course) => course.courseId !== courseId);
      setSelectedCourses(newSelectedCourses);
    }
  };

  // 카트별 체크박스 변경 핸들러
  const handleChangeBooking = ({ target }: { target: HTMLInputElement }) => {
    const bookingId = Number(target.id);
    const isChecked = target.checked;

    if (isChecked) {
      // 카트 선택 시 전체, 코스별 체크박스 모두 해제
      setSelectedCourses([]);
      setSelectedAll(false);

      // 선택된 카트 추가
      const newSelectedCarts = [...selectedcarts, bookingId];
      setSelectedCarts(newSelectedCarts);
    } else {
      // 카트 선택 해제
      const newSelectedCarts = selectedcarts.filter((id) => id !== bookingId);
      setSelectedCarts(newSelectedCarts);
    }
  };

  // 메세지 보내기 팝업 이동
  const handleNext = () => {
    //전체 선택했을 경우
    if (selectedAll) {
      setSendTo("전체");
      setSelctedBookingList(refinedBookingData);
    }
    //코스 선택했을 경우
    if (selectedCourses.length > 0) {
      setSendTo(selectedCourses.map((course) => course.courseNm).join(", "));

      // 선택된 코스들의 모든 예약을 selctedBookingList에 추가
      const selectedCourseIds = selectedCourses.map((course) => course.courseId);
      const filteredBookings = refinedBookingData.filter((booking) =>
        selectedCourseIds.includes(booking.courseId),
      );
      setSelctedBookingList(filteredBookings);
    }
    //카트 선택했을 경우
    if (selectedcarts.length > 0) {
      setSendTo("cart");

      // 선택된 카트들의 예약을 selctedBookingList에 추가
      const filteredBookings = refinedBookingData.filter((booking) =>
        selectedcarts.includes(booking.bookingId),
      );
      setSelctedBookingList(filteredBookings);
    }
    setStep(2);
  };

  return (
    <>
      {step === 1 && (
        <div className={styles["message-container"]}>
          <div className={styles["head"]}>
            <button type="button" className={styles["head-arrow"]} onClick={handleArrow}>
              <span className="blind">back</span>
            </button>
            <h1 className={styles["head-title"]}>{t("message.title")}</h1>
          </div>
          <div className={styles["content"]}>
            <strong
              className={styles["message-desc"]}
              dangerouslySetInnerHTML={{ __html: t("message.selectTargetDesc") }}
            />
            <div className={styles["select-content-inner"]}>
              <div className={styles["select-wrap"]}>
                <strong className={styles["select-title"]}>전체</strong>
                <div className={styles["select-list"]}>
                  <label>
                    <input
                      type="checkbox"
                      className={styles["select-item"]}
                      checked={selectedAll}
                      onChange={handleChangeAll}
                    />
                    <span className={styles["select-label"]}>전체</span>
                  </label>
                </div>
              </div>
              <div className={styles["select-wrap"]}>
                <strong className={styles["select-title"]}>{t("message.selectByCourse")}</strong>
                <div className={styles["select-list"]}>
                  {clubData?.courseList ? (
                    clubData.courseList.map((course) => {
                      return (
                        <label key={course.courseId}>
                          {/* 코스별 Checkbox */}
                          <input
                            id={`${course.courseId}`}
                            name="course"
                            type="checkbox"
                            className={styles["select-item"]}
                            checked={selectedCourses.some(
                              (selectedCourse) => selectedCourse.courseId === course.courseId,
                            )}
                            onChange={handleChangeCourse}
                          />
                          <span className={styles["select-label"]}>{course.courseNm}</span>
                        </label>
                      );
                    })
                  ) : (
                    <div className={styles["no-list"]}>{t("message.noCart")}</div>
                  )}
                </div>
              </div>
              <div className={`${styles["select-wrap"]} ${styles["cart"]}`}>
                <strong className={styles["title"]}>{t("message.selectByCart")}</strong>
                <div className={styles["select-list"]}>
                  {refinedBookingData?.length > 0 ? (
                    refinedBookingData.map((booking) => {
                      return (
                        <label key={booking.bookingId}>
                          {/* 카트별 Checkbox */}
                          <input
                            id={`${booking.bookingId}`}
                            name="booking"
                            type="checkbox"
                            data-course-id={`${booking.courseId}`}
                            className={styles["select-item"]}
                            checked={selectedcarts.includes(booking.bookingId)}
                            onChange={handleChangeBooking}
                          />
                          <span className={styles["select-label"]}>{booking.bookingNm}</span>
                        </label>
                      );
                    })
                  ) : (
                    <div className={styles["no-list"]}>{t("message.noCart")}</div>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              className={styles["confirm-button"]}
              onClick={handleNext}
              disabled={!(selectedAll || selectedCourses.length > 0 || selectedcarts.length > 0)}
            >
              {t("message.next")}
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <SendMessage
          selctedBookingList={selctedBookingList}
          onBack={() => setStep(1)}
          sendTo={sendTo}
        />
      )}
    </>
  );
};

export default Message;
