'use client'

import { useAddProspectModal } from './useAddProspectModal'
import './AddProspectModal.scss'

export interface Props {
  open: boolean
  onClose: () => void
}

export default function AddProspectModal({ open, onClose }: Props) {
  const {
    link, setLink,
    name, setName,
    image, setImage,
    notes, setNotes,
    loading, error, disabled,
    handleSubmit, resetForm,
  } = useAddProspectModal(() => onClose())

  if (!open) return null

  function handleCancel() {
    resetForm()
    onClose()
  }

  return (
    <div className="AddProspectModal" onClick={handleCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Add prospect</h3>

        <div className="field">
          <label>Link *</label>
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
        </div>

        <div className="field">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Prospect name" />
        </div>

        <div className="field">
          <label>Image URL</label>
          <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
        </div>

        <div className="field">
          <label>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="actions">
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleSubmit} disabled={disabled}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}
