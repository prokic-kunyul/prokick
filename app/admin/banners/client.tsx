'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Power, PowerOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from 'react-hot-toast'
import { createBanner, deleteBanner, toggleBannerStatus, getAllBannersAdmin } from '@/app/actions/banners'
import Image from 'next/image'

interface Banner {
  id: string
  title: string | null
  image: string
  link: string | null
  active: boolean
}

export default function AdminBannersClient() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Form State
  const [newBannerFile, setNewBannerFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [newBannerTitle, setNewBannerTitle] = useState('')
  const [newBannerLink, setNewBannerLink] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchBanners = useCallback(async () => {
    setLoading(true)
    const data = await getAllBannersAdmin()
    setBanners(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBanners()
  }, [fetchBanners])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setNewBannerFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBannerFile) {
      toast.error('Image file is required')
      return
    }

    setSubmitting(true)
    
    const formData = new FormData()
    formData.append('image', newBannerFile)
    formData.append('title', newBannerTitle)
    formData.append('link', newBannerLink)

    const res = await createBanner(formData)

    if (res.success) {
      toast.success('Banner created!')
      setNewBannerFile(null)
      setPreviewUrl(null)
      setNewBannerTitle('')
      setNewBannerLink('')
      setIsDialogOpen(false)
      fetchBanners()
    } else {
      toast.error(res.error || 'Failed to create banner')
    }
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return
    
    const res = await deleteBanner(id)
    if (res.success) {
      toast.success('Banner deleted')
      fetchBanners()
    } else {
      toast.error(res.error || 'Failed to delete')
    }
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const res = await toggleBannerStatus(id)
    if (res.success) {
      toast.success(currentStatus ? 'Banner deactivated' : 'Banner activated')
      fetchBanners()
    } else {
      toast.error(res.error || 'Failed to update')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Banners Management</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#111] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Add New Banner</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Banner Image *</label>
                
                {/* Image Preview */}
                {previewUrl && (
                  <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden border border-white/20 mb-2">
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  </div>
                )}

                <div className="bg-black border border-white/10 rounded-lg p-2">
                   <Input 
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="bg-transparent border-none text-white file:bg-white/10 file:text-white file:border-0 file:rounded-md file:mr-4 file:px-2 file:py-1 cursor-pointer"
                   />
                </div>
                <p className="text-xs text-gray-500">Upload a high quality image (2:1 ratio recommended).</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Title (Optional)</label>
                <Input 
                   placeholder="e.g. World Cup 2026" 
                   value={newBannerTitle}
                   onChange={e => setNewBannerTitle(e.target.value)}
                   className="bg-black border-white/10"
                />
              </div>

               <div className="space-y-2">
                <label className="text-sm font-medium">Link URL (Optional)</label>
                <Input 
                   placeholder="e.g. /products?league=Premier+League" 
                   value={newBannerLink}
                   onChange={e => setNewBannerLink(e.target.value)}
                   className="bg-black border-white/10"
                />
                <p className="text-xs text-gray-500">Where should this banner link to?</p>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                 <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                 <Button type="submit" disabled={submitting}>
                   {submitting ? 'Saving...' : 'Save Banner'}
                 </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-gray-400 font-medium border-b border-white/10">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Title / Link</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading ? (
               <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading...</td></tr>
            ) : banners.length === 0 ? (
               <tr><td colSpan={4} className="p-8 text-center text-gray-500">No banners found. Add one!</td></tr>
            ) : (
              banners.map(banner => (
                <tr key={banner.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="relative w-32 h-16 bg-black rounded-lg overflow-hidden border border-white/10">
                       <Image src={banner.image} alt={banner.title || 'Banner'} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-white">{banner.title || '-'}</div>
                    <div className="text-xs text-blue-400 truncate max-w-[200px]">{banner.link || 'No link'}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      banner.active ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      {banner.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => handleToggle(banner.id, banner.active)}
                         title={banner.active ? "Deactivate" : "Activate"}
                       >
                         {banner.active ? <Power className="w-4 h-4 text-green-500" /> : <PowerOff className="w-4 h-4 text-gray-500" />}
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="text-red-500 hover:bg-red-500/10"
                         onClick={() => handleDelete(banner.id)}
                       >
                         <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
