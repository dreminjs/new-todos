import { randomInt } from "node:crypto";

export const generateSixDigitsCode = () => {
  return randomInt(100000, 1000000).toString();
};
