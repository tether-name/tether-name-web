import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

type SnackbarType = 'info' | 'success' | 'error';

interface SnackbarMessage {
  id: number;
  text: string;
  type: SnackbarType;
}

interface SnackbarContextValue {
  showSnackbar: (text: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextValue>({
  showSnackbar: () => {},
});

export function useSnackbar() {
  return useContext(SnackbarContext);
}

let nextId = 0;

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const showSnackbar = useCallback((text: string, type: SnackbarType = 'info') => {
    const id = ++nextId;
    setMessages((prev) => [...prev, { id, text, type }]);

    const timer = setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      timers.current.delete(id);
    }, 4000);
    timers.current.set(id, timer);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const dismiss = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  };

  const bgColor = (type: SnackbarType) => {
    switch (type) {
      case 'success': return 'bg-[#61d397]';
      case 'error': return 'bg-[#e74c3c]';
      default: return 'bg-[#444]';
    }
  };

  const textColor = (type: SnackbarType) => {
    switch (type) {
      case 'success': return 'text-[#1a1a1a]';
      case 'error': return 'text-white';
      default: return 'text-white';
    }
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      {/* Snackbar container — fixed at bottom center */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`pointer-events-auto ${bgColor(msg.type)} ${textColor(msg.type)} px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium max-w-md animate-snackbar-in`}
            role="alert"
          >
            <span className="flex-1">{msg.text}</span>
            <button
              onClick={() => dismiss(msg.id)}
              className={`${textColor(msg.type)} opacity-70 hover:opacity-100 transition-opacity text-lg leading-none`}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </SnackbarContext.Provider>
  );
}
