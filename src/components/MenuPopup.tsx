"use client";

import styles from "@/styles/components/MenuPopup.module.scss";
import storage from "@/utils/storage";
import { useRouter } from "next/navigation";
import useAlertModal from "@/hooks/useAlertModal";
import { usePathname } from "next/navigation";
import { holecupMenuPopupState, menuPopupOpenState, themeModeState } from "@/lib/recoil";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import AutoFontSizeText from "@/components/AutoFontSizeText";

const MenuPopup = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [open, setOpen] = useRecoilState(menuPopupOpenState);
  const setHolecupMenuPopupOpen = useSetRecoilState(holecupMenuPopupState);
  const [themeMode, setThemeMode] = useRecoilState(themeModeState);

  const { setAlertModalState } = useAlertModal();
  const path = usePathname();

  // 테마 모드 토글 함수
  const handleThemeToggle = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    setAlertModalState(() => ({
      isShow: true, 
      desc:  t("menu.logoutConfirm"),
      okBtnLabel: t("alertModal.ok"),
      okCallback: () => {
        storage.session.clear();
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
          <div>
            <span className={styles["user-team"]}>{`${storage.session.get("groupNm")}`}</span>
            <p className={styles["user-name"]}>{`${storage.session.get("userNm")}`} {t("menu.suffix")}</p>
          </div>
          <div>
            <button type="button" className={styles["theme-button"]} onClick={handleThemeToggle}>
              { themeMode === "light" ? "라이트 모드" : "다크 모드" }
            </button>
            <button type="button" className={styles["user-logout"]} onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </div>
        <div className={styles["menu-list-wrap"]}>
          <ul className={styles["menu-list"]}>
            <li className={`${styles["menu-item"]} ${styles["monitoring"]} ${path === "/monitoring/" ? styles["active"] : ""}`}>
              <button type="button" onClick={() => router.push("/monitoring")}>
                <AutoFontSizeText text={t("monitoring.title")} maxFontSize={15} minFontSize={10} />
              </button>
            </li>
            <li className={`${styles["menu-item"]} ${styles["map-view"]} ${path === "/mapView/" ? styles["active"] : ""}`}>
              <button type="button" onClick={() => router.push("/map-view")}>
                <AutoFontSizeText text="지도 관제" maxFontSize={15} minFontSize={10} />
              </button>
            </li>
            <li className={`${styles["menu-item"]} ${styles["holecup"]} ${path === "/mapView/" ? styles["active"] : ""}`}>
              <button type="button" onClick={() => setHolecupMenuPopupOpen(true)}>
                <AutoFontSizeText text="홀컵핀" maxFontSize={15} minFontSize={10} />
              </button>
            </li>
            <li className={`${styles["menu-item"]} ${styles["search"]} ${path === "/search/" ? styles["active"] : ""}`}>
              <button type="button" onClick={() => router.push("/search")}>
                <AutoFontSizeText text="검색" maxFontSize={15} minFontSize={10} />
              </button>
            </li>
            <li className={`${styles["menu-item"]} ${styles["sos-history"]} ${path === "/sos-history/" ? styles["active"] : ""}`}>
              <button type="button" onClick={() => router.push("/sos-history")}>
                <AutoFontSizeText text="오늘 긴급호출 목록" maxFontSize={15} minFontSize={10} />
              </button>
            </li>
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
