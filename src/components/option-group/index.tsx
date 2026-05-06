const cardClassName =
  "rounded-2xl bg-white/5 p-5 ring-1 ring-white/8 backdrop-blur";

type OptionGroupProps = {
  title: string;
  options: string[];
  value: string;
  onSelect: (option: string) => void;
};

export const OptionGroup = ({ title, options, value, onSelect }: OptionGroupProps) => {
  return (
    <section className={cardClassName}>
      <h2 className="text-lg font-semibold text-(--text-strong)">{title}</h2>

      <div className="mt-4 flex flex-wrap gap-3">
        {options.map((option) => {
          const isActive = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm transition ${
                isActive
                  ? "bg-(--primary) text-slate-950"
                  : "bg-white/6 text-(--text-strong) hover:bg-white/10"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
};
