import { table_leftShifts, table_pc1, table_pc2 } from "./index_tables";
import { binaryToHex, hexToBinary, permuteByConst } from "./utils";

/**
 * Khởi tạo 16 sub_key từ key được cho
 * @param {String} binKey Yêu cầu giá trị nhị phân
 * @returns {String[]} Mảng kết quả gồm 16 sub_key ở giá trị nhị phân
 */
export default function generateSubKeys(binKey: string): string[] {
  // B1: Tính hoán vị pc1, 64-bit --> 56-bit
  const pc1_key = permuteByConst(binKey, table_pc1);
  // B2: Chia hai nửa
  let left = pc1_key.slice(0, 28);
  let right = pc1_key.slice(28);

  const subKeys: string[] = [];

  for (let i = 0; i < 16; i++) {
    // B3: Dịch vòng trái hai nửa
    left = left.slice(table_leftShifts[i]) + left.slice(0, table_leftShifts[i]);
    right =
      right.slice(table_leftShifts[i]) + right.slice(0, table_leftShifts[i]);
    // B4: Tính hoán vị pc2, 56-bit --> 48-bit
    const sub_key = permuteByConst(left + right, table_pc2);
    subKeys.push(sub_key);
  }

  return subKeys;
}
