import React from "react";
import PropTypes from "prop-types";
import styles from "@/styles/components/Input.module.scss";

export const Input = ({
  type = "text",
  id,
  name = id,
  label,
  labelShow,
  labelColor,
  placeholder,
  required = false,
  inputSize = "medium",
  textDescShow = "null",
  textDesc,
  autoComplete = "off",
  error = false,
  onClear,
  ...props
}: InputType) => {
  return (
    <div
      className={`${styles["input-container"]} ${inputSize !== "medium" ? styles[inputSize] : ""} ${props.value && error ? styles["error"] : ""}`}
    >
      <label
        htmlFor={id}
        className={`${styles["input-label"]}
                ${labelColor ? styles[labelColor] : ""}
                ${labelShow ? "" : "blind"}`}
      >
        {label}
        {required && <span className={styles["input-required-point"]}>*</span>}
      </label>
      <div className={styles["input-wrap"]}>
        <input
          type={type}
          id={id}
          name={name}
          className={`${styles["input"]} ${props.value && styles["hasValue"]}`}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          {...props}
        />
        {props.value && (
          <button type="button" className={styles["input-clear-button"]} onClick={onClear}>
            <span className="blind">Clear text</span>
          </button>
        )}
      </div>
      {textDescShow !== "null" && (
        <div className={`${styles["input-text"]} ${styles[textDescShow]}`}>
          {textDesc}
        </div>
      )}
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  name: PropTypes.string,
  labelShow: PropTypes.bool,
  labelColor: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  inputSize: PropTypes.oneOf(["small", "medium", "large"]),
  textDescShow: PropTypes.oneOf(["null", "basic", "success", "fail"]),
  textDesc: PropTypes.string,
  autoComplete: PropTypes.string,
  error: PropTypes.bool,
  onClear:  PropTypes.func,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyUp: PropTypes.func,
  onCompositionStart: PropTypes.func,
  onCompositionEnd: PropTypes.func,
};

interface InputType {
  id: string;
  label: string;
  type?: string;
  name?: string;
  labelShow: boolean;
  labelColor?: string;
  placeholder?: string;
  value?: string | number | undefined;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  inputSize?: "small" | "medium" | "large";
  textDescShow?: "null" | "basic" | "success" | "fail";
  textDesc?: string;
  autoComplete?: string;
  error?: boolean;
  onClear?: (value?: any) => {} | void;
  onChange?: (value?: any) => {} | void;
  onBlur?: (value?: any) => {} | void;
  onKeyUp?: (value?: any) => {} | void;
  style?: {};
}
