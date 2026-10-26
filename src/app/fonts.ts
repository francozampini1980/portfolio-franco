import { Merriweather, Plus_Jakarta_Sans } from "next/font/google";

export const serif = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

export const sans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const fontVars = `${serif.variable} ${sans.variable}`;
