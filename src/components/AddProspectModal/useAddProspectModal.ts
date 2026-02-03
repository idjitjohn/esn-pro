import { useState } from 'react'

interface PostDraft {
  url: string
  comments: string[]
}

export function useAddProspectModal(onSuccess?: () => void) {
  const [link, setLink] = useState('')
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [message, setMessage] = useState('')
  const [posts, setPosts] = useState<PostDraft[]>([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function resetForm() {
    setLink('')
    setName('')
    setImage('')
    setMessage('')
    setPosts([])
    setNotes('')
    setError('')
  }

  function addPost() {
    setPosts((prev) => [...prev, { url: '', comments: [] }])
  }

  function removePost(index: number) {
    setPosts((prev) => prev.filter((_, i) => i !== index))
  }

  function updatePostUrl(index: number, url: string) {
    setPosts((prev) => prev.map((p, i) => (i === index ? { ...p, url } : p)))
  }

  function addComment(index: number) {
    setPosts((prev) => prev.map((p, i) =>
      i === index ? { ...p, comments: [...p.comments, ''] } : p
    ))
  }

  function removeComment(postIndex: number, commentIndex: number) {
    setPosts((prev) => prev.map((p, i) =>
      i === postIndex ? { ...p, comments: p.comments.filter((_, j) => j !== commentIndex) } : p
    ))
  }

  function updateComment(postIndex: number, commentIndex: number, value: string) {
    setPosts((prev) => prev.map((p, i) =>
      i === postIndex
        ? { ...p, comments: p.comments.map((c, j) => (j === commentIndex ? value : c)) }
        : p
    ))
  }

  async function handleSubmit() {
    setError('')
    setLoading(true)
    try {
      const cleanPosts = posts.filter((p) => p.url)
      const res = await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          link,
          name,
          image,
          message,
          posts: cleanPosts.length > 0 ? cleanPosts : undefined,
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
    message, setMessage,
    posts, addPost, removePost, updatePostUrl, addComment, removeComment, updateComment,
    notes, setNotes,
    loading, error, disabled,
    handleSubmit, resetForm,
  }
}
