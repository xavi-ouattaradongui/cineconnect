import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        placeholder="Rechercher un film..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none border border-white/20"
      />
    </form>
  );
}
