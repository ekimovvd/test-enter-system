import { v4 } from "uuid";

export function getId(): string {
  return v4();
}
