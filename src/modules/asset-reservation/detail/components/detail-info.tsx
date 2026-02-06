/** @format */

type DetailInfoProps = {
  title: string;
  price: string;
  unit: string;
  location: string;
};

export function DetailInfo({ title, price, unit, location }: DetailInfoProps) {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
          {title}
        </h1>
        <div className="text-right">
          <p className="text-2xl font-bold text-brand-primary">
            {price}
            <span className="text-base font-normal text-gray-500 dark:text-gray-400">{unit}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <span className="material-icons-outlined text-lg">location_on</span>
        <span className="text-sm">{location}</span>
      </div>
    </div>
  );
}
