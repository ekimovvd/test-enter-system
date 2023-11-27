export interface LogItemResponse {
  Timestamp: string;
  Level: string;
  Message: string;
  Source: string;
}

export interface LogItem {
  Id: string;
  Timestamp: MarkedText[];
  Level: MarkedText[];
  Message: MarkedText[];
  Source: MarkedText[];
}

export interface MarkedText {
  id: string;
  text: string;
  isHighlight: boolean;
}

export interface AuthParams {
  Token: string;
  Username: string;
}
