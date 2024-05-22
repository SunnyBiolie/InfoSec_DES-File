"use client";

import {
  type Dispatch,
  type ElementRef,
  type SetStateAction,
  useRef,
  useContext,
} from "react";
import { cn } from "@/lib/utils";
import { TypeContext } from "./form-des-file";

interface InputRadioProps {
  id?: string;
  name: string;
  value: string;
  isChecked: boolean;
  defaultChecked: boolean;
  label: string;
  setCheckValue: Dispatch<SetStateAction<string>>;
}

export const InputRadio = ({
  id,
  name,
  value,
  isChecked,
  defaultChecked = false,
  label,
  setCheckValue,
}: InputRadioProps) => {
  const setType = useContext(TypeContext);

  const ref = useRef<ElementRef<"input">>(null);
  return (
    <label className="flex size-fit items-center justify-center gap-x-1 cursor-pointer">
      <input
        id={id}
        ref={ref}
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        hidden
        onClick={() => {
          setCheckValue(value);
          setType(label);
        }}
      />
      <div
        className={cn(
          "size-4 rounded-full border-2 flex items-center justify-center",
          isChecked && "border-[#7f5af0]"
        )}
      >
        {isChecked && <p className="size-2 bg-[#7f5af0] rounded-full"></p>}
      </div>
      <span>{label}</span>
    </label>
  );
};
