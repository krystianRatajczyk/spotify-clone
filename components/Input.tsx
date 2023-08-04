import { InfoContext } from "@/context/InfoContext";
import React, { useContext } from "react";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

interface InputProps {
  type: string;
  placeholder: string;
  setstate?: React.Dispatch<React.SetStateAction<string>>;
  state?: string;
  icon?: IconType;
  iconObject?: { size: number; color: string; hoverColor: string };
  className?: string;
  isHover?: boolean;
  hoverClassName?: string;
  ref?: React.RefObject<HTMLInputElement>;
  onBlur?: () => void;
  onFocus?: () => void;
  value?: string;
  context?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { dispatch, state } = useContext(InfoContext);
  return (
    <React.Fragment>
      {props.icon && (
        <props.icon
          size={props.iconObject && props.iconObject.size}
          color={
            props.iconObject
              ? props.isHover
                ? props.iconObject.hoverColor
                : props.iconObject.color
              : ""
          }
        />
      )}
      <input
        {...props}
        ref={ref}
        onChange={(e) => {
          props.setstate && props.setstate(e.target.value);
          props.context &&
            dispatch({ type: "CHANGE_SEARCH", payload: e.target.value });
        }}
        value={props.context ? state.search : props.state}
        className={twMerge(
          "color-black bg-black rounded-xl px-5 py-3 text-lg outline-none",
          props.className
        )}
      />
    </React.Fragment>
  );
});

export default Input;
