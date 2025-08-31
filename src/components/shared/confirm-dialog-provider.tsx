"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import type { ConfirmDialogProps } from "@/components/shared/confirm-dialog"

// Code-split the dialog so it doesn't load on initial render
const LazyConfirmDialog = dynamic(
  () => import("@/components/shared/confirm-dialog"),
  { ssr: false, loading: () => null }
)

type ImperativeConfirmOptions = Omit<
  ConfirmDialogProps,
  "open" | "onOpenChange" | "onConfirm"
> & {
  // onConfirm di-hook ini akan resolve(true), gunakan options untuk label/teks
}

type ConfirmContextValue = {
  confirm: (options?: Partial<ImperativeConfirmOptions>) => Promise<boolean>
}

const ConfirmDialogContext = React.createContext<ConfirmContextValue | null>(
  null
)

export function useConfirm(): ConfirmContextValue["confirm"] {
  const ctx = React.useContext(ConfirmDialogContext)
  if (!ctx) throw new Error("useConfirm must be used within ConfirmDialogProvider")
  return ctx.confirm
}

export function ConfirmDialogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const resolverRef = React.useRef<((value: boolean) => void) | null>(null)
  const [options, setOptions] = React.useState<Partial<ImperativeConfirmOptions>>({
    variant: "default",
  })

  // Close handling resolves false if user dismisses via overlay/close
  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next && resolverRef.current) {
      resolverRef.current(false)
      resolverRef.current = null
    }
  }

  const confirm = React.useCallback(
    (opts?: Partial<ImperativeConfirmOptions>) => {
      // Prevent concurrent confirmations: resolve false and replace
      if (resolverRef.current) {
        resolverRef.current(false)
        resolverRef.current = null
      }

      setOptions((prev) => ({ ...prev, ...opts }))
      setOpen(true)

      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve
      })
    },
    []
  )

  const handleConfirm = async () => {
    const resolve = resolverRef.current
    resolverRef.current = null
    if (resolve) resolve(true)
    if (options.closeOnConfirm !== false) setOpen(false)
  }

  const ctxValue = React.useMemo<ConfirmContextValue>(() => ({ confirm }), [confirm])

  return (
    <ConfirmDialogContext.Provider value={ctxValue}>
      {children}
      {open ? (
        <LazyConfirmDialog
          open={open}
          onOpenChange={handleOpenChange}
          onConfirm={handleConfirm}
          variant={options.variant ?? "default"}
          title={options.title}
          description={options.description}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
          showCloseButton={options.showCloseButton}
          closeOnConfirm={options.closeOnConfirm}
        />
      ) : null}
    </ConfirmDialogContext.Provider>
  )
}
