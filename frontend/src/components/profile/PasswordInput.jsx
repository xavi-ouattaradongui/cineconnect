import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function PasswordInput({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  hint,
  required = true 
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-500 block uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-10 py-2.5 text-sm text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-500 hover:text-black dark:hover:text-white transition"
          title={showPassword ? "Masquer" : "Afficher"}
        >
          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {hint && (
        <p className="text-xs text-gray-500 mt-1">
          {hint}
        </p>
      )}
    </div>
  );
}
