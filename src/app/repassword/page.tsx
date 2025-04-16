"use client";

import { FormEvent, useState } from "react";
import styles from "@/styles/pages/login/login.module.scss";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

const RePassword = () => {
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    password_recheck: "",
  });

  const handleChange = ({ target }: { target: HTMLInputElement }) => {
    let {
      name,
      value,
    }: {
      name: string;
      value: string | boolean;
      type: string;
    } = target;

    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
  };

  return (
    <div className="layout portrait">
      <h1 className={"blind"}>비밀번호 재설정</h1>
      <form className={styles["login-container"]} onSubmit={handleSubmit}>
        <h2 className={styles["login-title"]}>
          비밀번호를 <br />
          재설정 해주세요
        </h2>

        <div className={styles["login-top-wrap"]}>
          <div className={styles["login-helper-text"]}>
            새 비밀번호가 일치하지 않습니다. 확인 후 다시 입력해주세요.
          </div>
          <div className={styles["input-id"]}>
            <Input
              type="text"
              label="ID"
              labelShow={true}
              id="id"
              value={"id12345"}
              readOnly={true}
            />
            <span className={styles["input-id-value"]}>id12345</span>
          </div>
          <Input
            type="password"
            label="PW"
            labelShow={true}
            id="password"
            placeholder="새로운 비밀번호를 입력해주세요"
            onChange={handleChange}
            value={passwordForm.password}
          />

          <Input
            type="password"
            label="RePW"
            labelShow={false}
            id="password_recheck"
            placeholder="비밀번호를 확인해주세요"
            onChange={handleChange}
            value={passwordForm.password_recheck}
          />
        </div>
        <div className={styles["login-bottom-wrap"]}>
          <Button
            type="submit"
            label="비밀번호 재설정"
            block={true}
            primary={true}
            disabled={!passwordForm.password || !passwordForm.password_recheck}
          />
        </div>
      </form>
    </div>
  );
};

export default RePassword;
