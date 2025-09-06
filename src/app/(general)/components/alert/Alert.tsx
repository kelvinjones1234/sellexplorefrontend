import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

type AlertType = "info" | "success" | "error";
type AlertPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"; 

interface AlertProps {
  message: string;
  type?: AlertType;
  onClose?: () => void;
  duration?: number;
  closable?: boolean;
  position?: AlertPosition;
}

const Alert: React.FC<AlertProps> = ({
  message,
  type = "info",
  onClose,
  duration = 1000,
  closable = true,
  position = "top-right",
}) => {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const getColorClasses = (): string => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  const getPositionClasses = (): string => {
    switch (position) {
      case "top-left":
        return "top-[5rem] sm:top-[7.2rem] left-0";
      case "top-center":
        return "top-[5rem] sm:top-[7.2rem] left-1/2 -translate-x-1/2";
      case "top-right":
        return "top-[5rem] sm:top-[7.2rem] right-0";
      case "bottom-left":
        return "bottom-4 left-0";
      case "bottom-center":
        return "bottom-4 left-1/2 -translate-x-1/2";
      case "bottom-right":
        return "bottom-4 right-0";
      default:
        return "top-[5rem] sm:top-[7.2rem] right-0";
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
        .animate-in {
          animation: slideIn 0.3s ease-out;
        }
        .animate-out {
          animation: slideOut 0.3s ease-in;
        }
      `}</style>

      <div
        className={`fixed z-[1000] max-w-xs w-full ${getPositionClasses()} ${
          visible ? "animate-in" : "animate-out"
        }`}
        role="alert"
        aria-live="polite"
      >
        <div
          className={`py-2 px-3 sm:py-3 sm:px-4 rounded-lg border shadow-md ${getColorClasses()}`}
        >
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              {/* Smaller text on mobile, slightly larger on bigger screens */}
              <p className="text-xs sm:text-sm font-medium">{message}</p>
            </div>

            {closable && (
              <button
                onClick={() => {
                  setVisible(false);
                  if (onClose) onClose();
                }}
                className="flex-shrink-0 p-1 rounded hover:bg-black hover:bg-opacity-10"
                aria-label="Close alert"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Alert;
