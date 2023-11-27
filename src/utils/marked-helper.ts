import { MarkedTextFactory } from "@/shared/factory";
import { MarkedText } from "@/shared/repo";

export function getMarkedText(text: string, search: string) {
  let index = 0;
  const markedTextParts: MarkedText[] = [];

  while (index < text.length) {
    const startIndex = text.toLowerCase().indexOf(search.toLowerCase(), index);

    if (startIndex === -1) {
      markedTextParts.push(
        MarkedTextFactory({
          text: text.substring(index),
        })
      );

      break;
    }

    if (startIndex > index) {
      markedTextParts.push(
        MarkedTextFactory({
          text: text.substring(index, startIndex),
        })
      );
    }

    const match = text.substring(startIndex, startIndex + search.length);

    markedTextParts.push(MarkedTextFactory({ text: match, isHighlight: true }));

    index = startIndex + search.length;
  }

  return markedTextParts;
}
