"use client"

import * as React from "react"

import { Textarea as UiTextarea } from "@/components/ui/textarea"

function Textarea(props: React.ComponentProps<"textarea">) {
  return <UiTextarea {...props} />
}

export { Textarea }
