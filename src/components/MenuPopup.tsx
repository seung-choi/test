"use client";

import styles from "@/styles/components/MenuPopup.module.scss";
import storage from "@/utils/storage";
import { useRouter } from "next/navigation";
import useAlertModal from "@/hooks/useAlertModal";
import { usePathname } from "next/navigation";
import {
  holecupMenuPopupState,
  menuPopupOpenState,
  themeModeState,
  monitoringViewState,
} from "@/lib/recoil";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import AutoFontSizeText from "@/components/AutoFontSizeText";
import CourseMapListType from "@/types/CourseMapListType";
import { menuState } from "@/lib/recoil";

const MenuPopup = ({ courseMap }: { courseMap?: CourseMapListType | null }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [open, setOpen] = useRecoilState(menuPopupOpenState);
  const setHolecupMenuPopupOpen = useSetRecoilState(holecupMenuPopupState);
  const [themeMode, setThemeMode] = useRecoilState(themeModeState);
  const [monitoringView, setMonitoringView] = useRecoilState(monitoringViewState);

  const { setAlertModalState } = useAlertModal();
  const path = usePathname();

  // recoil에서 메뉴 데이터 가져오기
  const menuCodes = useRecoilValue(menuState);

  // 테마 모드 토글 함수
  const handleThemeToggle = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    setAlertModalState(() => ({
      isShow: true,
      desc: t("menu.logoutConfirm"),
      okBtnLabel: t("alertModal.ok"),
      okCallback: () => {
        storage.local.clearExcept(["remember"]);
        setOpen(false);
        router.push("/login");
      },
    }));
  };

  return (
    <div className={`${styles["menu-container"]} ${open ? styles["open"] : ""}`}>
      <div
        className={styles["dim"]}
        onClick={() => {
          setOpen(!open);
        }}
      ></div>
      <div className={styles["menu-inner"]}>
        <div className={styles["user-info"]}>
          <div className={styles["user-info-left"]}>
            <span className={styles["user-team"]}>{`${storage.local.get("groupNm")}`}</span>
            <p className={styles["user-name"]}>
              {`${storage.local.get("userNm")}`} {t("menu.suffix")}
            </p>
          </div>
          <div>
            <button type="button" className={styles["theme-button"]} onClick={handleThemeToggle}>
              {themeMode === "light" ? "라이트 모드" : "다크 모드"}
            </button>
            <button type="button" className={styles["user-logout"]} onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </div>
        <div className={styles["menu-list-wrap"]}>
          <ul className={`${styles["menu-list"]} scroll-hidden`}>
            {/* 실시간 관제 메뉴 */}
            {menuCodes.includes("M_MONITORING") && (
              <li
                className={`${styles["menu-item"]}  ${monitoringView === "course" ? styles["active"] : ""}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    router.push("/monitoring");
                    setMonitoringView("course");
                    setOpen(false);
                  }}
                >
                  <AutoFontSizeText
                    text={t("monitoring.title")}
                    maxFontSize={15}
                    minFontSize={10}
                  />
                </button>
              </li>
            )}

            {/* 지도 관제 메뉴 */}
            {menuCodes.includes("M_MAPPING") && courseMap !== null && (
              <li
                className={`${styles["menu-item"]} ${monitoringView === "map" ? styles["active"] : ""}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    router.push("/monitoring");
                    setMonitoringView("map");
                    setOpen(false);
                  }}
                >
                  <AutoFontSizeText text="지도 관제" maxFontSize={15} minFontSize={10} />
                </button>
              </li>
            )}

            {/* 메시지 메뉴 */}
            {menuCodes.includes("M_SSE") && (
              <li
                className={`${styles["menu-item"]} ${path === "/message/" ? styles["active"] : ""}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    router.push("/message");
                    setOpen(false);
                  }}
                >
                  <AutoFontSizeText text="메세지" maxFontSize={15} minFontSize={10} />
                </button>
              </li>
            )}

            {/* 홀컵핀 메뉴 */}
            {menuCodes.includes("M_PIN") && (
              <li
                className={`${styles["menu-item"]} ${path === "/holecup/" ? styles["active"] : ""}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setHolecupMenuPopupOpen(true);
                    setOpen(false);
                  }}
                >
                  <AutoFontSizeText text="홀컵핀" maxFontSize={15} minFontSize={10} />
                </button>
              </li>
            )}

            {/* 검색 메뉴 */}
            {menuCodes.includes("M_DETAIL") && (
              <li
                className={`${styles["menu-item"]} ${path === "/search/" ? styles["active"] : ""}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    router.push("/search");
                    setOpen(false);
                  }}
                >
                  <AutoFontSizeText text="검색" maxFontSize={15} minFontSize={10} />
                </button>
              </li>
            )}

            {/* 긴급호출 목록 메뉴 */}
            {menuCodes.includes("M_SOS") && (
              <li
                className={`${styles["menu-item"]} ${path === "/sos-history/" ? styles["active"] : ""}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    router.push("/sos-history");
                    setOpen(false);
                  }}
                >
                  <AutoFontSizeText text="오늘 긴급호출 목록" maxFontSize={15} minFontSize={10} />
                </button>
              </li>
            )}
          </ul>
        </div>
        <button
          className={styles["close-button"]}
          onClick={() => {
            setOpen(false);
          }}
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  );
};

export default MenuPopup;
