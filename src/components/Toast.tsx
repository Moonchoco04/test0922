import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="flex items-center space-x-2 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-stone-800 text-xs font-medium">
        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
}
