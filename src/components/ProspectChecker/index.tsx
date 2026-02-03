'use client'

import { useProspectChecker } from './useProspectChecker'
import './ProspectChecker.scss'

export interface Props {
  className?: string
}

export default function ProspectChecker({ className }: Props) {
  const { link, setLink, result, loading, error, disabled, handleCheck, handleMark } =
    useProspectChecker()

  return (
    <div className={`ProspectChecker ${className ?? ''}`}>
      <h2>Prospect checker</h2>
      <div className="controls">
        <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Link" />
        <button onClick={handleCheck} disabled={disabled}>Check</button>
        <button onClick={handleMark} disabled={disabled}>Mark prospected</button>
      </div>
      {loading && <p className="loading">Loading…</p>}
      {error && <p className="error">{error}</p>}
      {result && <pre className="result">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}
