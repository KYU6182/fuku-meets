import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type BaseProps = {
  children: ReactNode;
  variant?: "red" | "black" | "outline" | "light";
  className?: string;
};

type ButtonProps =
  | (BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  | (BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined });

function variantClass(variant: BaseProps["variant"] = "red") {
  if (variant === "black") return "bg-fuku-black text-white";
  if (variant === "outline") return "border border-fuku-red bg-white text-fuku-red";
  if (variant === "light") return "border border-fuku-border bg-white text-fuku-black";
  return "bg-fuku-red text-white";
}

export default function Button(props: ButtonProps) {
  const { children, variant, className = "" } = props;
  const classes = `inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 text-[13px] font-black ${variantClass(
    variant,
  )} ${className}`;

  if ("href" in props && props.href) {
    const { href, children: _children, variant: _variant, className: _className, ...rest } = props;
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  const { children: _children, variant: _variant, className: _className, ...buttonProps } =
    props as BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={buttonProps.type ?? "button"} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
