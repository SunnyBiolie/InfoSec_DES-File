import {
  table_e,
  table_ip,
  table_ipInverse,
  table_p,
  table_sBoxes,
} from "./index_tables";
import { get_XOR_binary, permuteByConst, splitTo_n_charArr } from "./utils";

export default function des(
  type: "en" | "de",
  binMessage: string,
  subKeys: string[]
) {
  // Tính hoán vị ip, 64-bit độ dài không đổi
  const ip_mess = permuteByConst(binMessage, table_ip);
  // Chia message đã hoán vị thành hai nửa, ban đầu sẽ là l0 và r0, gán thành p.tử hiện tại của hai mảng
  let curr_ln = ip_mess.slice(0, 32),
    curr_rn = ip_mess.slice(32);

  const arrLeft_n = [curr_ln];
  const arrRight_n = [curr_rn];

  switch (type) {
    case "en":
      subKeys.forEach((key) => {
        const temp_rn = curr_rn;
        // Thực hiện hàm f, 32-bit độ dài không đổi
        const binary_p = f(curr_rn, key);
        // XOR nửa trái với kết quả hàm f từ nửa phải --> nửa phải mới ở vòng lặp tiếp theo
        curr_rn = get_XOR_binary(curr_ln, binary_p);
        // Lưu nửa trái mới = nửa phải cũ
        curr_ln = temp_rn;

        arrLeft_n.push(curr_ln);
        arrRight_n.push(curr_rn);
      });
      break;
    case "de":
      // Tương tự với encrypt, chỉ đảo ngược vị trí các sub_key
      [...subKeys].reverse().forEach((key) => {
        const temp_rn = curr_rn;
        const binary_p = f(curr_rn, key);
        curr_rn = get_XOR_binary(curr_ln, binary_p);
        curr_ln = temp_rn;

        arrLeft_n.push(curr_ln);
        arrRight_n.push(curr_rn);
      });
      break;
  }

  // Tính hoán vị ipInverse (Lấy r16.concat(l16) để tính) 32-bit + 32-bit --> 64-bit
  const result = permuteByConst(curr_rn.concat(curr_ln), table_ipInverse);

  return { arrLeft_n, arrRight_n, result };
}

/**
 * @description Hàm xủ lý nửa phải của Message
 * @param binary_rn Nửa phải của message: 32-bit
 * @param binary_subkey Khóa con: 48-bit
 * @return String binary 32-bit
 */
const f = (binary_rn: string, binary_subkey: string) => {
  // Mở rộng nửa phải từ 32-bit --> 48-bit
  const rightExpanded = permuteByConst(binary_rn, table_e);

  // XOR nửa phải và khóa con
  const XOR_result = get_XOR_binary(rightExpanded, binary_subkey);
  // 48-bit chia thầy arr 8 phần tử, mỗi phần tử 6-bit
  const resultIn_6bit_arr = splitTo_n_charArr(XOR_result, 6);

  // Thế s-Box
  let sBox_result = "";
  resultIn_6bit_arr.forEach((binary_6bit, index) => {
    const first_last = binary_6bit[0] + binary_6bit[5];
    let row = 0;
    switch (first_last) {
      case "00":
        row = 0;
        break;
      case "01":
        row = 1;
        break;
      case "10":
        row = 2;
        break;
      case "11":
        row = 3;
        break;
    }

    const mid = binary_6bit.slice(1, 5);
    const col = parseInt(mid, 2);

    const decimalResult = table_sBoxes[index][row][col];
    // Chuyển kết quả sang nhị phân, 32-bit
    sBox_result += decimalResult.toString(2).padStart(4, "0");
  });

  // Tính hoán vị p, 32-bit độ dài không đổi
  const result = permuteByConst(sBox_result, table_p);

  return result;
};
