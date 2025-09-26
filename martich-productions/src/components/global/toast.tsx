'use client'

import React from 'react'

type Toast = { id: number; text: string; type?: 'success' | 'error' }

const ToastCtx = React.createContext<{ show: (text: string, type?: 'success' | 'error') => void } | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const idRef = React.useRef(1)

  const show = React.useCallback((text: string, type: 'success' | 'error' = 'success') => {
    const id = idRef.current++
    setToasts((t) => [...t, { id, text, type }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[10000] space-y-2" aria-live="polite" role="status">
        {toasts.map((t) => (
          <div key={t.id} className={`px-3 py-2 rounded-md text-sm shadow border ${t.type === 'error' ? 'bg-red-900/80 text-red-200 border-red-700' : 'bg-green-900/80 text-green-200 border-green-700'}`}>{t.text}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}


