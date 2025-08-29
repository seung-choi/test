"use client";

import styles from "@/styles/pages/message/message.module.scss";
import { useMemo, useState } from "react";
import SendMessage from "@/components/monitoring/SendMessage";
import {useQuery} from "@tanstack/react-query";
import {getBooking, getClub} from "@/api/main";
import {useRouter} from "next/navigation";
import { useTranslation } from "react-i18next";
import transformBookingData from "@/utils/transformBookingData";

const Message = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [bookingList, setBookingList] = useState<string[]>([]);

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
      setBookingList([]);
      router.back();
    } else {
      setStep(1);
    }
  };



  const handleChangeCourse = ({ target }: { target: HTMLInputElement }) => {
    const { id: courseId, checked } = target;

    // refinedBookingData가 있는 경우에만 동작
    if (!refinedBookingData) return;

    const relatedBookings = refinedBookingData.filter(
        (booking) => `${booking.courseId}` === courseId
    );

    const updatedBookingList = new Set(bookingList);

    relatedBookings.forEach((booking) => {
      const bookingInput = document.querySelector(
          `input[name="booking"][id="${booking.bookingId}"]`
      ) as HTMLInputElement | null;

      if (bookingInput) {
        bookingInput.checked = checked;
        if (checked) {
          updatedBookingList.add(`${booking.bookingId}`);
        } else {
          updatedBookingList.delete(`${booking.bookingId}`);
        }
      }
    });

    setBookingList(Array.from(updatedBookingList));
  };

  const handleChangeBooking = ({ target }: { target: HTMLInputElement }) => {
    const {
      id,
      checked,
    }: {
      id: string,
      checked: boolean,
    } = target;

    setBookingList((prev) =>
        checked ? [...prev, id] : prev.filter(courseId => courseId !== id)
    );
  };



  const getGroupedByCourse = () => {
    if (!refinedBookingData) return [];

    const selectedBookings = refinedBookingData
        .filter((booking) => bookingList.includes(`${booking.bookingId}`))
        .map(({ bookingId, courseId }) => ({ bookingId, courseId }));

    return selectedBookings.reduce((acc, { bookingId, courseId }) => {
      const course = acc.find(item => item.courseId === courseId);

      if (course) {
        course.bookingIdList.push(bookingId);
      } else {
        acc.push({ courseId, bookingIdList: [bookingId] });
      }

      return acc;
    }, [] as { courseId: number, bookingIdList: number[] }[]);
  };



  return (
    <>
    {step === 1 &&
      <div className={styles["message-container"]}>
        <div className={styles["head"]}>
          <button type="button" className={styles["head-arrow"]} onClick={handleArrow}>
            <span className="blind">back</span>
          </button>
          <h1 className={styles["head-title"]}>{t("message.title")}</h1>
        </div>
        <div className={styles["content"]}>
          <strong className={styles["message-desc"]}>
            {t("message.selectTargetDesc").split("\n").map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </strong>
          <div className={styles["select-content-inner"]}>
            <div className={styles["select-wrap"]}>
               <strong className={styles["select-title"]}>{t("message.selectByCourse")}</strong>
               <div className={styles["select-list"]}>
                 {clubData?.courseList ? clubData.courseList.map((course) => {
                   return (
                     <label key={course.courseId}>
                       <input
                           id={`${course.courseId}`}
                           name="course"
                           type="checkbox"
                           className={styles["select-item"]}
                           onChange={handleChangeCourse}
                           checked={refinedBookingData?.some(booking => booking.courseId === course.courseId && bookingList.includes(`${booking.bookingId}`))}
                       />
                       <span className={styles["select-label"]}>{course.courseNm}</span>
                     </label>
                   )
                 }) :  <div className={styles["no-list"]}>{t("message.noCart")}</div>}
               </div>
            </div>
            <div className={`${styles["select-wrap"]} ${styles["cart"]}`}>
              <strong className={styles["title"]}>{t("message.selectByCart")}</strong>
              <div className={styles["select-list"]}>
                {refinedBookingData?.length > 0 ? refinedBookingData.map((booking) => {
                  return (
                    <label key={booking.bookingId}>
                      <input
                          id={`${booking.bookingId}`}
                          name="booking"
                          type="checkbox"
                          data-course-id={`${booking.courseId}`}
                          className={styles["select-item"]}
                          onChange={handleChangeBooking}
                          checked={bookingList.includes(`${booking.bookingId}`)}
                      />
                      <span className={styles["select-label"]}>{booking.bookingNm}</span>
                    </label>
                  )
                }) : <div className={styles["no-list"]}>{t("message.noCart")}</div> }
              </div>
            </div>
          </div>
          <button type="button" className={styles["confirm-button"]} onClick={() => setStep(2)} disabled={bookingList.length === 0 || refinedBookingData?.length === 0}>{t("message.next")}</button>
        </div>
      </div>
      }
      {step === 2 && (
      <SendMessage
        groupedByCourse={getGroupedByCourse()}
        onBack={() => setStep(1)}
      />
      )}
    </>
  );
};

export default Message;
