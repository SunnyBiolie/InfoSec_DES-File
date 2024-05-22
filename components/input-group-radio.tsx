"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { InputRadio } from "./input-radio";

interface InputGroupRadioProps {
  items: ItemRadioProps[];
  name: string;
  defaultChecked: string;
  className?: string;
}

export type ItemRadioProps = {
  id?: string;
  value: string;
  label: string;
};

export const InputGroupRadio = ({
  items,
  name,
  defaultChecked,
  className,
}: InputGroupRadioProps) => {
  const [checkValue, setCheckValue] = useState<string>(defaultChecked);

  return (
    <div className={cn(className)}>
      {items.map((item, index) => (
        <InputRadio
          key={index}
          name={name}
          id={item.id}
          value={item.value}
          isChecked={item.value === checkValue}
          defaultChecked={item.value === defaultChecked}
          label={item.label}
          setCheckValue={setCheckValue}
        />
      ))}
    </div>
  );
};
