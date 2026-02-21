/** @format */

export function TemplateThreeStyles() {
  return (
    <style jsx global>{`
      .template-three {
        --color-primary: rgb(40, 53, 147);
        --color-accent: rgb(251, 192, 45);
        --color-off-white: rgb(249, 248, 246);
        background-color: var(--color-off-white);
      }

      .template-three .bg-primary {
        background-color: var(--color-primary);
      }

      .template-three .text-primary {
        color: var(--color-primary);
      }

      .template-three .bg-accent {
        background-color: var(--color-accent);
      }

      .template-three .text-accent {
        color: var(--color-accent);
      }

      .template-three [class~="text-primary/5"] {
        color: rgb(40 53 147 / 0.05);
      }

      .template-three .bg-off-white {
        background-color: var(--color-off-white);
      }

      .template-three [class~="bg-off-white/90"] {
        background-color: rgb(249 248 246 / 0.9);
      }

      .template-three [class~="bg-accent/5"] {
        background-color: rgb(251 192 45 / 0.05);
      }

      .template-three [class~="bg-accent/10"] {
        background-color: rgb(251 192 45 / 0.1);
      }

      .template-three [class~="bg-accent/20"] {
        background-color: rgb(251 192 45 / 0.2);
      }

      .template-three [class~="border-accent/30"] {
        border-color: rgb(251 192 45 / 0.3);
      }

      .template-three [class~="shadow-accent/20"] {
        --tw-shadow-color: rgb(251 192 45 / 0.2);
      }

      .template-three [class~="hover:text-primary"]:hover {
        color: var(--color-primary);
      }

      .template-three [class~="hover:text-accent"]:hover {
        color: var(--color-accent);
      }

      .template-three h1,
      .template-three h2,
      .template-three h3 {
        font-family: var(--template-three-display-font, sans-serif);
      }

      .template-three .staggered-grid > div:nth-child(even) {
        margin-top: 3rem;
      }
    `}</style>
  );
}
