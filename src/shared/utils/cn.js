import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge убирает конфликтующие классы ("p-2 p-4" → "p-4").
// Наши стили текста (text-body, text-caption…) он сам не знает и принимает их
// за ЦВЕТ текста — тогда "text-caption text-faint" терял бы размер.
// Поэтому говорим ему: это группа «размер шрифта» (font-size).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: ["display", "hero", "title", "heading", "logo", "number", "subhead", "input", "body", "body-sm", "label", "caption", "small", "micro", "tiny"],
        },
      ],
    },
  },
});

export const cn = (...inputs) => {
    return twMerge(clsx(inputs));
};
