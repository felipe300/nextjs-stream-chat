import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number = 250): T {
  const [deBounceValue, setdeBounceValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setdeBounceValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);
  return deBounceValue;
}
