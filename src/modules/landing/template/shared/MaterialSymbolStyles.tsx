/** @format */

export function MaterialSymbolStyles() {
  return (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");

      .template-one .material-symbols-outlined,
      .template-two .material-symbols-outlined,
      .template-three .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        line-height: 1;
      }
    `}</style>
  );
}
