
'use client'

import { useEffect } from 'react'

export function ContentProtection() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

   
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault()
        return
      }

      
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        return
      }

     
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
         e.preventDefault()
         return
      }

     
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault()
        return
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return null
}
