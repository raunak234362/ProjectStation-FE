/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import React, { useId, useState } from "react";
import { Input as InputField } from "@material-tailwind/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import JoditEditor from "jodit-react";

function Input(
  { label, type = "text", className, variant, value, onChange, ...props },
  ref
) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const joditConfig = {
    height: 100,
    width: "100%",
    placeholder: label,
    // Add other Jodit configuration options as needed
  };

  return (
    <div className="w-full items-center">
      {type === "textarea" ? (
        <JoditEditor
          ref={ref}
          value={value}
          config={joditConfig}
          onChange={
            onChange
              ? (newContent) => onChange({ target: { value: newContent } })
              : undefined
          }
          className={`rounded-lg bg-white text-gray-700 focus:bg-slate-300 focus:bg-opacity-60 duration-200 ${className}`}
          {...props}
        />
      ) : (
        <div className="relative w-full">
          <InputField
            variant={variant}
            label={label}
            type={showPassword && type === "password" ? "text" : type}
            className={`px-3 py-1 w-full rounded-lg bg-white text-gray-700 focus:bg-slate-300 focus:bg-opacity-60 duration-200 ${className}`}
            ref={ref}
            placeholder={label}
            value={value}
            onChange={onChange}
            {...props}
            id={id}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded"
            >
              {showPassword ? (
                <FiEye className="text-black" />
              ) : (
                <FiEyeOff className="text-black" />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default React.forwardRef(Input);
