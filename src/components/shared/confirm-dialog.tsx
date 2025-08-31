"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckCircle2, Pencil, PlusCircle, Trash2 } from "lucide-react"

type ActionVariant = "create" | "edit" | "delete" | "default"

export type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  variant?: ActionVariant
  className?: string
  showCloseButton?: boolean
  closeOnConfirm?: boolean
}

const variantConfig: Record<
  ActionVariant,
  {
    icon: React.ElementType
    iconClass: string
    title: string
    description: string
    confirmText: string
    confirmVariant: React.ComponentProps<typeof Button>["variant"]
  }
> = {
  create: {
    icon: PlusCircle,
    iconClass:
      "text-green-600 dark:text-green-400 bg-green-600/10 border-green-600/20",
    title: "Buat data baru?",
    description: "Tindakan ini akan membuat data baru.",
    confirmText: "Buat",
    confirmVariant: "default",
  },
  edit: {
    icon: Pencil,
    iconClass:
      "text-blue-600 dark:text-blue-400 bg-blue-600/10 border-blue-600/20",
    title: "Simpan perubahan?",
    description: "Perubahan yang dibuat akan disimpan.",
    confirmText: "Simpan",
    confirmVariant: "default",
  },
  delete: {
    icon: Trash2,
    iconClass:
      "text-destructive bg-destructive/10 border-destructive/20 dark:text-destructive-foreground",
    title: "Hapus data?",
    description: "Tindakan ini tidak dapat dibatalkan.",
    confirmText: "Hapus",
    confirmVariant: "destructive",
  },
  default: {
    icon: CheckCircle2,
    iconClass:
      "text-primary bg-primary/10 border-primary/20 dark:text-primary",
    title: "Konfirmasi tindakan",
    description: "Apakah Anda yakin ingin melanjutkan?",
    confirmText: "Konfirmasi",
    confirmVariant: "default",
  },
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText = "Batal",
  onConfirm,
  variant = "default",
  className,
  showCloseButton = true,
  closeOnConfirm = true,
}: ConfirmDialogProps) {
  const [submitting, setSubmitting] = React.useState(false)

  const cfg = variantConfig[variant]
  const Icon = cfg.icon

  const handleConfirm = async () => {
    try {
      setSubmitting(true)
      await onConfirm()
      if (closeOnConfirm) onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-md", className)} showCloseButton={showCloseButton}>
        <DialogHeader>
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 inline-flex size-8 items-center justify-center rounded-md border",
                cfg.iconClass
              )}
            >
              <Icon className="size-5" />
            </span>
            <div className="space-y-1">
              <DialogTitle>{title ?? cfg.title}</DialogTitle>
              <DialogDescription>
                {description ?? cfg.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={cfg.confirmVariant}
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? "Memproses..." : confirmText ?? cfg.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

