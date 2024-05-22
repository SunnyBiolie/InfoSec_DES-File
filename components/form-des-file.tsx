import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  MouseEvent,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { Loading } from "./loading";
import { InputGroupRadio, ItemRadioProps } from "./input-group-radio";
import desWithFile from "@/des_cipher/des-with-file";
import { generateHexadecimalString, isValidHex } from "@/des_cipher/utils";
import { cn } from "@/lib/utils";

const inputRadios: ItemRadioProps[] = [
  {
    value: "en",
    label: "Encrypt",
  },
  {
    value: "de",
    label: "Decrypt",
  },
];

let temp: any;

export const TypeContext = createContext(
  temp as Dispatch<SetStateAction<string>>
);

export const FormDESFile = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [key, setKey] = useState<string>("");
  const [type, setType] = useState<string>(inputRadios[0].label);
  const [fileError, setFileError] = useState<string | null>(null);
  const [keyError, setKeyError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const file = formData.get("file") as File;
      const key = formData.get("key") as string;
      const type = formData.get("type") as "en" | "de";

      if (!file || file.size === 0) {
        return setFileError("Không có tệp tin nào được chọn!");
      }

      if (!key || key.length !== 16) {
        return setKeyError("Khóa phải có độ dài 16 ký tự!");
      }

      if (!isValidHex(key)) {
        return setKeyError("Khóa có ký tự không thuộc thập lục phân!");
      }

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const { error, success } = desWithFile(type, Array.from(uint8Array), key);

      if (error) console.error(error.message);
      else if (success) {
        console.log(success.result);
        const uint8Array = Uint8Array.from(success.result);

        const name = file.name.split(".").shift();
        const extension = file.name.split(".").pop();
        downloadFile(uint8Array.buffer, `${name}.${type}crypted.${extension}`);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const file = e.currentTarget.files[0];
      if (file) {
        setFileError(null);
      }
    }
  };

  const onKeyChange = (e: FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.toUpperCase();
    const key = e.currentTarget.value;
    setKey(key);
    if (key.length === 16) {
      setKeyError(null);
      if (isValidHex(key)) setKeyError(null);
    }
  };

  const downloadFile = (arrayBuffer: ArrayBuffer, fileName: string) => {
    const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.click();
    window.URL.revokeObjectURL(url);
  };

  const generateRandKey = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    const randKey = generateHexadecimalString(16);
    setKey(randKey);
  };

  return (
    <TypeContext.Provider value={setType}>
      <div className="fixed top-0 left-0 size-full flex flex-col items-center justify-center gap-y-4 bg-slate-900/50 z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#16161a] rounded-lg px-6 py-8 space-y-6 shadow-md z-10">
        <h1 className="text-center font-medium text-xl text-[#fffffe]">
          DES - FILE
        </h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-y-4 z-10">
          <input
            type="file"
            name="file"
            className="file:bg-[#e5e5e5] file:text-[#0f0e17] file:border-none file:p-2 file:rounded-sm file:text-sm cursor-pointer file:cursor-pointer"
            onChange={(e) => onFileChange(e)}
          />
          <div className="flex items-center">
            <input
              value={key}
              name="key"
              placeholder="Khóa thập lục phân"
              className={cn(
                "flex-1 p-2 rounded-md bg-transparent border border-[#e5e5e5] focus:outline-0"
              )}
              maxLength={16}
              onInput={(e) => onKeyChange(e)}
            />
            <button
              className="size-10 p-2 ml-1 hover:text-[#7f5af0] transition"
              onClick={(e) => generateRandKey(e)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
            </button>
          </div>

          <InputGroupRadio
            items={inputRadios}
            name="type"
            defaultChecked={inputRadios[0].value}
            className="flex gap-x-8 mb-2"
          />

          {(fileError || keyError) && (
            <div className="bg-red-500 text-white text-sm p-3 rounded-md flex items-center gap-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-triangle-alert"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
              {fileError || keyError}
            </div>
          )}

          <button
            type="submit"
            className="mt-2 bg-[#7f5af0] text-[#fffffe] p-2 rounded-md"
          >
            {type} it!
          </button>
        </form>
      </div>
      {isLoading && <Loading />}
    </TypeContext.Provider>
  );
};
