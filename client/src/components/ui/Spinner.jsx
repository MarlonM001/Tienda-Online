export default function Spinner({ className = "" }) {
  return (
    <div
      className={`h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-blue-600 ${className}`}
    />
  );
}
