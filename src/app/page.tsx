'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { 
  Plus, 
  Trash2, 
  Globe,
  Search,
  Lock,
  Check,
  type LucideIcon
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'

import { Sun, Moon } from 'lucide-react'

interface Recommendation {
  id: string
  title: string
  url: string
  category: string
  categoryIcon: string | null
  imageUrl: string | null
  createdAt: string
}

// Get all available Lucide icon names
const allIconNames = Object.keys(LucideIcons).filter(
  key => key !== 'default' && key !== 'createLucideIcon' && key !== 'LucideIcon' && key !== 'icons' && !key.startsWith('_')
)

// Get icon component by name
const getIconComponent = (iconName: string | null): LucideIcon => {
  if (!iconName) return Globe

  const icon = LucideIcons[iconName as keyof typeof LucideIcons]

  if (!icon) return Globe

  return icon as LucideIcon
}

export default function Home() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [storedPassword, setStoredPassword] = useState('')
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [pendingAction, setPendingAction] = useState<'add' | 'delete' | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    url: '',
    category: '',
    categoryIcon: '',
  })

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'

    setTheme(newTheme)
    localStorage.setItem('kumink_theme', newTheme)

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Get existing categories with their icons
  const existingCategories = recommendations.reduce((acc, rec) => {
    if (!acc[rec.category]) {
      acc[rec.category] = rec.categoryIcon
    }
    return acc
  }, {} as Record<string, string | null>)

  // Check if already authenticated on mount
  useEffect(() => {
    const auth = localStorage.getItem('linkdir_auth')
    const pwd = localStorage.getItem('linkdir_pwd')
    if (auth === 'true' && pwd) {
      setIsAuthenticated(true)
      setStoredPassword(pwd)
    }
    fetchRecommendations()
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('kumink_theme') as 'dark' | 'light' | null

    const initialTheme = savedTheme || 'dark'
    setTheme(initialTheme)

    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations')
      const data = await response.json()
      setRecommendations(data)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      toast({
        title: 'Error',
        description: 'Gagal memuat data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: 'https://test.com', 
          category: 'test', 
          categoryIcon: 'Globe',
          password: passwordInput,
          verifyOnly: true
        }),
      })

      if (response.status === 401) {
        setPasswordError('Password salah!')
        return
      }

      localStorage.setItem('linkdir_auth', 'true')
      localStorage.setItem('linkdir_pwd', passwordInput)
      setStoredPassword(passwordInput)
      setIsAuthenticated(true)
      setIsPasswordDialogOpen(false)
      setPasswordInput('')
      
      if (pendingAction === 'add') {
        setIsDialogOpen(true)
      } else if (pendingAction === 'delete' && deleteId) {
        executeDelete(deleteId)
      }
      setPendingAction(null)
    } catch {
      setPasswordError('Terjadi kesalahan')
    }
  }

  const handleAddClick = () => {
    if (isAuthenticated) {
      setIsDialogOpen(true)
    } else {
      setPendingAction('add')
      setIsPasswordDialogOpen(true)
    }
  }

  const handleDeleteClick = (id: string) => {
    if (isAuthenticated) {
      setDeleteId(id)
    } else {
      setDeleteId(id)
      setPendingAction('delete')
      setIsPasswordDialogOpen(true)
    }
  }

  // Handle category chip click
  const handleCategoryClick = (category: string) => {
    if (formData.category === category) {
      // Deselect - clear category
      setFormData({ ...formData, category: '', categoryIcon: '' })
    } else {
      // Select - set category and icon
      const existingIcon = existingCategories[category]
      setFormData({ 
        ...formData, 
        category, 
        categoryIcon: existingIcon || ''
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, password: storedPassword }),
      })

      const data = await response.json()

      if (response.status === 401) {
        toast({ title: 'Error', description: 'Sesi habis', variant: 'destructive' })
        localStorage.removeItem('linkdir_auth')
        localStorage.removeItem('linkdir_pwd')
        setIsAuthenticated(false)
        return
      }

      if (response.ok) {
        toast({ title: 'Berhasil!', description: 'Link berhasil ditambahkan' })
        setIsDialogOpen(false)
        setFormData({ url: '', category: '', categoryIcon: 'Globe' })
        fetchRecommendations()
      } else {
        toast({ title: 'Error', description: data.error || 'Gagal menambahkan link', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({ title: 'Error', description: 'Gagal menambahkan link', variant: 'destructive' })
    }
  }

  const executeDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/recommendations/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: storedPassword }),
      })

      if (response.status === 401) {
        toast({ title: 'Error', description: 'Sesi habis', variant: 'destructive' })
        localStorage.removeItem('linkdir_auth')
        localStorage.removeItem('linkdir_pwd')
        setIsAuthenticated(false)
        return
      }

      if (response.ok) {
        toast({ title: 'Berhasil!', description: 'Link berhasil dihapus' })
        fetchRecommendations()
      }
    } catch (error) {
      console.error('Error:', error)
      toast({ title: 'Error', description: 'Gagal menghapus link', variant: 'destructive' })
    }
  }

  const confirmDelete = () => {
    if (deleteId) {
      executeDelete(deleteId)
      setDeleteId(null)
    }
  }

  // Group recommendations by category
  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    if (!acc[rec.category]) acc[rec.category] = []
    acc[rec.category].push(rec)
    return acc
  }, {} as Record<string, Recommendation[]>)

  // Filter based on search
  const filteredGroups = Object.entries(groupedRecommendations).reduce((acc, [category, items]) => {
    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (filtered.length > 0) acc[category] = filtered
    return acc
  }, {} as Record<string, Recommendation[]>)

  // Check if selected category exists
  const isSelectedCategoryExisting = formData.category && existingCategories[formData.category] !== undefined

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Kumink</h1>
                <p className="text-sm text-muted-foreground">Kumpulan Link Apapun</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari link..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="shadow-sm"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>

                <Button onClick={handleAddClick} className="gap-2 shadow-lg shadow-primary/20">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="h-6 bg-muted rounded w-40 animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-10 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
              <Globe className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Belum Ada Link</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Jadilah yang pertama untuk menambahkan link!
            </p>
            <Button onClick={handleAddClick} className="gap-2">
              <Plus className="w-4 h-4" />
              Tambah Link Pertama
            </Button>
          </div>
        ) : searchQuery && Object.keys(filteredGroups).length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Tidak Ditemukan</h2>
            <p className="text-muted-foreground">
              Tidak ada link yang cocok dengan "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(searchQuery ? filteredGroups : groupedRecommendations)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([category, items]) => {
                const iconFromDb = items[0]?.categoryIcon
                const IconComponent = getIconComponent(iconFromDb)
                
                return (
                  <Card key={category} className="overflow-hidden border">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <IconComponent className="w-5 h-5 text-primary" />
                        {category}
                        <Badge variant="secondary">{items.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                        {[...items]
                          .sort((a, b) => a.title.localeCompare(b.title, "id", { sensitivity: "base" }))
                          .map((item) => (
                          <div
                            key={item.id}
                            className="group relative bg-muted/30 rounded-lg border p-3 hover:bg-muted/50 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center overflow-hidden">
                                {(() => {
                                  const getFavicon = (url: string) => {
                                    try {
                                      const domain = new URL(url).hostname
                                      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
                                    } catch {
                                      return null
                                    }
                                  }

                                  const faviconUrl = item.url ? getFavicon(item.url) : null

                                  return (
                                    <img
                                      src={item.imageUrl || faviconUrl || ""}
                                      alt={item.title}
                                      className="w-5 h-5 object-contain"
                                      onError={(e) => {
                                        const target = e.currentTarget as HTMLImageElement

                                        // kalau imageUrl gagal → coba favicon
                                        if (target.src !== faviconUrl && faviconUrl) {
                                          target.src = faviconUrl
                                        } else {
                                          // kalau favicon juga gagal → hilangkan gambar
                                          target.style.display = "none"
                                        }
                                      }}
                                    />
                                  )
                                })()}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-sm truncate hover:text-primary transition-colors"
                                  >
                                    {item.title}
                                  </a>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDeleteClick(item.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© Kumink - Kumpulan Link Apapun</p>
          <p className="mt-1">Total {recommendations.length} link dalam {Object.keys(groupedRecommendations).length} kategori</p>
        </div>
      </footer>

      {/* Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={(open) => {
        setIsPasswordDialogOpen(open)
        if (!open) {
          setPasswordInput('')
          setPasswordError('')
          setPendingAction(null)
          setDeleteId(null)
        }
      }}>
        <DialogContent className="sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Masukkan Password
            </DialogTitle>
            <DialogDescription>
              Password diperlukan untuk {pendingAction === 'add' ? 'menambah' : 'menghapus'} link
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Input
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                autoFocus
              />
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => {
                setIsPasswordDialogOpen(false)
                setPasswordInput('')
                setPasswordError('')
                setPendingAction(null)
                setDeleteId(null)
              }}>
                Batal
              </Button>
              <Button type="submit">Lanjut</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Link Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) {
          setFormData({ url: '', category: '', categoryIcon: 'Globe' })
        }
      }}>
        <DialogContent className="sm:max-w-[450px] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl">Tambah Link</DialogTitle>
            <DialogDescription>
              Masukkan URL dan pilih kategori
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4">
              
              <div className="grid gap-4">
                
                {/* URL */}
                <div className="grid gap-2">
                  <Label htmlFor="url">URL *</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Kategori */}
                <div className="grid gap-2">
                  <Label>Kategori</Label>

                  {Object.keys(existingCategories).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(existingCategories).map(([cat, icon]) => {
                        const IconComponent = getIconComponent(icon)
                        const isSelected = formData.category === cat

                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleCategoryClick(cat)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted/50 border-border hover:bg-muted hover:border-primary/50"
                            }`}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                            {cat}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  <Input
                    placeholder="Atau buat kategori baru..."
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value
                      const existingIcon = existingCategories[newCat]
                      setFormData({
                        ...formData,
                        category: newCat,
                        categoryIcon: existingIcon || formData.categoryIcon,
                      })
                    }}
                  />
                </div>

                {/* Icon picker - only show for new categories */}
                {!isSelectedCategoryExisting && formData.category && (
                  <div className="grid gap-2">
                    <Label>Icon Kategori</Label>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg border bg-muted/50 flex items-center justify-center">
                        {(() => {
                          const IconPreview = getIconComponent(formData.categoryIcon)
                          return <IconPreview className="w-5 h-5" />
                        })()}
                      </div>
                      <Input
                        placeholder="Ketik nama icon..."
                        value={formData.categoryIcon}
                        onChange={(e) => setFormData({ ...formData, categoryIcon: e.target.value || 'Globe' })}
                        className="flex-1"
                      />
                    </div>
                    
                    {/* Real-time icon suggestions based on input */}
                    <div className="max-h-32 overflow-y-auto border rounded-lg p-2 bg-muted/20">
                      <div className="flex flex-wrap gap-1">
                        {allIconNames
                          .filter(name => name.toLowerCase().includes(formData.categoryIcon.toLowerCase()))
                          .slice(0, 20)
                          .map((iconName) => {
                            const IconComponent = getIconComponent(iconName)
                            const isSelected = formData.categoryIcon === iconName
                            return (
                              <button
                                key={iconName}
                                type="button"
                                onClick={() => setFormData({ ...formData, categoryIcon: iconName })}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs border transition-all ${
                                  isSelected
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border hover:border-primary/50 bg-background'
                                }`}
                              >
                                <IconComponent className="w-3 h-3" />
                                {iconName}
                              </button>
                            )
                          })}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Menampilkan {allIconNames.filter(name => name.toLowerCase().includes(formData.categoryIcon.toLowerCase())).slice(0, 20).length} dari {allIconNames.length}+ icon. Lihat semua di <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">lucide.dev/icons</a>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer (Sticky Bottom) */}
            <div className="border-t px-6 py-4 flex justify-end gap-2 bg-background">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={!formData.url || !formData.category}
              >
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId && isAuthenticated} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Link?</AlertDialogTitle>
            <AlertDialogDescription>Link akan dihapus secara permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}