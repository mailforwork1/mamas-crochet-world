import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* Price formatting — Pakistani Rupees */
export const formatPrice = (n: number) =>
  "Rs " + Math.round(n).toLocaleString("en-PK");
