import { ComponentPropsWithoutRef } from "react";
import Button from "./Button";
import { LoadingIndicator } from "stream-chat-react";

type LoadingButtonProps = {
  loading: boolean;
} & ComponentPropsWithoutRef<"button">;

export default function LoadingButton({
  loading,
  ...props
}: LoadingButtonProps) {
  return (
    <Button {...props} disabled={loading}>
      {loading ? <LoadingIndicator /> : props.children}
    </Button>
  );
}
