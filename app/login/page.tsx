"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [userCredentials, setUserCredentials] = useState({ username: "", password: "" })
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // 模拟登录验证
    if (userCredentials.username === "user" && userCredentials.password === "password") {
      localStorage.setItem("userType", "user")
      localStorage.setItem("username", userCredentials.username)
      router.push("/dashboard")
    } else {
      setError("用户名或密码错误")
    }
    setLoading(false)
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // 模拟管理员登录验证
    if (adminCredentials.username === "admin" && adminCredentials.password === "admin123") {
      localStorage.setItem("userType", "admin")
      localStorage.setItem("username", adminCredentials.username)
      router.push("/admin")
    } else {
      setError("管理员用户名或密码错误")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">文件管理系统</CardTitle>
          <CardDescription className="text-center">请选择登录方式</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">普通用户</TabsTrigger>
              <TabsTrigger value="admin">管理员</TabsTrigger>
            </TabsList>

            <TabsContent value="user">
              <form onSubmit={handleUserLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-username">用户名</Label>
                  <Input
                    id="user-username"
                    type="text"
                    placeholder="请输入用户名"
                    value={userCredentials.username}
                    onChange={(e) => setUserCredentials({ ...userCredentials, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-password">密码</Label>
                  <Input
                    id="user-password"
                    type="password"
                    placeholder="请输入密码"
                    value={userCredentials.password}
                    onChange={(e) => setUserCredentials({ ...userCredentials, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "登录中..." : "用户登录"}
                </Button>
                <div className="text-sm text-gray-600 text-center">测试账号: user / password</div>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-username">管理员用户名</Label>
                  <Input
                    id="admin-username"
                    type="text"
                    placeholder="请输入管理员用户名"
                    value={adminCredentials.username}
                    onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">管理员密码</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="请输入管理员密码"
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "登录中..." : "管理员登录"}
                </Button>
                <div className="text-sm text-gray-600 text-center">测试账号: admin / admin123</div>
              </form>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
