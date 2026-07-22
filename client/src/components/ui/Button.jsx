import clsx from "clsx";

const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700",
  secondary:
    "border border-neutral-300 text-neutral-800 hover:border-blue-400 hover:text-blue-600 dark:border-neutral-700 dark:text-neutral-200",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
