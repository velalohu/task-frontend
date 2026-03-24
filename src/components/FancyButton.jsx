export default function FancyButton({
  children,
  onClick,
  color = "green",
  disabled = false,

  icon = false,
}) {
  const styles = {
    green: {
      base: "bg-green-500",
      hover: "hover:bg-green-400",
      shadowHover: "group-hover/xButton:bg-green-900"
    },
    yellow: {
      base: "bg-yellow-500",
      hover: "hover:bg-yellow-300",
      shadowHover: "group-hover/xButton:bg-yellow-900"
    },
    red: {
      base: "bg-red-500",
      hover: "hover:bg-red-600",
      shadowHover: "group-hover/xButton:bg-red-900"
    },
  };

  const sizeClasses = icon
    ? "w-11 h-11 flex items-center justify-center"
    : "px-4 py-2 text-sm font-medium";


  return (
    <div className="relative group/xButton">
      <span
        className={`
          absolute inset-0
          rounded-lg
          scale-97
          transition-all
          ${disabled ? "bg-gray-500" : styles[color].base}
          ${disabled ? "" : styles[color].shadowHover}
          ${disabled ? "" : "group-hover/taskItem:scale-103"}
          
        `}
      />

      <button
        type="button"
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`
          relative
          ${sizeClasses}
          rounded-lg ${disabled ? "bg-gray-700 text-gray-300 cursor-not-allowed" : "bg-card"}
          transition-all duration-150 ease-out
          ${disabled ? "" : "hover:translate-x-0 hover:translate-y-0"}
          ${disabled ? "" : "active:translate-x-1 active:translate-y-1"}
          ${disabled ? "" : styles[color].hover}
        `}
      >
        {children}
      </button>
    </div>
  );
}
