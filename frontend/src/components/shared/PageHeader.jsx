export default function PageHeader({ icon: Icon, title, count }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
      <div className="flex items-center gap-3">
        <Icon size={24} className="text-black dark:text-white" />
        <h1 className="text-2xl font-bold text-black dark:text-white">
          {title}
        </h1>
      </div>
      {count !== undefined && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {count} film{count > 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}
