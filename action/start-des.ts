"use server";

import des from "@/des_cipher/des";

const startDES = async (
  type: "en" | "de",
  binaryMessage: string,
  subKeys: string[]
) => {
  const des_en_result = des(type, binaryMessage, subKeys);
  return des_en_result;
};

export default startDES;
