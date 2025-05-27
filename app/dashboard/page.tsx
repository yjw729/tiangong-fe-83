"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Upload, LogOut, File, Trash2 } from "lucide-react"

interface FileItem {
  id: string
  name: string
  size: string
  uploadTime: string
  primaryTag: string
  secondaryTag: string
  uploader: string
}

export default function DashboardPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [username, setUsername] = useState("")
  const [primaryTag, setPrimaryTag] = useState("")
  const [secondaryTag, setSecondaryTag] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const router = useRouter()

  const primaryTags = ["文档", "图片", "视频", "音频", "其他"]
  const secondaryTags = {
    文档: ["合同", "报告", "说明书", "表格"],
    图片: ["产品图", "宣传图", "截图", "照片"],
    视频: ["教程", "宣传片", "会议录像", "演示"],
    音频: ["会议录音", "音乐", "语音备忘", "播客"],
    其他: ["压缩包", "安装包", "数据文件", "备份"],
  }

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const storedUsername = localStorage.getItem("username")

    if (!userType || !storedUsername) {
      router.push("/login")
      return
    }

    setUsername(storedUsername)

    // 加载已保存的文件
    const savedFiles = localStorage.getItem("uploadedFiles")
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles))
    }
  }, [router])

  const handleFileUpload = () => {
    if (!selectedFiles || !primaryTag || !secondaryTag) {
      alert("请选择文件并设置标识")
      return
    }

    const newFiles: FileItem[] = Array.from(selectedFiles).map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      uploadTime: new Date().toLocaleString("zh-CN"),
      primaryTag,
      secondaryTag,
      uploader: username,
    }))

    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles))

    // 重置表单
    setSelectedFiles(null)
    setPrimaryTag("")
    setSecondaryTag("")

    const fileInput = document.getElementById("file-input") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const handleDeleteFile = (fileId: string) => {
    const updatedFiles = files.filter((file) => file.id !== fileId)
    setFiles(updatedFiles)
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles))
  }

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("username")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">文件管理系统</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">欢迎, {username}</span>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 文件上传区域 */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                上传文件
              </CardTitle>
              <CardDescription>选择文件并设置标识</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-input">选择文件</Label>
                <Input id="file-input" type="file" multiple onChange={(e) => setSelectedFiles(e.target.files)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary-tag">一级标识</Label>
                <Select value={primaryTag} onValueChange={setPrimaryTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择一级标识" />
                  </SelectTrigger>
                  <SelectContent>
                    {primaryTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary-tag">二级标识</Label>
                <Select value={secondaryTag} onValueChange={setSecondaryTag} disabled={!primaryTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择二级标识" />
                  </SelectTrigger>
                  <SelectContent>
                    {primaryTag &&
                      secondaryTags[primaryTag as keyof typeof secondaryTags]?.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleFileUpload} className="w-full">
                上传文件
              </Button>
            </CardContent>
          </Card>

          {/* 文件列表 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="w-5 h-5" />
                我的文件 ({files.filter((file) => file.uploader === username).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>文件名</TableHead>
                    <TableHead>大小</TableHead>
                    <TableHead>一级标识</TableHead>
                    <TableHead>二级标识</TableHead>
                    <TableHead>上传时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files
                    .filter((file) => file.uploader === username)
                    .map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">{file.name}</TableCell>
                        <TableCell>{file.size}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{file.primaryTag}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{file.secondaryTag}</Badge>
                        </TableCell>
                        <TableCell>{file.uploadTime}</TableCell>
                        <TableCell>
                          <Button onClick={() => handleDeleteFile(file.id)} variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {files.filter((file) => file.uploader === username).length === 0 && (
                <div className="text-center py-8 text-gray-500">暂无文件，请上传文件</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
