"use client";

import styles from "@/styles/pages/index.module.scss";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login/"); // 로그인 화면으로 이동
    }, 2000); // 2초 후에 실행

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [router]);

  return (
    <>
      <div className={styles["splash-container"]}>
        {/* <div className={styles["splash-bg"]}></div> */}
        {/* <div className={styles["splash-ribbon"]}> */}
        {/*<img src={"/assets/image/ribbon_01.svg"} alt={"리본 이미지 01"} />*/}
        {/*<img src={"/assets/image/ribbon_02.svg"} alt={"리본 이미지 02"} />*/}
        {/*<img src={"/assets/image/ribbon_03.svg"} alt={"리본 이미지 03"} />*/}
        {/* </div> */}
        {/* <div className={styles["splash-ball"]}></div> */}
        {/* <h1 className={styles["splash-txt"]}> */}
        {/* <p>V</p> */}
        {/* <p>Golf</p> */}
        {/* </h1> */}
        <img
          style={{ width: "100%", height: "100%" }}
          src={"/assets/image/img-splash.png"}
          alt={"스플래시 배경 이미지"}
        />
      </div>
    </>
  );
}
