import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "navy" | "outline" | "outline-light";

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: Variant;
  small?: boolean;
  block?: boolean;
}

export function ButtonLink({ variant = "primary", small, block, children, ...rest }: ButtonLinkProps) {
  const cls = ["btn", `btn--${variant}`, small && "btn--sm", block && "btn--block"].filter(Boolean).join(" ");
  return (
    <Link className={cls} {...rest}>
      {children}
    </Link>
  );
}
