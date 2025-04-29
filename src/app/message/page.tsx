"use client";

import styles from "@/styles/pages/message/message.module.scss";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { Input } from "@/components/Input";
import { Checkbox } from "@/components/CheckBox";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getBooking, getClub, getEventSSE, postSendHis} from "@/api/main";
import useAlertModal from "@/hooks/useAlertModal";
import {useRouter} from "next/navigation";
import { useTranslation } from "react-i18next";

const Message = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [selectedMsg, setSelectedMsg] = useState<{
    eventId: number | null;
    sendMsg: string;
  }>({
    eventId: null,
    sendMsg: ""
  });
  const [checked, setChecked] = useState(false);
  const [bookingList, setBookingList] = useState<string[]>([]);

  const { setAlertModalState } = useAlertModal();

  const router = useRouter();

  const { data: clubData } = useQuery({
    queryKey: ["clubData"],
    queryFn: () => getClub(),
  });

  const { data: bookingData } = useQuery({
    queryKey: ["bookingData"],
    queryFn: () => getBooking(),
  });

  const { data: eventSSEData } = useQuery({
    queryKey: ["eventSSE"],
    queryFn: () => getEventSSE(),
  });

  const handleArrow = () => {
    step === 1 ? router.back() : setStep(1);
  }

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = e => {
    setSelectedMsg(
        {
          eventId: null,
          sendMsg: e.target.value
        }
    );
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setChecked(value);
  };

  const handleChangeCourse = ({ target }: { target: HTMLInputElement }) => {
    const { id: courseId, checked } = target;

    // bookingData가 있는 경우에만 동작
    if (!bookingData) return;

    const relatedBookings = bookingData.filter(
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

  const handleChangeSSE = (id: number, value: string) => {
    setSelectedMsg({
      eventId: id,
      sendMsg: value
    });
  };

  const { mutate: sendHisMutate } = useMutation({
    mutationFn: postSendHis,
    onSuccess: () => {
      setAlertModalState(() => ({
        isShow: true,
        cancleBtnLabel: t("message.keepSending"),
        cancleCallback: () => setStep(1),
        actionUrl: "/monitoring",
        desc: t("message.sent"),
      }));
    },
    onError: () => {
      console.log("error!");
    },
  });


  const handleSubmit = () => {
    if (!bookingData) return;

    const selectedBookings = bookingData
        .filter((booking) => bookingList.includes(`${booking.bookingId}`))
        .map(({ bookingId, courseId }) => ({ bookingId, courseId }));

    const groupedByCourse = selectedBookings.reduce((acc, { bookingId, courseId }) => {
      const course = acc.find(item => item.courseId === courseId);

      if (course) {
        course.bookingIdList.push(bookingId);
      } else {
        acc.push({ courseId, bookingIdList: [bookingId] });
      }

      return acc;
    }, [] as { courseId: number, bookingIdList: number[] }[]);

    const sendTo = groupedByCourse.map(item => item.courseId).join(', ');

    const formData = new FormData();

    formData.append("eventId", selectedMsg.eventId?.toString() ?? "");
    formData.append("sendTo", `sendCourseId : ${sendTo}`);
    formData.append("sendMsg", selectedMsg.sendMsg?.toString() ?? "");
    groupedByCourse.forEach((v, i) => {
      formData.append(`courseList[${i}].courseId`, v.courseId.toString());
      v.bookingIdList.forEach((bookingId) => {
        formData.append(`courseList[${i}].bookingIdList`, bookingId.toString());
      });
    });

    sendHisMutate(formData);
  };



  return (
    <div className="layout portrait">
      <div className={styles["message-container"]}>
        <div className={styles["head"]}>
          <button type="button" className={styles["head-arrow"]} onClick={handleArrow}>
            <span className="blind">back</span>
          </button>
          <h1 className={styles["head-title"]}>{t("message.title")}</h1>
        </div>
        {step === 1 &&
        <div className={styles["content"]}>
          <strong className={styles["message-desc"]}>
            {t("message.selectTargetDesc").split("\n").map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </strong>
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
              {bookingData ? bookingData.map((booking) => {
                return (
                  <label key={booking.bookingId}>
                    <input
                        id={`${booking.bookingId}`}
                        name="booking"
                        type="checkbox"
                        data-course-id={`${booking.courseId}`}
                        className={styles["select-item"]}
                        onChange={handleChangeBooking}
                    />
                    <span className={styles["select-label"]}>{booking.bookingNm}</span>
                  </label>
                )
              }) : <div className={styles["no-list"]}>{t("message.noCart")}</div> }
            </div>
          </div>
          <button type="button" className={styles["confirm-button"]} onClick={() => setStep(2)}>다음</button>
        </div>
        }
        {step === 2 &&
          <div className={`${styles["content"]} ${styles["step2"]}`}>
            <strong className={styles["message-desc"]}>{t("message.inputDesc")}</strong>
            <Input
              label="content"
              labelShow={false}
              id="sendMsg"
              name="sendMsg "
              placeholder={t("message.inputDesc")}
              value={selectedMsg.sendMsg}
              onChange={handleInputChange}
              onClear={() => {
                setSelectedMsg(
                    {
                      eventId: null,
                      sendMsg: ""
                    }
                );
              }}
            />
            {/*<Checkbox*/}
            {/*  id="checkbox"*/}
            {/*  label={t("message.autocompleteText")}*/}
            {/*  checked={checked}*/}
            {/*  onChange={handleCheckboxChange}*/}
            {/*/>*/}
            <div className={styles["select-wrap"]}>
              <div className={styles["select-list"]}>
                {eventSSEData?.map((sse) => {
                  return (
                  <label key={sse.eventId}>
                    <input
                        id={`${sse.eventId}`}
                        name="sse"
                        type="radio"
                        className={styles["select-item"]}
                        onChange={() => handleChangeSSE(sse.eventId, sse.eventCont)}
                    />
                    <span className={styles["select-label"]}>{sse.eventCont}</span>
                  </label>
                  )
                })}
              </div>
            </div>
            <button type="button" className={styles["confirm-button"]}  onClick={handleSubmit}>{t("message.send")}</button>
          </div>
        }
      </div>
    </div>
  );
};

export default Message;
