"use server";

import generateSubKeys from "@/des_cipher/generate-subkeys";
import { hexToBinary } from "@/des_cipher/utils";

const generate_16_SubKeys = async (hexKey: string): Promise<string[]> => {
  const binaryKey = hexToBinary(hexKey);
  const subKeys = generateSubKeys(binaryKey);
  return subKeys;
};

export default generate_16_SubKeys;
