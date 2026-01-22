"use client"

import { useState } from "react"
import { Button } from "./ui/button"

export const Feedback = () => {
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<null | "success" | "error">(null)
  const [loading, setLoading] = useState(false)

  const sendFeedback = async () => {
    if (!message || !message.trim()) {
      setStatus("error")
      return
    }

    setLoading(true)
    setStatus(null)

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })

      if (!res.ok) throw new Error()

      setMessage("")
      setStatus("success")
    } catch {
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-2 rounded-xl p-4 space-y-4">
      <h3 className="font-bold text-lg">Зворотний зв’язок</h3>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Напишіть тут свій відгук, скаргу або пропозицію"
        className="w-full border rounded-lg p-3 text-sm min-h-[70px] resize-none"
      />

      <Button onClick={sendFeedback} className="w-full">
        Надіслати
      </Button>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Будь ласка, напишіть повідомлення
        </p>
      )}

      {status === "success" && (
        <p className="text-sm text-green-600">
          Дякуємо! Повідомлення надіслано 💛
        </p>
      )}
    </div>
  )
}


