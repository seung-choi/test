"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "@/styles/pages/login/login.module.scss";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/CheckBox";
import { useRouter } from "next/navigation";
import { postLogin } from "@/api/main";
import { useMutation } from "@tanstack/react-query";
import storage from "@/utils/storage";
import { useTranslation } from "react-i18next";

export interface LoginFormAPI {
  username: string;
  password: string;
  saveId: boolean;
}

const Login = () => {
  const { t } = useTranslation();
  const [loginForm, setLoginForm] = useState<LoginFormAPI>({
    username: "",
    password: "",
    saveId: false,
  });

  const [error, setError] = useState<boolean>(false);

  const router = useRouter();

  const { mutate: loginMutate } = useMutation({
    mutationFn: postLogin,
    onSuccess: (res) => {
      if(res.groupType === "ADMIN") {
        setError(true);
      } else {
        localStorage.removeItem("remember");
        if (loginForm.saveId) storage.local.set({ remember: loginForm.username });
        storage.session.set(res);
        res.initSt === "Y" ? router.push("/repassword") : router.push("/monitoring");
      }
    },
    onError: () => {
      setError(true);
    },
  });

  const handleChange = ({ target }: { target: HTMLInputElement }) => {
    let {
      name,
      value,
      type,
      checked,
    }: {
      name: string;
      value: string | boolean;
      type: string;
      checked: boolean;
    } = target;

    if (type === "checkbox") {
      value = checked;
    }

    setError(false);
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      username: loginForm.username,
      password: loginForm.password,
      saveId: loginForm.saveId,
    };

    loginMutate(data);
  };

  useEffect(() => {
    const remembered = storage.local.get("remember");
    if (remembered) {
      setLoginForm((prev) => ({
        ...prev,
        username: remembered.toString(),
        saveId: true,
      }));
    }
  }, []);

  return (
    <>
      <h1 className="blind">{t("login.title")}</h1>
      <form className={styles["login-container"]} onSubmit={handleSubmit}>
        <h2 className={styles["login-title"]}>
          {t("login.subtitle").split("\n").map((line, index) => (
            <span key={index}>
              {line}
            </span>
          ))}
        </h2>

        <div className={styles["login-top-wrap"]}>
          {error && (
            <div className={styles["login-helper-text"]}>
              {t("login.errorMessage")}
            </div>
          )}
          <Input
            label="ID"
            labelShow={true}
            id="username"
            placeholder={t("login.idPlaceholder")}
            error={error}
            onChange={handleChange}
            onClear={() => setLoginForm((prev) => ({ ...prev, username: "" }))}
            value={loginForm.username}
          />
          <Input
            label="PW"
            labelShow={true}
            id="password"
            type="password"
            placeholder={t("login.pwPlaceholder")}
            error={error}
            onChange={handleChange}
            onClear={() => setLoginForm((prev) => ({ ...prev, password: "" }))}
            value={loginForm.password}
          />
        </div>
        <div className={styles["login-bottom-wrap"]}>
          <Checkbox
            id="saveId"
            size="medium"
            label={t("login.saveId")}
            labelShow={true}
            checked={loginForm.saveId}
            onChange={handleChange}
          />
          <Button
            type="submit"
            label={t("login.submit")}
            block={true}
            primary={true}
            disabled={!loginForm.username || !loginForm.password}
          />
        </div>
      </form>
    </>
  );
};

export default Login;
