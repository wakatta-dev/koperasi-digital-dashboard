/** @format */

type SettingsSectionHeadingProps = {
  title: string;
  description: string;
};

export function SettingsSectionHeading({
  title,
  description,
}: SettingsSectionHeadingProps) {
  return (
    <div className="mb-8">
      <h1 className="mb-2 text-2xl font-bold text-foreground-primary dark:text-white">{title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}

