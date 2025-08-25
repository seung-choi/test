"use client";

import styles from "@/styles/pages/search/search.module.scss";
import { getBooking, getClub } from "@/api/main";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {useRouter} from "next/navigation";
import SendMessage from "@/components/monitoring/SendMessage";
import { Input } from "@/components/Input";
import transformBookingData from "@/utils/transformBookingData";
import BookingDetail from "@/components/monitoring/BookingDetail";

const Search = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [searchType, setSearchType] = useState<("caddy" | "player")>("caddy");
  const [searchName, setSearchName] = useState<string>("");

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
  
  return (
    <>
    {step === 1 &&
    <div className={styles["search-container"]}>
      <div className={styles["head"]}>
        <button type="button" className={styles["head-arrow"]} onClick={() => router.push("/monitoring")}>
          <span className="blind">back</span>
        </button>
        <h1 className={styles["head-title"]}>검색하기</h1>
      </div>
      <div className={styles["content"]}>
        <div className={styles["search-inner"]}>
          <strong className={styles["search-desc"]}>검색할 이름을 <br />입력해주세요.</strong>
          <div className={styles["search-type"]}>
            <button type="button" className={`${styles["search-type-button"]} ${searchType === "caddy" ? styles["active"] : ""}`} onClick={() => setSearchType("caddy")}>
              캐디
            </button>
            <button type="button" className={`${styles["search-type-button"]} ${searchType === "player" ? styles["active"] : ""}`} onClick={() => setSearchType("player")}>
              내장객명
            </button>
          </div>
          <Input
            label="content"
            labelShow={false}
            id="searchName"
            name="searchName"
            placeholder={"텍스트를 입력하세요."}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onClear={() => setSearchName("")}
          />
        </div>
        <div className={styles["search-result-inner"]}>
          <span className={styles["search-result-desc"]}>중복된 검색 결과입니다. 찾으시는 항목을 선택해주세요.</span>
          <ul className={styles["search-result-list"]}>
            <li className={styles["search-result-item"]}>
              <span className={styles["search-result-item-name"]}>김지원</span>
              <span className={styles["search-result-item-teeOff"]}>11:56</span>
              <span className={styles["search-result-item-location"]}>Lake 6H</span>
              <button type="button" className={styles["search-result-item-detail-button"]} onClick={() => setStep(2)}>선택</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    }
    {step === 2 && (
      <BookingDetail 
        bookingData={null}
        onBack={() => setStep(1)}
      />
    )}
    {step === 3 && (
    <SendMessage
      groupedByCourse={[]}
      onBack={() => setStep(2)}
    />
    )}
    </>
  )
}

export default Search