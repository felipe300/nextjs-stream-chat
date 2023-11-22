import { ReactNode, useEffect, useState } from "react";

type DiseapearingMessageProps = {
  children: React.ReactNode;
  duration?: number;
  className?: string;
};

export default function DiseapearingMessage({
  children,
  duration = 3000,
  className,
}: DiseapearingMessageProps) {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timeout);
  }, [duration]);
  return (
    <div
      className={`${
        visible ? "opacity-100" : "opacity-0"
      } w-max transition-opacity duration-500 ${className}`}
    >
      {children}
    </div>
  );
}
