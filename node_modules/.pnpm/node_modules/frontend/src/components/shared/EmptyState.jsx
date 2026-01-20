export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 p-6 bg-gray-100 dark:bg-white/5 rounded-full">
        <Icon size={40} className="text-gray-400 dark:text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
        {description}
      </p>
    </div>
  );
}
