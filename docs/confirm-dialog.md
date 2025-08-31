# ConfirmDialog

Komponen dialog konfirmasi generik untuk aksi Buat/Edit/Hapus.

Lokasi: `src/components/shared/confirm-dialog.tsx`

## Props

- `open: boolean` — state buka/tutup.
- `onOpenChange(open: boolean)` — handler perubahan state.
- `onConfirm()` — callback saat tombol konfirmasi ditekan (mendukung async).
- `variant?: "create" | "edit" | "delete" | "default"` — gaya dan teks default.
- `title?: string` — judul kustom.
- `description?: string` — deskripsi kustom.
- `confirmText?: string` — label tombol konfirmasi.
- `cancelText?: string` — label tombol batal (default: "Batal").
- `showCloseButton?: boolean` — tampilkan tombol Close di pojok (default: true).
- `closeOnConfirm?: boolean` — otomatis tutup setelah konfirmasi (default: true).

## Contoh Penggunaan

```tsx
"use client"
import * as React from "react"
import ConfirmDialog from "@/components/shared/confirm-dialog"
import { Button } from "@/components/ui/button"

export default function Example() {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [openCreate, setOpenCreate] = React.useState(false)

  return (
    <div className="flex gap-2">
      <Button variant="destructive" onClick={() => setOpenDelete(true)}>
        Hapus Item
      </Button>

      <Button onClick={() => setOpenCreate(true)}>Buat Data</Button>

      <ConfirmDialog
        variant="delete"
        open={openDelete}
        onOpenChange={setOpenDelete}
        description="Item akan dihapus permanen."
        onConfirm={async () => {
          // panggil API hapus
          await new Promise((r) => setTimeout(r, 600))
        }}
      />

      <ConfirmDialog
        variant="create"
        open={openCreate}
        onOpenChange={setOpenCreate}
        title="Buat data anggota?"
        description="Data dapat diubah setelah dibuat."
        confirmText="Buat Sekarang"
        onConfirm={async () => {
          // panggil API create
          await new Promise((r) => setTimeout(r, 600))
        }}
      />
    </div>
  )
}
```

## Pemakaian Imperatif (tanpa state lokal)

Provider: sudah dipasang di `src/app/layout.tsx:1` sebagai `ConfirmDialogProvider`.

Hook: `useConfirm` tersedia di `src/hooks/use-confirm.ts:1`

```tsx
"use client"
import { Button } from "@/components/ui/button"
import { useConfirm } from "@/hooks/use-confirm"

export default function ImperativeExample() {
  const confirm = useConfirm()

  const handleDelete = async () => {
    const ok = await confirm({
      variant: "delete",
      title: "Hapus data ini?",
      description: "Tindakan ini tidak dapat dibatalkan.",
      confirmText: "Hapus",
    })
    if (!ok) return
    // Lanjutkan panggilan API hapus
  }

  const handleCreate = async () => {
    const ok = await confirm({
      variant: "create",
      title: "Buat data anggota?",
      description: "Anda dapat mengubah data setelah dibuat.",
      confirmText: "Buat",
    })
    if (!ok) return
    // Lanjutkan panggilan API create
  }

  return (
    <div className="flex gap-2">
      <Button onClick={handleCreate}>Buat</Button>
      <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
    </div>
  )
}
```

Catatan performa:
- Dialog di-load via dynamic import saat pertama dipakai (code-splitting) sehingga tidak menambah bundle awal.
- Provider hanya menyimpan state kecil dan merender dialog conditionally saat `open = true`.
