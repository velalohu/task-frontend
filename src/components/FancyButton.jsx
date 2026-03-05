export default function FancyButton({
  children,
  onClick,
  color = "green",
  className = "",
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
    red2: {
      base: "bg-red-500",
      hover: "hover:bg-red-600",
      shadowHover: "group-hover/xButton:bg-red-900"
    },
  };

  const sizeClasses = icon
    ? "w-11 h-11 p-0 flex items-center justify-center text-white [&>svg]:h-6 [&>svg]:w-6 [&>svg]:shrink-0"
    : "px-4 py-2 text-sm font-medium";


  return (
    <div className="relative inline-block self-end group/xButton">
      <span
        className={`
          absolute inset-0
          translate-x-1 translate-y-1
          rounded-lg
          scale-97
          transition-all
          ${styles[color].base}
          ${styles[color].shadowHover}
          group-hover/taskItem:scale-103   
          
        `}
      />

      <button
        type="button"
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`
          relative
          ${sizeClasses}
          rounded-lg bg-card
          translate-x-1 translate-y-1
          transition-all duration-150 ease-out
          hover:translate-x-0 hover:translate-y-0
          active:translate-x-1 active:translate-y-1
          
          ${styles[color].hover}
          ${className}

        `}
      >
        {children}
      </button>
    </div>
  );
}
