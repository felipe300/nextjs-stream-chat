import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";

const twConfig = resolveConfig(tailwindConfig);

export const mdBreakpoint = Number.parseInt(
  (twConfig.theme?.screens as any).md,
);
