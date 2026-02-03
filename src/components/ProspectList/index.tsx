'use client'

import { useProspectList } from './useProspectList'
import './ProspectList.scss'

export interface Props {
  className?: string
  refreshRef?: (refresh: () => void) => void
}

export default function ProspectList({ className, refreshRef }: Props) {
  const {
    prospects, loading, error, refresh,
    selectedId, handleItemClick,
    confirmingId, handleStatusClick,
    copiedText, copyToClipboard,
  } = useProspectList()

  if (refreshRef) refreshRef(refresh)

  if (loading) return <p className="ProspectList">Loading...</p>
  if (error) return <p className="ProspectList error">{error}</p>

  return (
    <div className={`ProspectList ${className ?? ''}`}>
      {prospects.length === 0 && <p className="empty">No prospects yet.</p>}
      <div className="list">
        {prospects.map((p) => (
          <div key={p._id} className={`item ${selectedId === p._id ? 'selected' : ''}`}>
            <div className="row" onClick={() => handleItemClick(p._id)}>
              <div
                className="avatar"
                style={p.image ? { backgroundImage: `url(${p.image})` } : undefined}
              />
              <div className="info">
                <div className="name">{p.name || p.link}</div>
                <a className="link" href={p.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>{p.link}</a>
              </div>
              <button
                className={`status ${p.prospected ? 'prospected' : 'not-prospected'} ${confirmingId === p._id ? 'confirming' : ''}`}
                onClick={(e) => { e.stopPropagation(); handleStatusClick(p._id) }}
              >
                {confirmingId === p._id
                  ? `Change to ${p.prospected ? 'Not prospected' : 'Prospected'}?`
                  : p.prospected ? 'Prospected' : 'Not prospected'}
              </button>
            </div>

            {selectedId === p._id && (
              <div className="detail">
                {p.message && (
                  <div className="field">
                    <span className="label">Message</span>
                    <div className="message-lines">
                      {p.message.split('\n\n').filter(Boolean).map((line, i) => (
                        <span
                          key={i}
                          className={`copyable ${copiedText === line ? 'copied' : ''}`}
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(line) }}
                        >
                          {copiedText === line ? 'Copied!' : line}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {p.posts && p.posts.length > 0 && (
                  <div className="field">
                    <span className="label">Posts</span>
                    <div className="posts">
                      {p.posts.map((post, i) => (
                        <div key={i} className="post">
                          <a className="post-url" href={post.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            {post.url}
                          </a>
                          {post.comments.length > 0 && (
                            <ul className="comments">
                              {post.comments.map((c, j) => (
                                <li
                                  key={j}
                                  className={`copyable ${copiedText === c ? 'copied' : ''}`}
                                  onClick={(e) => { e.stopPropagation(); copyToClipboard(c) }}
                                >
                                  {copiedText === c ? 'Copied!' : c}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {p.data && Object.keys(p.data).length > 0 && (
                  <div className="field">
                    <span className="label">Data</span>
                    <pre className="value raw">{JSON.stringify(p.data, null, 2)}</pre>
                  </div>
                )}
                <div className="field">
                  <span className="label">Created</span>
                  <span className="value">{new Date(p.createdAt).toLocaleString()}</span>
                </div>
                <div className="field">
                  <span className="label">Updated</span>
                  <span className="value">{new Date(p.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
