import { getId } from "@/utils/uuid-helper";

import { AuthParams, MarkedText } from "./repo";

export const MarkedTextFactory = (
  params: Partial<MarkedText> = {}
): MarkedText => {
  return {
    id: getId(),
    text: "",
    isHighlight: false,
    ...params,
  };
};

export const AuthFactory = (params: Partial<AuthParams> = {}): AuthParams => {
  return {
    Token: "",
    Username: "",
    ...params,
  };
};
