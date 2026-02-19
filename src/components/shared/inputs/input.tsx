"use client"

import * as React from "react"

import { Input as UiInput } from "@/components/ui/input"

function Input(props: React.ComponentProps<"input">) {
  return <UiInput {...props} />
}

export { Input }
