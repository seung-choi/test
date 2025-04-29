"use client";

import {FormEvent, useEffect, useState} from "react";
import styles from "@/styles/pages/login/login.module.scss";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/CheckBox";
import { useRouter } from "next/navigation";
import { postLogin } from "@/api/main";
import { useMutation } from "@tanstack/react-query";
import storage from "@/utils/storage";
import { useTranslation } from 'react-i18next';

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
      localStorage.removeItem("remember");
      if (loginForm.saveId) storage.local.set({ remember: loginForm.username });
      storage.session.set(res);
      res.initSt === "Y" ? router.push("/repassword") : router.push("/monitoring")
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
      saveId: loginForm.saveId, // 체크박스 상태 추가
    };

    loginMutate(data);
  };

  useEffect(() => {
    const remembered = storage.local.get("remember");
    if (remembered) {
      setLoginForm(prev => ({
        ...prev,
        username: remembered.toString(),
        saveId: true,
      }));
    }
  }, []);

  return (
    <div className="layout portrait">
      <h1 className={"blind"}>로그인</h1>
      <span className="blind"> {t('welcome')}</span>
      <form className={styles["login-container"]} onSubmit={handleSubmit}>
        <h2 className={styles["login-title"]}>
          아이디와 비밀번호를 <br />
          입력해주세요
        </h2>

        <div className={styles["login-top-wrap"]}>
          {error && (
            <div className={styles["login-helper-text"]}>
              아이디와 비밀번호를 확인하신 후 다시 입력해주세요.
            </div>
          )}
          <Input
            label="ID"
            labelShow={true}
            id="username"
            placeholder="아이디를 입력해주세요"
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
            placeholder="비밀번호를 입력해주세요"
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
            label="아이디 저장"
            labelShow={true}
            checked={loginForm.saveId}
            onChange={handleChange}
          />
          <Button
            type="submit"
            label="로그인"
            block={true}
            primary={true}
            disabled={!loginForm.username || !loginForm.password}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
