import React from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export const ToastContainer: React.FC<{ toasts: ToastMessage[]; onDismiss: (id: string) => void }> = ({
  toasts,
  onDismiss,
}) => {
  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-5 py-3.5 border-2 shadow-[4px_4px_0_#7A0606] font-mono text-sm transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-obsidian border-emerald-500 text-emerald-400'
              : toast.type === 'error'
              ? 'bg-obsidian border-red-500 text-red-400'
              : 'bg-obsidian border-marigold text-smoke'
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-smoke/60 hover:text-smoke font-bold"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
