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
    message, setMessage,
    posts, addPost, removePost, updatePostUrl, addComment, removeComment, updateComment,
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
          <label>Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Prospecting message..." />
        </div>

        <div className="field">
          <label>Posts</label>
          <div className="posts-editor">
            {posts.map((post, i) => (
              <div key={i} className="post-entry">
                <div className="post-header">
                  <input
                    value={post.url}
                    onChange={(e) => updatePostUrl(i, e.target.value)}
                    placeholder="Post URL"
                  />
                  <button className="remove-btn" onClick={() => removePost(i)}>x</button>
                </div>
                <div className="comments-list">
                  {post.comments.map((c, j) => (
                    <div key={j} className="comment-entry">
                      <input
                        value={c}
                        onChange={(e) => updateComment(i, j, e.target.value)}
                        placeholder="Comment"
                      />
                      <button className="remove-btn" onClick={() => removeComment(i, j)}>x</button>
                    </div>
                  ))}
                  <button className="add-small-btn" onClick={() => addComment(i)}>+ Comment</button>
                </div>
              </div>
            ))}
            <button className="add-small-btn" onClick={addPost}>+ Post</button>
          </div>
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
