"use client"
import { forwardRef, useImperativeHandle, useState } from "react"

export type WriteChallengeRef = {
  getValue: () => string
  clear: () => void
}

type Props = {
  disabled?: boolean
  placeholder?: string
}

export const WriteChallenge = forwardRef<WriteChallengeRef, Props>(
  ({ disabled, placeholder }, ref) => {
    const [value, setValue] = useState("")

    useImperativeHandle(ref, () => ({
      getValue: () => value,
      clear: () => setValue("")
    }))

    return (
      <input
        type="text"
        className="border-2 rounded p-2 w-full"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
      />
    )
  }
)

WriteChallenge.displayName = "WriteChallenge"
