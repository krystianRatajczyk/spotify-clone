import React from "react";

interface InputProps {
  type: string;
  placeholder: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  state: string;
}

const Input = ({ type, placeholder, setState, state }: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={(e) => {
        setState(e.target.value);
      }}
      value={state}
      className="color-black bg-black rounded-xl px-5 py-3  text-lg outline-none flex-1 overflow-hidden"
    />
  );
};

export default Input;
