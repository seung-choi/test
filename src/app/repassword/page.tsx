"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "@/styles/pages/login/login.module.scss";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import storage from "@/utils/storage";
import { useMutation } from "@tanstack/react-query";
import { patchPassword } from "@/api/main";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export interface PassWordFormAPI {
  newPwd: string;
}

const RePassword = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    password_recheck: "",
  });
  const [error, setError] = useState<string>("");
  const [passwordRecheckError, setPasswordRecheckError] = useState("");

  const { mutate: passwordMutate } = useMutation({
    mutationFn: patchPassword,
    onSuccess: () => {
      router.push("/admin/lounge");
    },
    onError: () => {
      setError("Error");
    },
  });

  const isSubmitDisabled = useMemo(() => {
    return (
      !passwordForm.password ||
      !passwordForm.password_recheck ||
      passwordForm.password !== passwordForm.password_recheck
    );
  }, [passwordForm]);

  const handleChange = ({ target }: { target: HTMLInputElement }) => {
    const { name, value } = target;

    // 공백 제거
    const trimmedValue = value.replace(/\s/g, "");

    setPasswordForm((prev) => ({ ...prev, [name]: trimmedValue }));

    if (name === "password") {
      if (passwordForm.password_recheck && trimmedValue !== passwordForm.password_recheck) {
        setPasswordRecheckError(t("rePassword.errorMessage"));
      } else {
        setPasswordRecheckError("");
      }
    }

    if (name === "password_recheck") {
      if (passwordForm.password !== trimmedValue) {
        setPasswordRecheckError(t("rePassword.errorMessage"));
      } else {
        setPasswordRecheckError("");
      }
    }
  };

  const handleClear = (name: string) => {
    setPasswordForm((prev) => ({ ...prev, [name]: "" }));
    if (name === "password_recheck") setPasswordRecheckError("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwordForm.password !== passwordForm.password_recheck) {
      setPasswordRecheckError(t("rePassword.errorMessage"));
      return;
    }

    passwordMutate({ newPwd: passwordForm.password });
  };

  return (
    <>
      <h1 className="blind">{t("rePassword.title")}</h1>
      <form className={styles["login-container"]} onSubmit={handleSubmit}>
        <h2 className={styles["login-title"]}>
          {t("rePassword.subtitle")
            .split("\n")
            .map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
        </h2>

        <div className={styles["login-top-wrap"]}>
          {error && <div className={styles["login-helper-text"]}>{t("login.errorMessage")}</div>}
          <div className={styles["input-id"]}>
            <Input
              type="text"
              label="ID"
              labelShow={true}
              id="id"
              value={`${storage.local.get("userId")}`}
              readOnly={true}
            />
            <span className={styles["input-id-value"]}>{`${storage.local.get("userId")}`}</span>
          </div>

          <Input
            type="password"
            label="PW"
            labelShow={true}
            id="password"
            placeholder={t("rePassword.passwordPlaceholder")}
            onChange={handleChange}
            value={passwordForm.password}
            onClear={() => handleClear("password")}
          />

          <Input
            type="password"
            label="RePW"
            labelShow={false}
            id="password_recheck"
            placeholder={t("rePassword.passwordRecheckPlaceholder")}
            onChange={handleChange}
            value={passwordForm.password_recheck}
            error={!!passwordRecheckError}
            textDescShow={passwordRecheckError ? "fail" : "null"}
            textDesc={passwordRecheckError}
            onClear={() => handleClear("password_recheck")}
          />
        </div>

        <div className={styles["login-bottom-wrap"]}>
          <Button
            type="submit"
            label={t("rePassword.submit")}
            block={true}
            primary={true}
            disabled={isSubmitDisabled}
          />
        </div>
      </form>
    </>
  );
};

export default RePassword;
