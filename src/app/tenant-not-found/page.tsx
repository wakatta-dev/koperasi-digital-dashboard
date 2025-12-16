/** @format */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TenantNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 text-3xl font-bold"
      >
        Organisasi tidak ditemukan
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 max-w-md text-muted-foreground"
      >
        Domain yang Anda akses belum terdaftar. Silakan hubungi administrator
        untuk informasi lebih lanjut.
      </motion.p>
      <Link href="/login">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-md bg-purple-600 px-6 py-2 text-white shadow"
        >
          Kembali ke Login
        </motion.button>
      </Link>
    </div>
  );
}
