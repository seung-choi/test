"use client";

import styles from "@/styles/pages/message/message.module.scss";
import { ChangeEventHandler, useState } from "react";
import { Input } from "@/components/Input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getEventSSE, postSendHis } from "@/api/main";
import { useTranslation } from "react-i18next";
import useAlertModal from "@/hooks/useAlertModal";

interface SendMessageProps {
  groupedByCourse: { courseId: number; bookingIdList: number[] }[];
  onBack: () => void;
}

const SendMessage = ({ groupedByCourse, onBack }: SendMessageProps) => {
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
