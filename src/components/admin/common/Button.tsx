import React from "react";
import PropTypes from "prop-types";
import styles from "@/styles/components/common/Button.module.scss";

export const Button = ({
  type = "submit",
  id,
  label,
  primary,
  disabled,
  readonly,
  size = "medium",
  block,
  ...props
}: ButtonType) => {
  return (
    <button
      type={type}
      className={`${styles["button"]}
                ${size !== "medium" ? styles[size] : ""}
                ${primary ? styles["primary"] : ""}
                ${block ? styles["block"] : ""}
            `}
      disabled={disabled}
      {...props}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit", "reset"]).isRequired,
  primary: PropTypes.bool,
  block: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

interface ButtonType {
  type: "button" | "submit" | "reset";
  label: string;
  size?: "small" | "medium" | "large";
  primary?: boolean;
  disabled?: boolean;
  readonly?: string;
  id?: string;
  block?: boolean;
  onClick?: (value?: any) => {} | void;
  style?: {};
}
