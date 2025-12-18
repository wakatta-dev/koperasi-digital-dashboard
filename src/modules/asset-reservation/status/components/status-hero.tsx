/** @format */

type StatusHeroProps = {
  imageUrl: string;
  title: string;
};

export function StatusHero({ imageUrl, title }: StatusHeroProps) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
