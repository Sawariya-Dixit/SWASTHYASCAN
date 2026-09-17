export default function UrgentBanner({ message }) {
  return (
    <div className="flex items-start gap-3 bg-red-600 text-white rounded-xl p-4 mb-4 shadow-lg animate-pulse">
      <span className="text-2xl">🚨</span>
      <p className="font-semibold text-sm leading-snug">{message}</p>
    </div>
  );
}
