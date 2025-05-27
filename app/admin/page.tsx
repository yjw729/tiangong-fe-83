"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LogOut, Users, File, Trash2, Search } from "lucide-react"

interface FileItem {
  id: string
  name: string
  size: string
  uploadTime: string
  primaryTag: string
  secondaryTag: string
  uploader: string
}

export default function AdminPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTag, setFilterTag] = useState("")
  const [filterUploader, setFilterUploader] = useState("")
  const router = useRouter()

  useEffect(() => {
    const userType = localStorage.getItem("userType")

    if (userType !== "admin") {
      router.push("/login")
      return
    }

    // 加载所有文件
    const savedFiles = localStorage.getItem("uploadedFiles")
    if (savedFiles) {
      const allFiles = JSON.parse(savedFiles)
      setFiles(allFiles)
      setFilteredFiles(allFiles)
    }
  }, [router])

  useEffect(() => {
    let filtered = files

    if (searchTerm) {
      filtered = filtered.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (filterTag) {
      filtered = filtered.filter((file) => file.primaryTag === filterTag || file.secondaryTag === filterTag)
    }

    if (filterUploader) {
      filtered = filtered.filter((file) => file.uploader === filterUploader)
    }

    setFilteredFiles(filtered)
  }, [files, searchTerm, filterTag, filterUploader])

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

  const getUniqueUploaders = () => {
    return [...new Set(files.map((file) => file.uploader))]
  }

  const getUniqueTags = () => {
    const primaryTags = [...new Set(files.map((file) => file.primaryTag))]
    const secondaryTags = [...new Set(files.map((file) => file.secondaryTag))]
    return [...new Set([...primaryTags, ...secondaryTags])]
  }

  const getFileStats = () => {
    const totalFiles = files.length
    const totalUsers = getUniqueUploaders().length
    const totalSize = files.reduce((acc, file) => {
      const size = Number.parseFloat(file.size.replace(" MB", ""))
      return acc + size
    }, 0)

    return { totalFiles, totalUsers, totalSize: totalSize.toFixed(2) }
  }

  const stats = getFileStats()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">管理员控制台</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总文件数</CardTitle>
              <File className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFiles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">用户数量</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总存储空间</CardTitle>
              <File className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSize} MB</div>
            </CardContent>
          </Card>
        </div>

        {/* 文件管理 */}
        <Card>
          <CardHeader>
            <CardTitle>文件管理</CardTitle>
            <CardDescription>查看和管理所有用户上传的文件</CardDescription>
          </CardHeader>
          <CardContent>
            {/* 筛选器 */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索文件名..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="按标识筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有标识</SelectItem>
                  {getUniqueTags().map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterUploader} onValueChange={setFilterUploader}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="按用户筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有用户</SelectItem>
                  {getUniqueUploaders().map((uploader) => (
                    <SelectItem key={uploader} value={uploader}>
                      {uploader}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 文件表格 */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>文件名</TableHead>
                  <TableHead>大小</TableHead>
                  <TableHead>一级标识</TableHead>
                  <TableHead>二级标识</TableHead>
                  <TableHead>上传者</TableHead>
                  <TableHead>上传时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">{file.name}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{file.primaryTag}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{file.secondaryTag}</Badge>
                    </TableCell>
                    <TableCell>{file.uploader}</TableCell>
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

            {filteredFiles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {files.length === 0 ? "暂无文件" : "没有符合条件的文件"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
