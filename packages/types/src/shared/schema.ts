

import { sharedEnums } from "./shared.enums.js";

export const boolean = sharedEnums
  .optional()
  .transform((v) => v === 'true');
