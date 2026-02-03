'use client'

import { useProspectList } from './useProspectList'
import './ProspectList.scss'

export interface Props {
  className?: string
  refreshRef?: (refresh: () => void) => void
}

export default function ProspectList({ className, refreshRef }: Props) {
  const { prospects, loading, error, refresh, confirmingId, handleStatusClick } = useProspectList()

  if (refreshRef) refreshRef(refresh)

  if (loading) return <p className="ProspectList">{' '}Loading...</p>
  if (error) return <p className="ProspectList error">{error}</p>

  return (
    <div className={`ProspectList ${className ?? ''}`}>
      {prospects.length === 0 && <p className="empty">No prospects yet.</p>}
      <div className="list">
        {prospects.map((p) => (
          <div key={p._id} className="item">
            <div
              className="avatar"
              style={p.image ? { backgroundImage: `url(${p.image})` } : undefined}
            />
            <div className="info">
              <div className="name">{p.name || p.link}</div>
              <div className="link">{p.link}</div>
            </div>
            <button
              className={`status ${p.prospected ? 'prospected' : 'not-prospected'} ${confirmingId === p._id ? 'confirming' : ''}`}
              onClick={() => handleStatusClick(p._id)}
            >
              {confirmingId === p._id
                ? `Change to ${p.prospected ? 'Not prospected' : 'Prospected'}?`
                : p.prospected ? 'Prospected' : 'Not prospected'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
