import { Dispatch, SetStateAction } from "react";
import des from "./des";
import generateSubKeys from "./generate-subkeys";
import { binaryToHex, hexToBinary } from "./utils";

// Nếu dùng trong "use server", các tham số được truyền vào hay các giá trị trả về nếu là kiểu Uint8Array thì khi nhận được cũng chỉ là một number[], cần phải chuyển đổi trước khi sử dụng
/**
 * @param type "en" | "de"
 * @param array
 * @param key
 * @returns
 */
const desWithFile = (type: "en" | "de", array: number[], key: string) => {
  const originalLength = array.length;

  if (originalLength < 16) {
    return { error: { message: "This is not long enough" } };
  }

  if (type === "en") {
    // Kiểm tra xem block cuối có đủ 8-byte hay không
    const resLength = originalLength % 8;
    let padEnd: number[] = [];
    // Tạo một array cho các byte không đủ
    if (resLength !== 0) {
      for (let i = 0; i < 8 - resLength; i++) {
        padEnd.push(0);
      }
    }
    // Thêm vào cho đủ 8-byte tất cả các block
    const paddedArray = array.concat(padEnd);

    const subKeys = generateSubKeys(hexToBinary(key));
    let desResArr = [];
    for (let i = 0; i < paddedArray.length; i += 8) {
      let binaryMessage = "";
      // Gộp 8-byte thành một message - tương đương 64-bit
      for (let j = i; j < i + 8; j++) {
        binaryMessage += paddedArray[j].toString(2).padStart(8, "0");
      }
      const { result } = des(type, binaryMessage, subKeys);

      // Tách từng phần 8-bit, chuyển sang mã ascii | 64-bit --> 8-byte
      for (let k = 0; k < 8; k++) {
        const binaryValue = result.slice(8 * k, 8 * k + 8);
        const asciiCode = parseInt(binaryValue, 2);
        desResArr.push(asciiCode);
      }
    }

    // Cấu trúc của config: [ pad-length, "D", "e", "S" ]
    const config = [padEnd.length, 68, 101, 83];
    // Thêm config vào cuối kết quả mã hóa để dùng cho giải mã
    const encryptResult = desResArr.concat(config);

    return {
      success: {
        result: encryptResult,
      },
    };
  } else {
    const config = array.splice(array.length - 4);

    if (
      config[0] < 0 ||
      config[0] >= 8 ||
      config[1] !== 68 ||
      config[2] !== 101 ||
      config[3] !== 83 ||
      array.length % 8 !== 0
    ) {
      return {
        error: {
          message:
            "Đây không phải file đã được mã hóa hoặc file đã bị thay đổi!",
        },
      };
    }

    const subKeys = generateSubKeys(hexToBinary(key));
    let desResArr = [];
    for (let i = 0; i < array.length; i += 8) {
      let binaryMessage = "";
      // Gộp 8-byte thành một message - tương đương 64-bit
      for (let j = i; j < i + 8; j++) {
        binaryMessage += array[j].toString(2).padStart(8, "0");
      }
      const { result } = des(type, binaryMessage, subKeys);

      // Tách từng phần 8-bit, chuyển sang mã ascii | 64-bit --> 8-byte
      for (let k = 0; k < 8; k++) {
        const binaryValue = result.slice(8 * k, 8 * k + 8);
        const asciiCode = parseInt(binaryValue, 2);
        desResArr.push(asciiCode);
      }
    }

    const descryptResult = desResArr.toSpliced(desResArr.length - config[0]);

    return {
      success: { result: descryptResult },
    };
  }
};

export default desWithFile;
