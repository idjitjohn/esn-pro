'use client'

import { useRef, useState } from 'react'
import ProspectList from '@/components/ProspectList'
import AddProspectModal from '@/components/AddProspectModal'

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const refreshListRef = useRef<(() => void) | null>(null)

  function handleAdded() {
    setModalOpen(false)
    refreshListRef.current?.()
  }

  return (
    <main className="prospects-page">
      <h1>Prospects</h1>
      <button className="add-btn" onClick={() => setModalOpen(true)}>Add</button>
      <ProspectList refreshRef={(fn) => { refreshListRef.current = fn }} />
      <AddProspectModal open={modalOpen} onClose={handleAdded} />
    </main>
  )
}
