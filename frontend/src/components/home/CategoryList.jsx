export default function CategoryList({ categories, onSelect }) {
  return (
    <div className="flex gap-4 overflow-x-auto py-4 hide-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-sm whitespace-nowrap border border-white/10"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
