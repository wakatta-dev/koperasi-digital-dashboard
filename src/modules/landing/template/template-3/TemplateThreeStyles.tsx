/** @format */

export function TemplateThreeStyles() {
  return (
    <style jsx global>{`
      .template-three {
        --color-primary: rgb(40, 53, 147);
        --color-accent: rgb(251, 192, 45);
        --color-off-white: rgb(249, 248, 246);
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
