/** @format */

export function TemplateTwoStyles() {
  return (
    <style jsx global>{`
      .template-two {
        --color-market-yellow: rgb(255, 217, 61);
        --color-market-orange: rgb(255, 132, 0);
        --color-market-red: rgb(255, 75, 145);
        --color-market-pink: rgb(255, 141, 199);
        --color-market-teal: rgb(0, 224, 255);
        --color-market-green: rgb(107, 203, 119);
        --color-market-blue: rgb(77, 150, 255);
        --color-warm-bg: rgb(255, 251, 235);
        --color-warm-card: rgb(255, 255, 255);
        --color-village-brown: rgb(93, 64, 55);
        --color-village-dark: rgb(62, 39, 35);
        --radius: 1rem;
        --radius-lg: 1.5rem;
        --radius-xl: 2.5rem;
        --radius-2xl: 3rem;
        --radius-3xl: 4rem;
        --radius-full: 9999px;
        background-color: var(--color-warm-bg);
        color: var(--color-village-brown);
      }

      .template-two .wavy-pattern {
        background-image: radial-gradient(rgb(255, 132, 0) 1.5px, transparent 1.5px), radial-gradient(rgb(255, 132, 0) 1.5px, rgb(255, 251, 235) 1.5px);
        background-size: 30px 30px;
        background-position: 0 0, 15px 15px;
        opacity: 0.1;
      }

      .template-two .btn-pop {
        transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .template-two .btn-pop:active {
        transform: scale(0.95);
      }

      .template-two .no-scrollbar {
        scrollbar-width: none;
      }

      .template-two .no-scrollbar::-webkit-scrollbar {
        display: none;
      }

      .template-two h1,
      .template-two h2,
      .template-two h3,
      .template-two h4,
      .template-two .font-display {
        font-family: var(--template-two-display-font, sans-serif);
      }

      .template-two .bg-warm-bg {
        background-color: var(--color-warm-bg);
      }

      .template-two .bg-village-dark {
        background-color: var(--color-village-dark);
      }

      .template-two .bg-market-yellow {
        background-color: var(--color-market-yellow);
      }

      .template-two .bg-market-orange {
        background-color: var(--color-market-orange);
      }

      .template-two .bg-market-red {
        background-color: var(--color-market-red);
      }

      .template-two .bg-market-pink {
        background-color: var(--color-market-pink);
      }

      .template-two .bg-market-teal {
        background-color: var(--color-market-teal);
      }

      .template-two .bg-market-green {
        background-color: var(--color-market-green);
      }

      .template-two .bg-market-blue {
        background-color: var(--color-market-blue);
      }

      .template-two [class~="bg-market-yellow/10"] {
        background-color: rgb(255 217 61 / 0.1);
      }

      .template-two [class~="bg-market-red/5"] {
        background-color: rgb(255 75 145 / 0.05);
      }

      .template-two [class~="bg-market-green/10"] {
        background-color: rgb(107 203 119 / 0.1);
      }

      .template-two [class~="bg-market-green/20"] {
        background-color: rgb(107 203 119 / 0.2);
      }

      .template-two [class~="bg-market-teal/20"] {
        background-color: rgb(0 224 255 / 0.2);
      }

      .template-two [class~="bg-market-blue/10"] {
        background-color: rgb(77 150 255 / 0.1);
      }

      .template-two [class~="bg-market-blue/20"] {
        background-color: rgb(77 150 255 / 0.2);
      }

      .template-two [class~="bg-market-orange/10"] {
        background-color: rgb(255 132 0 / 0.1);
      }

      .template-two [class~="bg-market-orange/20"] {
        background-color: rgb(255 132 0 / 0.2);
      }

      .template-two .text-village-dark {
        color: var(--color-village-dark);
      }

      .template-two .text-village-brown {
        color: var(--color-village-brown);
      }

      .template-two [class~="text-village-brown/80"] {
        color: rgb(93 64 55 / 0.8);
      }

      .template-two [class~="text-village-brown/70"] {
        color: rgb(93 64 55 / 0.7);
      }

      .template-two [class~="text-village-brown/60"] {
        color: rgb(93 64 55 / 0.6);
      }

      .template-two [class~="text-village-brown/50"] {
        color: rgb(93 64 55 / 0.5);
      }

      .template-two [class~="text-village-brown/20"] {
        color: rgb(93 64 55 / 0.2);
      }

      .template-two .text-market-yellow {
        color: var(--color-market-yellow);
      }

      .template-two .text-market-orange {
        color: var(--color-market-orange);
      }

      .template-two .text-market-red {
        color: var(--color-market-red);
      }

      .template-two .text-market-teal {
        color: var(--color-market-teal);
      }

      .template-two .text-market-green {
        color: var(--color-market-green);
      }

      .template-two .text-market-blue {
        color: var(--color-market-blue);
      }

      .template-two .border-village-dark {
        border-color: var(--color-village-dark);
      }

      .template-two [class~="border-village-dark/5"] {
        border-color: rgb(62 39 35 / 0.05);
      }

      .template-two [class~="border-village-brown/10"] {
        border-color: rgb(93 64 55 / 0.1);
      }

      .template-two .border-market-yellow {
        border-color: var(--color-market-yellow);
      }

      .template-two .border-market-orange {
        border-color: var(--color-market-orange);
      }

      .template-two .border-market-red {
        border-color: var(--color-market-red);
      }

      .template-two .border-market-blue {
        border-color: var(--color-market-blue);
      }

      .template-two .border-market-green {
        border-color: var(--color-market-green);
      }

      .template-two .border-r-market-yellow {
        border-right-color: var(--color-market-yellow);
      }

      .template-two .border-r-market-orange {
        border-right-color: var(--color-market-orange);
      }

      .template-two .border-r-market-red {
        border-right-color: var(--color-market-red);
      }

      .template-two .border-r-market-blue {
        border-right-color: var(--color-market-blue);
      }

      .template-two .border-r-market-green {
        border-right-color: var(--color-market-green);
      }

      .template-two .border-b-market-yellow {
        border-bottom-color: var(--color-market-yellow);
      }

      .template-two .border-b-market-orange {
        border-bottom-color: var(--color-market-orange);
      }

      .template-two .border-b-market-red {
        border-bottom-color: var(--color-market-red);
      }

      .template-two .border-b-market-blue {
        border-bottom-color: var(--color-market-blue);
      }

      .template-two .border-b-market-green {
        border-bottom-color: var(--color-market-green);
      }

      .template-two [class~="hover:text-market-red"]:hover {
        color: var(--color-market-red);
      }

      .template-two [class~="hover:bg-market-teal"]:hover {
        background-color: var(--color-market-teal);
      }

      .template-two [class~="hover:bg-market-red"]:hover {
        background-color: var(--color-market-red);
      }

      .template-two [class~="hover:bg-market-blue"]:hover {
        background-color: var(--color-market-blue);
      }

      .template-two [class~="hover:bg-market-blue/10"]:hover {
        background-color: rgb(77 150 255 / 0.1);
      }

      .template-two [class~="hover:bg-market-orange/10"]:hover {
        background-color: rgb(255 132 0 / 0.1);
      }

      .template-two [class~="hover:bg-market-green/10"]:hover {
        background-color: rgb(107 203 119 / 0.1);
      }

      .template-two [class~="hover:bg-market-red/10"]:hover {
        background-color: rgb(255 75 145 / 0.1);
      }

      .template-two [class~="hover:border-market-yellow"]:hover {
        border-color: var(--color-market-yellow);
      }

      .template-two [class~="hover:border-market-orange"]:hover {
        border-color: var(--color-market-orange);
      }

      .template-two [class~="hover:border-market-red"]:hover {
        border-color: var(--color-market-red);
      }

      .template-two [class~="hover:border-market-blue"]:hover {
        border-color: var(--color-market-blue);
      }

      .template-two [class~="hover:border-market-green"]:hover {
        border-color: var(--color-market-green);
      }

      .template-two .from-market-yellow {
        --tw-gradient-from: var(--color-market-yellow) var(--tw-gradient-from-position);
        --tw-gradient-to: rgb(255 217 61 / 0) var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      }

      .template-two .via-market-red {
        --tw-gradient-to: rgb(255 75 145 / 0) var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), var(--color-market-red) var(--tw-gradient-via-position), var(--tw-gradient-to);
      }

      .template-two .to-market-blue {
        --tw-gradient-to: var(--color-market-blue) var(--tw-gradient-to-position);
      }

      @keyframes template-two-marquee {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(-50%);
        }
      }

      .template-two .animate-marquee {
        animation: template-two-marquee 30s linear infinite;
      }
    `}</style>
  );
}
