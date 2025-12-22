/** @format */

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function bumpCartTarget(target: HTMLElement) {
  target.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.12)" },
      { transform: "scale(1)" },
    ],
    { duration: 220, easing: "ease-in-out" }
  );
}

export function animateFlyToCart(sourceEl: HTMLElement | null, imageSrc?: string) {
  if (typeof window === "undefined" || !sourceEl) return;
  const target = document.querySelector<HTMLElement>('[data-cart-target="marketplace"]');
  if (!target) return;

  if (prefersReducedMotion) {
    bumpCartTarget(target);
    return;
  }

  const sourceRect = sourceEl.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const flyEl = document.createElement("div");
  const img = document.createElement("img");
  img.src = imageSrc || "https://via.placeholder.com/64x64?text=+";
  img.alt = "Add to cart";
  img.style.width = `${sourceRect.width}px`;
  img.style.height = `${sourceRect.height}px`;
  img.style.objectFit = "cover";
  img.style.borderRadius = "12px";

  flyEl.style.position = "fixed";
  flyEl.style.left = `${sourceRect.left}px`;
  flyEl.style.top = `${sourceRect.top}px`;
  flyEl.style.width = `${sourceRect.width}px`;
  flyEl.style.height = `${sourceRect.height}px`;
  flyEl.style.pointerEvents = "none";
  flyEl.style.zIndex = "9999";
  flyEl.appendChild(img);
  document.body.appendChild(flyEl);

  const translateX = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
  const translateY = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

  const animation = flyEl.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      { transform: `translate(${translateX}px, ${translateY}px) scale(0.2)`, opacity: 0.1 },
    ],
    { duration: 450, easing: "ease-in-out" }
  );

  animation.onfinish = () => {
    bumpCartTarget(target);
    flyEl.remove();
  };
}
