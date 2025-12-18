/** @format */

type DetailDescriptionProps = {
  paragraphs: string[];
};

export function DetailDescription({ paragraphs }: DetailDescriptionProps) {
  return (
    <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Deskripsi Aset</h2>
      <div className="prose prose-indigo prose-sm sm:prose-base dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
