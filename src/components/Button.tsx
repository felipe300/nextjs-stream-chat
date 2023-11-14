import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps<T extends React.ElementType> = {
  as?: T;
};

export default function Button<T extends React.ElementType = "button">({
  as,
  ...props
}: ButtonProps<T> & Omit<ComponentPropsWithRef<T>, keyof ButtonProps<T>>) {
  const Component = as || "button";

  return (
    <Component
      {...props}
      className={twMerge(
        "disable:bg-gray-200 flex items-center justify-center gap-2 rounded bg-blue-500 p-[0.875rem] text-white hover:bg-blue-600 active:bg-blue-700 dark:disabled:bg-gray-600",
        props.className,
      )}
    />
  );
}
