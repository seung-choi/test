"use client";

import styles from "@/styles/pages/message/message.module.scss";
import { ChangeEventHandler, useState } from "react";
import { Input } from "@/components/Input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getEventSSE, postSendHis } from "@/api/main";
import { useTranslation } from "react-i18next";
import useAlertModal from "@/hooks/useAlertModal";
import BookingType from "@/types/Booking.type";

interface SendMessageProps {
  selctedBookingList: BookingType[];
  sendTo: string;
  onBack: () => void;
}

const SendMessage = ({ selctedBookingList, sendTo, onBack }: SendMessageProps) => {
  const { t } = useTranslation();
  const { setAlertModalState } = useAlertModal();

  const [selectedMsg, setSelectedMsg] = useState<{
    eventId: number | null;
    sendMsg: string;
  }>({
    eventId: null,
    sendMsg: "",
  });

  const { data: eventSSEData } = useQuery({
    queryKey: ["eventSSE"],
    queryFn: () => getEventSSE(),
  });

  const { mutate: sendHisMutate } = useMutation({
    mutationFn: postSendHis,
    onSuccess: () => {
      setAlertModalState(() => ({
        isShow: true,
        cancleBtnLabel: t("message.keepSending"),
        cancleCallback: onBack,
        actionUrl: "/monitoring",
        desc: t("message.sent"),
      }));
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSelectedMsg({
      eventId: null,
      sendMsg: e.target.value,
    });
  };

  const handleClear = () => {
    setSelectedMsg({
      eventId: null,
      sendMsg: "",
    });
  };

  const handleSSEChange = (id: number, value: string) => {
    setSelectedMsg({
      eventId: id,
      sendMsg: value,
    });
  };

  const handleSubmit = () => {
    // 메시지 보낼 카트가 없는 경우 알림창 표시
    if (selctedBookingList.length === 0) {
      setAlertModalState(() => ({
        isShow: true,
        cancleBtnLabel: "닫기",
        desc: "메세지 보낼 카트가 존재하지 않습니다.",
      }));
      return;
    }

    const formData = new FormData();

    if (selectedMsg.eventId !== null) {
      formData.append("eventId", selectedMsg.eventId.toString());
    }
    formData.append("sendTo", sendTo);
    formData.append("sendMsg", selectedMsg.sendMsg?.toString() ?? "");

    // selctedBookingList를 courseId별로 그룹화
    const groupedByCourse = selctedBookingList.reduce(
      (acc, booking) => {
        const courseId = booking.courseId;
        if (!acc[courseId]) {
          acc[courseId] = {
            courseId: courseId,
            bookingIdList: [],
          };
        }
        acc[courseId].bookingIdList.push(booking.bookingId);
        return acc;
      },
      {} as Record<number, { courseId: number; bookingIdList: number[] }>,
    );

    // 그룹화된 데이터를 formData에 추가
    Object.values(groupedByCourse).forEach((courseData, index) => {
      formData.append(`courseList[${index}].courseId`, courseData.courseId.toString());
      courseData.bookingIdList.forEach((bookingId) => {
        formData.append(`courseList[${index}].bookingIdList`, bookingId.toString());
      });
    });

    sendHisMutate(formData);
  };

  const handleArrow = () => {
    onBack();
  };

  return (
    <div className={styles["message-container"]}>
      <div className={styles["head"]}>
        <button type="button" className={styles["head-arrow"]} onClick={handleArrow}>
          <span className="blind">back</span>
        </button>
        <h1 className={styles["head-title"]}>{t("message.title")}</h1>
      </div>
      <div className={`${styles["content"]} ${styles["step2"]}`}>
        <strong className={styles["message-desc"]}>{t("message.inputDesc")}</strong>
        <Input
          label="content"
          labelShow={false}
          id="sendMsg"
          name="sendMsg"
          placeholder={t("message.inputDesc")}
          value={selectedMsg.sendMsg}
          onChange={handleInputChange}
          onClear={handleClear}
        />
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
                    onChange={() => handleSSEChange(sse.eventId, sse.eventCont)}
                    checked={selectedMsg.eventId === sse.eventId}
                  />
                  <span className={styles["select-label"]}>{sse.eventCont}</span>
                </label>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          className={styles["confirm-button"]}
          onClick={handleSubmit}
          disabled={selectedMsg.sendMsg === ""}
        >
          {t("message.send")}
        </button>
      </div>
    </div>
  );
};

export default SendMessage;
