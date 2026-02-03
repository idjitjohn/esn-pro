import { useState } from 'react'

export function useAddProspectModal(onSuccess?: () => void) {
  const [link, setLink] = useState('')
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function resetForm() {
    setLink('')
    setName('')
    setImage('')
    setNotes('')
    setError('')
  }

  async function handleSubmit() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          link,
          name,
          image,
          data: notes ? { notes } : {},
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      resetForm()
      onSuccess?.()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const disabled = !link || loading

  return {
    link, setLink,
    name, setName,
    image, setImage,
    notes, setNotes,
    loading, error, disabled,
    handleSubmit, resetForm,
  }
}
