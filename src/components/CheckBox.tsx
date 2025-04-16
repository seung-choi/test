import React from "react";
import PropTypes from "prop-types";
import styles from "@/styles/components/CheckBox.module.scss";

export const Checkbox = ({
  id,
  name = id,
  label,
  labelShow = true,
  reverse,
  size = "medium",
  disabled,
  ...props
}: CheckboxType) => {
  return (
    <div
      className={`checkbox ${styles["checkbox-wrap"]} ${reverse ? styles.reverse : ""}  ${size ? styles[size] : ""}`}
    >
      <input
        type="checkbox"
        className={`blind ${styles["checkbox-input"]}`}
        id={id}
        name={name}
        disabled={disabled}
        {...props}
      />
      <label className={`${styles["checkbox-label"]}`} htmlFor={id}>
        <span className={`${labelShow ? "" : styles["blind"]}`}>{label}</span>
      </label>
    </div>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  reverse: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  onClick: PropTypes.func,
};

interface CheckboxType {
  id: string;
  label: string;
  size?: string;
  name?: string;
  labelShow?: boolean;
  reverse?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (value?: any) => {} | void;
}
