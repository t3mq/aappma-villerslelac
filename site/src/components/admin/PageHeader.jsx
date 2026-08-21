import { Plus } from 'lucide-react';

export default function PageHeader({ title, actionLabel, onAction, icon: Icon = Plus }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <h1 className="font-heading text-2xl font-semibold text-green-dark">{title}</h1>
      {actionLabel && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-4 py-2 bg-green-dark hover:bg-green-medium text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <Icon size={16} /> {actionLabel}
        </button>
      )}
    </div>
  );
}
