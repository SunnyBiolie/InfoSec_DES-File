// Convert from hexadecimal to binary
export const hexToBinary = (hexString: string) => {
  let result: string = "";
  hexString.split("").forEach((char) => {
    result += parseInt(char, 16).toString(2).padStart(4, "0");
  });
  return result;
};

// Convert from binary to hexadecimal
export const binaryToHex = (binText: string) => {
  const array = splitTo_n_charArr(binText, 4);

  let result: string = "";
  array.forEach((item) => {
    result += parseInt(item, 2).toString(16).toUpperCase();
  });
  return result;
};

/**
 * @param text
 * @param itemLength
 * @returns Mảng các ký tự được tách ra từ text với độ dài bằng itemLength
 * @example splitTo_n_charArr("12345678", 4) // return: ["1234", "5678"]
 */
export const splitTo_n_charArr = (text: string, itemLength: number) => {
  const array: string[] = [];
  let index: number = 0;
  let count: number = 1;
  text.split("").forEach((char) => {
    if (count > itemLength) {
      index++;
      count = 1;
    }

    if (count === 1) {
      array[index] = char;
    } else array[index] += char;

    count++;
  });

  return array;
};

/**
 * @description Hoán vị data theo bảng chỉ số table
 * @param {String} data Chuỗi dữ liệu kiểu nhị phân
 * @param {Number[]} table Bảng lưu chỉ số (index)
 */
export const permuteByConst = function (data: string, table: number[]) {
  return table.reduce((result: string, currValue: number) => {
    return result.concat(data[currValue - 1]);
  }, "");
};

export const get_XOR_binary = (bin_1: string, bin_2: string) => {
  let result = "";
  for (let i = 0; i < bin_1.length; i++) {
    if (bin_1[i] === bin_2[i]) {
      result += "0";
    } else result += "1";
  }

  return result;
};

// Kiểm tra chuỗi thập lục phân
export const isValidHex = (hex: string) => {
  const hexRegex = /^[0-9A-Fa-f]+$/;
  return hexRegex.test(hex);
};

// Tạo chuỗi thập lục phân
export const generateHexadecimalString = (length: number) => {
  const characters = "0123456789ABCDEF";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};
