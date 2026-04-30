// Alert component
import clsx from "clsx";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const variants = {
    success: "bg-green-50 text-green-700 border-green-200",
    error: "bg-red-50 text-red-700 border-red-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div
      className={clsx(
        "p-4 rounded-lg border flex items-start justify-between",
        variants[type],
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">{icons[type]}</span>
        <p>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-sm font-bold hover:opacity-70"
        >
          ✕
        </button>
      )}
    </div>
  );
};
