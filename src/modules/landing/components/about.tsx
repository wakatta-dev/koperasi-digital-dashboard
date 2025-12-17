/** @format */

import { Button } from "@/components/ui/button";

export function LandingAbout() {
  return (
    <section className="py-20 bg-white dark:bg-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden shadow-2xl h-[500px]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHyPaZ8erVbFoU4S58vllFA8bICr8Fp9rNrW2i_T96ezq-vq_cdt2LemjA4lXhZIZk0WGckkouFcku0yrzjQeDj1rlUhqS7zH48xhLL5DU4d2CDR-oexRglR8VeiYkTmAXS5JOBcV6tVVpfMEos9euRJl810Mnuy0AznGwsirOu2GMPnQwBFVMyErzRHvUX7WoCcHWftBD4CNZ6q--GPsVTJGMIRZYO-Fz1NxI29o9_diYi834A3BaggXdt7q7wd5iNpBXFjaOgR0"
                alt="Pemandangan desa pegunungan"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#4338ca] rounded-full flex items-center justify-center text-white shadow-lg">
              <span className="material-icons-outlined text-4xl">landscape</span>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Tentang BUMDes kami
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Kami adalah lembaga yang berkomitmen menggerakkan potensi ekonomi desa sukamaju
                melalui unit usaha produktif dan berkelanjutan. Berdiri di atas asas gotong royong
                untuk kemandirian ekonomi.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Kekuatan bersama
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kami adalah mitra penggerak ekonomi desa yang lahir dari semangat kemandirian dan
                  gotong royong warga.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Visi kami</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Membangun desa yang mandiri, produktif, dan sejahtera melalui pengembangan potensi
                  lokal yang otentik.
                </p>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
              >
                Pelajari
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-[#4338ca] hover:text-[#3730a3] font-semibold px-4 py-2"
              >
                Detail <span className="material-icons-outlined text-sm">arrow_forward</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
