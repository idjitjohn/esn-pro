import { useCallback, useEffect, useRef, useState } from 'react'

export interface Post {
  url: string
  comments: string[]
}

export interface Prospect {
  _id: string
  link: string
  name?: string
  image?: string
  data?: any
  message?: string
  posts?: Post[]
  prospected: boolean
  createdAt: string
  updatedAt: string
}

export function useProspectList() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/prospects')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      setProspects(json.prospects)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const [selectedId, setSelectedId] = useState<string | null>(null)

  function handleItemClick(id: string) {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function clearConfirm() {
    setConfirmingId(null)
    if (confirmTimer.current) {
      clearTimeout(confirmTimer.current)
      confirmTimer.current = null
    }
  }

  const handleStatusClick = useCallback(async (id: string) => {
    if (confirmingId !== id) {
      setConfirmingId(id)
      if (confirmTimer.current) clearTimeout(confirmTimer.current)
      confirmTimer.current = setTimeout(() => setConfirmingId(null), 3000)
      return
    }

    clearConfirm()
    try {
      const res = await fetch('/api/prospects/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'toggle' }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      setProspects((prev) =>
        prev.map((p) => (p._id === id ? { ...p, prospected: json.prospect.prospected } : p))
      )
    } catch (err: any) {
      setError(err.message)
    }
  }, [confirmingId])

  return { prospects, loading, error, refresh, selectedId, handleItemClick, confirmingId, handleStatusClick }
}
