import { AlertCircle, CheckCircle2, X } from "lucide-react";

interface AlertProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

function Alert({ type, message, onClose }: AlertProps) {
  const config = {
    success: {
      containerClasses:
        "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-500/30",
      icon: (
        <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
      ),
      title: "Success",
      textClasses: "text-green-800 dark:text-green-300",
      closeButtonClasses:
        "text-green-600 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-900/50",
    },
    error: {
      containerClasses:
        "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-500/30",
      icon: <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />,
      title: "Error",
      textClasses: "text-red-800 dark:text-red-300",
      closeButtonClasses:
        "text-red-600 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900/50",
    },
  };

  const { containerClasses, icon, title, textClasses, closeButtonClasses } =
    config[type];

  return (
    <div
      className={`w-full rounded-lg border p-4 animate-in fade-in-0 ${containerClasses}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">{icon}</div>
        <div className={`ml-3 flex-1 ${textClasses}`}>
          <h3 className="text-sm font-semibold">{title}</h3>
          <div className="mt-1 text-sm">
            <p>{message}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`ml-3 p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current ${closeButtonClasses}`}
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}


export default Alert