'use client'

import { useState } from 'react'

interface Props {
  category?: string
}

export function SizeGuide({ category = 'Jersey' }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const isShoe = category?.toLowerCase().includes('sepatu')
  const isWindbreaker = category?.toLowerCase().includes('windbreaker') || category?.toLowerCase().includes('jacket') || category?.toLowerCase().includes('hoodie')

  interface SizeChartItem {
    label: string
    col1: string
    col2?: string
    col3?: string
    col4?: string
  }

  const jerseySizes: SizeChartItem[] = [
    { label: 'S', col1: '67', col2: '47' },
    { label: 'M', col1: '69', col2: '49' },
    { label: 'L', col1: '72', col2: '50' },
    { label: 'XL', col1: '74', col2: '54' },
    { label: 'XXL', col1: '78', col2: '60' },
  ]

  const shoeSizes: SizeChartItem[] = [
    { label: '38', col1: '24.0', col2: '-' },
    { label: '39', col1: '24.5', col2: '-' },
    { label: '40', col1: '25.0', col2: '-' },
    { label: '41', col1: '26.0', col2: '-' },
    { label: '42', col1: '26.5', col2: '-' },
    { label: '43', col1: '27.5', col2: '-' },
    { label: '44', col1: '28.0', col2: '-' },
    { label: '45', col1: '29.0', col2: '-' },
    { label: '46', col1: '30.0', col2: '-' },
  ]

  const windbreakerSizes: SizeChartItem[] = [
    { label: 'XS', col1: '46.5', col2: '118', col3: '56.5', col4: '64' },
    { label: 'S', col1: '48', col2: '122', col3: '58', col4: '66' },
    { label: 'M', col1: '49.5', col2: '126', col3: '59.5', col4: '68' },
    { label: 'L', col1: '51', col2: '132', col3: '61', col4: '71' },
    { label: 'XL', col1: '52.5', col2: '138', col3: '62.5', col4: '73' },
    { label: 'XXL', col1: '54', col2: '142', col3: '64', col4: '76' },
    { label: 'XXXL', col1: '55.5', col2: '146', col3: '65', col4: '79' },
  ]

  let sizes = jerseySizes
  let col1Label = 'Panjang (cm)'
  let col2Label = 'Lebar (cm)'
  let col3Label = ''
  let col4Label = ''

  if (isShoe) {
    sizes = shoeSizes
    col1Label = 'Panjang Kaki (cm)'
    col2Label = ''
  } else if (isWindbreaker) {
    sizes = windbreakerSizes
    col1Label = 'Bahu'
    col2Label = 'L. Dada'
    col3Label = 'Lengan'
    col4Label = 'P. Badan'
  }

  return (
    <div className="bg-[#111] border border-white/5 p-4 rounded-none mb-6 hover:border-white/10 transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2 text-white font-bold">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="uppercase tracking-wider text-sm">Panduan Ukuran (Size Chart)</span>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-white/10 overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse border border-white/10">
            <thead className="bg-[#1a1a1a] text-white font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-3 border border-white/10">Ukuran</th>
                <th className="px-4 py-3 border border-white/10">{col1Label}</th>
                {col2Label && <th className="px-4 py-3 border border-white/10">{col2Label}</th>}
                {col3Label && <th className="px-4 py-3 border border-white/10">{col3Label}</th>}
                {col4Label && <th className="px-4 py-3 border border-white/10">{col4Label}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
{sizes.map((size: SizeChartItem) => (
                <tr key={size.label} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 border border-white/10 font-bold text-white bg-[#050505]">{size.label}</td>
                  <td className="px-4 py-3 border border-white/10 text-gray-400">{size.col1}</td>
                  {col2Label && <td className="px-4 py-3 border border-white/10 text-gray-400">{size.col2}</td>}
                  {col3Label && <td className="px-4 py-3 border border-white/10 text-gray-400">{size.col3}</td>}
                  {col4Label && <td className="px-4 py-3 border border-white/10 text-gray-400">{size.col4}</td>}
                </tr>
              ))}
            </tbody>
            {isShoe && (
               <tfoot className="bg-[#1a1a1a]">
                  <tr>
                    <td colSpan={2} className="px-4 py-2 text-xs text-gray-400 italic border border-white/10">
                      * Disarankan naik 1 size jika kaki lebar
                    </td>
                  </tr>
               </tfoot>
            )}
          </table>
          
          <p className="text-xs text-gray-500 mt-4 text-center italic">
            * Toleransi ukuran ±1-2 cm dari size chart
          </p>
        </div>
      )}
    </div>
  )
}
