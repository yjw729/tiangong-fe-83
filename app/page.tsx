"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const userType = localStorage.getItem("userType")

    if (userType === "admin") {
      router.push("/admin")
    } else if (userType === "user") {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">文件管理系统</h1>
        <p className="text-gray-600">正在跳转...</p>
      </div>
    </div>
  )
}
