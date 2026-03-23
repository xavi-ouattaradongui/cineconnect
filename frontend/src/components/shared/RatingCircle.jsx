export default function RatingCircle({ rating }) {
  const numericRating = Number.parseFloat(rating);
  const hasRating = Number.isFinite(numericRating) && numericRating > 0;
  const value = hasRating ? Math.round((numericRating / 10) * 100) : 0;

  return (
    <div className="relative w-14 h-14">
      {/* Cercle background */}
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="28"
          cy="28"
          r="25"
          stroke="gray"
          strokeWidth="4"
          fill="none"
          className="opacity-20"
        />
        {/* Cercle progress */}
        <circle
          cx="28"
          cy="28"
          r="25"
          stroke="lime"
          strokeWidth="4"
          fill="none"
          strokeDasharray="157"
          strokeDashoffset={157 - (157 * value) / 100}
        />
      </svg>

      {/* Texte */}
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
        {hasRating ? rating : "-"}
      </div>
    </div>
  );
}
