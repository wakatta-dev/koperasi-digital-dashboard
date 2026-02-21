/** @format */

export function TemplateOneStyles() {
  return (
    <style jsx global>{`
      .template-one {
        --color-primary: rgb(19, 91, 236);
        --color-primary-hover: rgb(15, 75, 196);
        --color-background-light: rgb(246, 246, 248);
        --color-background-dark: rgb(16, 22, 34);
        --color-surface-light: rgb(255, 255, 255);
        --color-surface-dark: rgb(26, 36, 54);
        --radius: 0.375rem;
        --radius-lg: 0.5rem;
        --radius-xl: 0.75rem;
        --radius-full: 9999px;
      }

      .template-one .font-display,
      .template-one .font-body {
        font-family: inherit;
      }

      .template-one .rounded {
        border-radius: var(--radius);
      }

      .template-one .rounded-lg {
        border-radius: var(--radius-lg);
      }

      .template-one .rounded-xl {
        border-radius: var(--radius-xl);
      }

      .template-one .rounded-full {
        border-radius: var(--radius-full);
      }

      .template-one .bg-primary {
        background-color: var(--color-primary) !important;
      }

      .template-one .text-primary {
        color: var(--color-primary) !important;
      }

      .template-one .bg-surface-light {
        background-color: var(--color-surface-light) !important;
      }

      .template-one .bg-surface-dark {
        background-color: var(--color-surface-dark) !important;
      }

      .template-one [class~="bg-primary/10"] {
        background-color: rgb(19 91 236 / 0.1);
      }

      .template-one [class~="from-primary/20"] {
        --tw-gradient-from: rgb(19 91 236 / 0.2) var(--tw-gradient-from-position);
        --tw-gradient-to: rgb(19 91 236 / 0) var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      }

      .template-one .bg-background-light {
        background-color: var(--color-background-light) !important;
      }

      .template-one .bg-background-dark {
        background-color: var(--color-background-dark) !important;
      }

      .template-one [class~="bg-background-dark/50"] {
        background-color: rgb(16 22 34 / 0.5);
      }

      .template-one [class~="bg-surface-light/95"] {
        background-color: rgb(255 255 255 / 0.95);
      }

      .template-one [class~="bg-surface-dark/95"] {
        background-color: rgb(26 36 54 / 0.95);
      }

      .template-one .bg-primary-hover {
        background-color: var(--color-primary-hover) !important;
      }

      .template-one .text-primary-hover {
        color: var(--color-primary-hover) !important;
      }

      .template-one [class~="hover:bg-primary"]:hover {
        background-color: var(--color-primary) !important;
      }

      .template-one [class~="hover:bg-primary-hover"]:hover {
        background-color: var(--color-primary-hover) !important;
      }

      .template-one [class~="hover:text-primary"]:hover {
        color: var(--color-primary) !important;
      }

      .template-one [class~="hover:text-primary-hover"]:hover {
        color: var(--color-primary-hover) !important;
      }

      .dark .template-one .dark\\:bg-background-dark {
        background-color: var(--color-background-dark) !important;
      }

      .dark .template-one .dark\\:bg-background-dark\\/50 {
        background-color: rgb(16 22 34 / 0.5) !important;
      }

      .dark .template-one .dark\\:bg-surface-dark {
        background-color: var(--color-surface-dark) !important;
      }

      .dark .template-one .dark\\:bg-surface-dark\\/95 {
        background-color: rgb(26 36 54 / 0.95) !important;
      }

      .dark .template-one .dark\\:hover\\:text-primary:hover {
        color: var(--color-primary) !important;
      }
    `}</style>
  );
}
