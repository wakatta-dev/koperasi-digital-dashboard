/** @format */

import { TESTIMONIAL } from "../constants";

export function TestimonialSection() {
  return (
    <section className="py-20 bg-blue-50/50 dark:bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Suara warga
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Pengalaman nyata dari masyarakat yang kami dampingi dan rasakan manfaatnya secara
              langsung.
            </p>
            <div className="flex gap-4 mt-8">
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-gray-900 dark:bg-white rounded-full" />
                <span className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <span className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <span className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <span className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 relative">
            <div className="flex items-center text-yellow-400 mb-4">
              <span className="material-icons-outlined text-sm">star</span>
              <span className="material-icons-outlined text-sm">star</span>
              <span className="material-icons-outlined text-sm">star</span>
              <span className="material-icons-outlined text-sm">star</span>
              <span className="material-icons-outlined text-sm">star</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg italic mb-8">
              &quot;{TESTIMONIAL.quote}&quot;
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={TESTIMONIAL.avatar}
                  alt={TESTIMONIAL.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{TESTIMONIAL.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{TESTIMONIAL.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <span className="material-icons-outlined text-gray-600 dark:text-gray-300">
                    arrow_back
                  </span>
                </button>
                <button className="w-10 h-10 border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <span className="material-icons-outlined text-gray-600 dark:text-gray-300">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
