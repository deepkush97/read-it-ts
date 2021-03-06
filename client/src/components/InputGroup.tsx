import { FC } from "react";
import classNames from "classnames";

interface InputGroupProps {
  className?: string;
  type: string;
  placeholder: string;
  value: string;
  error: string | undefined;
  setValue: (str: string) => void;
}

const InputGroup: FC<InputGroupProps> = ({
  error,
  placeholder,
  setValue,
  type,
  value,
  className,
}) => {
  return (
    <div className={className}>
      <input
        type={type}
        className={classNames(
          "w-full p-3 transition duration-200 bg-white border border-gray-300 rounded outline-none focus:bg-white hover:bg-white",
          { "border-red-500": error }
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <small className="font-medium text-red-600">{error}</small>
    </div>
  );
};

export default InputGroup;
