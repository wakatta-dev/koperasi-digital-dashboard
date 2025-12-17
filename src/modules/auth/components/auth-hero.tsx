/** @format */

import { PanelsTopLeftIcon } from "lucide-react";
import {
  AUTH_BACKGROUND_IMAGE,
  AUTH_HEADLINE,
  AUTH_SUBHEAD,
} from "../constants";

export function AuthHero() {
  return (
    <div className="relative hidden w-full overflow-hidden bg-muted lg:flex lg:w-1/2">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${AUTH_BACKGROUND_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/65" />
      <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white xl:p-16">
        <div>
          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/90 shadow-lg ring-1 ring-white/10 backdrop-blur">
            <PanelsTopLeftIcon className="h-8 w-8" />
          </div>
          <h2 className="text-4xl font-bold leading-[1.1] tracking-tight xl:text-5xl">
            {AUTH_HEADLINE}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 xl:text-lg">
            {AUTH_SUBHEAD}
          </p>
        </div>
        <div className="mt-10 text-3xl font-bold tracking-tight">3Portals</div>
      </div>
    </div>
  );
}
