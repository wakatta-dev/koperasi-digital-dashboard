# Module Repositories

Dokumen ini menjelaskan cara membuat repository terpisah untuk setiap modul yang tersedia di dalam direktori `internal/modules`.

## Cara Penggunaan Script

Sebuah script `scripts/create_module_repos.sh` telah disediakan. Script ini akan menyalin folder setiap modul ke dalam direktori `module-repos/<nama-modul>` dan menginisialisasi repository Git baru di sana. Struktur dasar modul yang disalin meliputi `handler/`, `usecase/`, `store/`, dan `plugin.go`.

```bash
bash scripts/create_module_repos.sh
```

Script dapat dijalankan pada mesin lokal setelah repository utama di-clone. Setiap modul akan memiliki repository baru dengan commit awal yang berisi kode modul tersebut.

Lihat juga [Ringkasan Usecase Modul](modules_usecase_overview.md) untuk gambaran fungsi pada setiap modul.


