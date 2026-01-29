import { PROVINCES } from '@/lib/promo'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CustomerFormProps {
  name: string
  phone: string
  address: string
  province: string
  onNameChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onAddressChange: (value: string) => void
  onProvinceChange: (value: string) => void
}

export function CustomerForm({
  name,
  phone,
  address,
  province,
  onNameChange,
  onPhoneChange,
  onAddressChange,
  onProvinceChange,
}: CustomerFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-blue-200 font-bold text-xs uppercase tracking-wider">Nama Lengkap *</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="John Doe"
          className="bg-blue-900/10 border-blue-500/20 text-white placeholder:text-blue-500/30 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500/50 h-11 transition-all"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-blue-200 font-bold text-xs uppercase tracking-wider">No. WhatsApp *</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="08123456789"
          className="bg-blue-900/10 border-blue-500/20 text-white placeholder:text-blue-500/30 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500/50 h-11 transition-all"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-blue-200 font-bold text-xs uppercase tracking-wider">Provinsi *</Label>
        <Select value={province} onValueChange={onProvinceChange}>
          <SelectTrigger className="bg-blue-900/10 border-blue-500/20 text-white h-11 focus:ring-cyan-500/50 focus:border-cyan-500/50 data-[placeholder]:text-blue-500/30">
            <SelectValue placeholder="Pilih Provinsi" />
          </SelectTrigger>
          <SelectContent className="bg-[#050A1F] border-blue-500/20 text-white max-h-[300px]">
             {PROVINCES.map((p) => (
                <SelectItem key={p.id} value={p.id} className="text-blue-100 focus:bg-blue-900/30 focus:text-cyan-400 cursor-pointer">
                  {p.label}
                </SelectItem>
             ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address" className="text-blue-200 font-bold text-xs uppercase tracking-wider">Alamat Lengkap *</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Jl. Merdeka No. 45, RT 01/RW 02, Kec. Melati"
          rows={3}
          className="bg-blue-900/10 border-blue-500/20 text-white placeholder:text-blue-500/30 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500/50 resize-none min-h-[100px] transition-all"
        />
      </div>
    </div>
  )
}
