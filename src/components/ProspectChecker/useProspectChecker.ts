import { useState } from 'react'

export interface ProspectResult {
  _id: string
  link: string
  name?: string
  data?: any
  prospected: boolean
  createdAt: string
  updatedAt: string
}

export function useProspectChecker() {
  const [link, setLink] = useState('')
  const [result, setResult] = useState<ProspectResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheck() {
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`/api/prospects/check?link=${encodeURIComponent(link)}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      setResult(json.prospect)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleMark() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/prospects/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link, action: 'mark' }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      setResult(json.prospect)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const disabled = !link || loading

  return { link, setLink, result, loading, error, disabled, handleCheck, handleMark }
}
