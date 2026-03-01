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
  Star,
  Heart,
  Zap,
  Wrench,
  Gamepad2,
  Music,
  Film,
  BookOpen,
  ShoppingCart,
  Newspaper,
  Code,
  Users,
  Shield,
  Coffee,
  Plane,
  Camera,
  Palette,
  Briefcase,
  Check,
  Tv,
  Bell,
  Settings,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Cloud,
  Sun,
  Moon,
  Battery,
  Wifi,
  Bluetooth,
  Printer,
  Gift,
  Award,
  Flag,
  Trophy,
  Medal,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Share2,
  Download,
  Upload,
  RefreshCw,
  Edit,
  Copy,
  Scissors,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Mic,
  Video,
  Image,
  File,
  Folder,
  Archive,
  Tag,
  Hash,
  Link,
  Unlink,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  type LucideIcon
} from 'lucide-react'

interface Recommendation {
  id: string
  title: string
  url: string
  category: string
  categoryIcon: string | null
  imageUrl: string | null
  createdAt: string
}

// Available icons for category
const categoryIcons: { name: string; icon: LucideIcon; label: string }[] = [
  // Original icons
  { name: 'Star', icon: Star, label: 'Star' },
  { name: 'Heart', icon: Heart, label: 'Heart' },
  { name: 'Zap', icon: Zap, label: 'Zap' },
  { name: 'Wrench', icon: Wrench, label: 'Tools' },
  { name: 'Gamepad2', icon: Gamepad2, label: 'Game' },
  { name: 'Music', icon: Music, label: 'Music' },
  { name: 'Film', icon: Film, label: 'Film' },
  { name: 'BookOpen', icon: BookOpen, label: 'Book' },
  { name: 'ShoppingCart', icon: ShoppingCart, label: 'Shopping' },
  { name: 'Newspaper', icon: Newspaper, label: 'News' },
  { name: 'Code', icon: Code, label: 'Code' },
  { name: 'Users', icon: Users, label: 'Social' },
  { name: 'Shield', icon: Shield, label: 'Security' },
  { name: 'Coffee', icon: Coffee, label: 'Coffee' },
  { name: 'Plane', icon: Plane, label: 'Travel' },
  { name: 'Camera', icon: Camera, label: 'Camera' },
  { name: 'Palette', icon: Palette, label: 'Art' },
  { name: 'Briefcase', icon: Briefcase, label: 'Work' },
  { name: 'Globe', icon: Globe, label: 'Globe' },
  { name: 'Tv', icon: Tv, label: 'TV' },
  { name: 'Bell', icon: Bell, label: 'Notifications' },
  { name: 'Settings', icon: Settings, label: 'Settings' },
  { name: 'User', icon: User, label: 'Profile' },
  { name: 'Mail', icon: Mail, label: 'Email' },
  { name: 'Phone', icon: Phone, label: 'Phone' },
  { name: 'MapPin', icon: MapPin, label: 'Location' },
  { name: 'Calendar', icon: Calendar, label: 'Calendar' },
  { name: 'Clock', icon: Clock, label: 'Time' },
  { name: 'Cloud', icon: Cloud, label: 'Cloud' },
  { name: 'Sun', icon: Sun, label: 'Weather' },
  { name: 'Moon', icon: Moon, label: 'Night' },
  { name: 'Battery', icon: Battery, label: 'Battery' },
  { name: 'Wifi', icon: Wifi, label: 'WiFi' },
  { name: 'Bluetooth', icon: Bluetooth, label: 'Bluetooth' },
  { name: 'Printer', icon: Printer, label: 'Print' },
  { name: 'Gift', icon: Gift, label: 'Gift' },
  { name: 'Award', icon: Award, label: 'Award' },
  { name: 'Flag', icon: Flag, label: 'Flag' },
  { name: 'Trophy', icon: Trophy, label: 'Trophy' },
  { name: 'Medal', icon: Medal, label: 'Medal' },
  { name: 'ThumbsUp', icon: ThumbsUp, label: 'Like' },
  { name: 'ThumbsDown', icon: ThumbsDown, label: 'Dislike' },
  { name: 'MessageCircle', icon: MessageCircle, label: 'Chat' },
  { name: 'Send', icon: Send, label: 'Send' },
  { name: 'Share2', icon: Share2, label: 'Share' },
  { name: 'Download', icon: Download, label: 'Download' },
  { name: 'Upload', icon: Upload, label: 'Upload' },
  { name: 'RefreshCw', icon: RefreshCw, label: 'Refresh' },
  { name: 'Edit', icon: Edit, label: 'Edit' },
  { name: 'Copy', icon: Copy, label: 'Copy' },
  { name: 'Scissors', icon: Scissors, label: 'Cut' },
  { name: 'Eye', icon: Eye, label: 'View' },
  { name: 'EyeOff', icon: EyeOff, label: 'Hide' },
  { name: 'Volume2', icon: Volume2, label: 'Volume' },
  { name: 'VolumeX', icon: VolumeX, label: 'Mute' },
  { name: 'Mic', icon: Mic, label: 'Microphone' },
  { name: 'Video', icon: Video, label: 'Video' },
  { name: 'Image', icon: Image, label: 'Image' },
  { name: 'File', icon: File, label: 'File' },
  { name: 'Folder', icon: Folder, label: 'Folder' },
  { name: 'Archive', icon: Archive, label: 'Archive' },
  { name: 'Tag', icon: Tag, label: 'Tag' },
  { name: 'Hash', icon: Hash, label: 'Hashtag' },
  { name: 'Link', icon: Link, label: 'Link' },
  { name: 'Unlink', icon: Unlink, label: 'Unlink' },
  { name: 'Bold', icon: Bold, label: 'Bold' },
  { name: 'Italic', icon: Italic, label: 'Italic' },
  { name: 'Underline', icon: Underline, label: 'Underline' },
  { name: 'AlignLeft', icon: AlignLeft, label: 'Align Left' },
  { name: 'AlignCenter', icon: AlignCenter, label: 'Align Center' },
  { name: 'AlignRight', icon: AlignRight, label: 'Align Right' },
]

// Get icon component by name
const getIconComponent = (iconName: string | null): LucideIcon => {
  const found = categoryIcons.find(i => i.name === iconName)
  return found?.icon || Globe
}

export default function Home() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
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
    categoryIcon: 'Globe',
  })

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
      setFormData({ ...formData, category: '', categoryIcon: 'Globe' })
    } else {
      // Select - set category and icon
      const existingIcon = existingCategories[category]
      setFormData({ 
        ...formData, 
        category, 
        categoryIcon: existingIcon || 'Globe'
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
              
              <Button onClick={handleAddClick} className="gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Tambah</span>
              </Button>
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
                        <IconComponent className="w-5 h-5 text-[#4ba3f7]" />
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

                {/* Icon Picker */}
                {!isSelectedCategoryExisting && formData.category && (
                  <div className="grid gap-2">
                    <Label>Icon Kategori Baru</Label>
                    <div className="grid grid-cols-7 gap-2">
                      {categoryIcons.map((icon) => {
                        const IconComponent = icon.icon
                        return (
                          <button
                            key={icon.name}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                categoryIcon: icon.name,
                              })
                            }
                            className={`p-2 rounded-lg border transition-all ${
                              formData.categoryIcon === icon.name
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </button>
                        )
                      })}
                    </div>
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