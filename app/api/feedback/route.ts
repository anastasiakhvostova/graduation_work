import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  const { message } = await req.json()

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.FEEDBACK_EMAIL,
      pass: process.env.FEEDBACK_EMAIL_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: `"Dialecto" <${process.env.FEEDBACK_EMAIL}>`,
    to: process.env.FEEDBACK_EMAIL,
    subject: "Dialecto — зворотний зв’язок",
    text: message,
  })

  return NextResponse.json({ success: true })
}