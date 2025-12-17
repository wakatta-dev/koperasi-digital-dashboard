/** @format */

import { ADVANTAGES_LEFT, ADVANTAGES_RIGHT } from "../constants";

export function AdvantagesSection() {
  return (
    <section className="py-24 bg-white dark:bg-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 block">
            Keunggulan
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Mengapa memilih <br /> BUMDes kami
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Kami membangun fondasi kekuatan desa melalui pendekatan yang unik dan berkelanjutan
            untuk masa depan yang lebih baik.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="space-y-16">
            {ADVANTAGES_LEFT.map((item) => (
              <div
                key={item.title}
                className="text-center lg:text-right flex flex-col items-center lg:items-end"
              >
                <div className="w-12 h-12 rounded-full border-2 border-gray-900 dark:border-white flex items-center justify-center mb-4">
                  <span className="material-icons-outlined text-2xl text-gray-900 dark:text-white">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl relative order-first lg:order-none mb-10 lg:mb-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC8onBd71OyJVJWlZNfD5N4vq0KDkm2XXw6zNswGNnyjLsyE5kwMzTcxiQnESBTcqLGL4VZFCtGAuOrvfQX_8mxMxG65jnPFnQ4ZcvSs5VTqpS0fggQqNP4sEsCDB-iivBuicDPWydp5LQ7oTulsAOyYI99LM5eM_pWCaalRq3wOlaWQr1Lowuspy3b6RmT1FV2w22wKW234i0j6CTwmuuLjn08a9xnMjpEPz2NSHICPS5R69Q1v07DijrIgWp7sRP5dQd1oinWJU"
              alt="Jalan desa yang asri"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="space-y-16">
            {ADVANTAGES_RIGHT.map((item) => (
              <div
                key={item.title}
                className="text-center lg:text-left flex flex-col items-center lg:items-start"
              >
                <div className="w-12 h-12 rounded-full border-2 border-gray-900 dark:border-white flex items-center justify-center mb-4">
                  <span className="material-icons-outlined text-2xl text-gray-900 dark:text-white">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-16">
          <button className="px-6 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Pelajari
          </button>
          <button className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white hover:text-[#4338ca] transition">
            Detail <span className="material-icons-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
}
