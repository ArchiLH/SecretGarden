type Props = {
  title: string;
  value: string;
  icon: string;
};

export default function StatCard({
  title,
  value,
  icon,
}: Props) {
  return (
    <div className="bg-slate-800 rounded-2xl p-4 shadow-lg">
      <div className="text-2xl mb-2">{icon}</div>

      <p className="text-slate-400 text-sm">
        {title}
      </p>

      <h2 className="text-2xl font-bold text-white">
        {value}
      </h2>
    </div>
  );
}