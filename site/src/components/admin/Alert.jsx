import { AlertCircle } from 'lucide-react';

export default function Alert({ children }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
    >
      <AlertCircle size={16} className="shrink-0 mt-0.5" />
      <span>{children}</span>
    </p>
  );
}
