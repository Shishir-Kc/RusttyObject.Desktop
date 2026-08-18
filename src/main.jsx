import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787'

const paths = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  box: <><path d="m21 8-9-5-9 5 9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></>,
  terminal: <><path d="m4 5 6 6-6 6" /><path d="M12 17h8" /></>,
  branch: <><circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><circle cx="18" cy="6" r="3" /><path d="M9 6h4a5 5 0 0 1 5 5v4" /><path d="M9 6v8a4 4 0 0 0 4 4h2" /></>,
  activity: <path d="M3 12h4l3-8 4 16 3-8h4" />,
  settings: <><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.5V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2.5h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h2.5v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v2.5H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  search: <><circle cx="10.7" cy="10.7" r="6.7" /><path d="m16 16 5 5" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  down: <path d="m6 9 6 6 6-6" />,
  more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  arrowUp: <><path d="m17 7-10 10" /><path d="M7 7h10v10" /></>,
  upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M5 20h14" /></>,
  download: <><path d="M12 4v12" /><path d="m7 11 5 5 5-5" /><path d="M5 20h14" /></>,
  file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" /><path d="M14 3v6h6" /></>,
  video: <><rect x="3" y="5" width="13" height="14" rx="2" /><path d="m16 10 5-3v10l-5-3" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 15-5-5L5 20" /></>,
  code: <><path d="m8 9-3 3 3 3" /><path d="m16 9 3 3-3 3" /><path d="m14 5-4 14" /></>,
  github: <><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.5 5.5 0 0 0 19.3 4 5.1 5.1 0 0 0 19.2.8S18 0.4 15 2.4a13.4 13.4 0 0 0-6 0C6 .4 4.8.8 4.8.8A5.1 5.1 0 0 0 4.7 4 5.5 5.5 0 0 0 3.2 7.5c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 9 18v4" /><path d="M9 18c-4.5 2-5-2-7-2" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
  external: <><path d="M14 5h5v5" /><path d="M19 5 10 14" /><path d="M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" /></>,
}

function Icon({ name, size = 18, strokeWidth = 1.7, className = '' }) {
  return <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const navItems = [
  { label: 'Overview', icon: 'grid' },
  { label: 'Buckets', icon: 'box' },
  { label: 'OQL terminal', icon: 'terminal' },
  { label: 'Repositories', icon: 'branch' },
  { label: 'Activity log', icon: 'activity' },
]

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...options })
  const body = response.status === 204 ? null : await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body?.error || `Request failed (${response.status})`)
  return body
}

const RECENT_REPOSITORIES_KEY = 'rusttyobject.recentRepositories'

function readRecentRepositories() {
  try {
    const value = JSON.parse(localStorage.getItem(RECENT_REPOSITORIES_KEY) || '[]')
    return Array.isArray(value) ? value.slice(0, 4) : []
  } catch { return [] }
}

function formatBytes(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unit = -1
  while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit += 1 }
  return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[unit]}`
}

function initials(user) {
  return (user?.name || user?.login || 'U').split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

function Logo() {
  return <div className="brand-lockup"><div className="brand-mark"><span>R</span><i /></div><div><div className="brand-name">Rustty<span>Object</span></div><div className="brand-caption">OBJECT STORAGE</div></div></div>
}

function StatusPill({ children, tone = 'neutral', dot = true }) {
  return <span className={`status-pill ${tone}`}>{dot && <span className="status-dot" />}{children}</span>
}

function LoginScreen({ error }) {
  return <div className="login-shell"><div className="login-card"><Logo /><span className="eyebrow login-eyebrow"><span className="eyebrow-line" /> GITHUB-NATIVE OBJECT STORAGE</span><h1>Put your repositories to work.</h1><p>Sign in with GitHub, choose a repository, and turn its files into queryable buckets.</p>{error && <div className="error-banner">{error}</div>}<a className="primary-button login-button" href={`${API_BASE}/auth/github`}><Icon name="github" size={17} /> Continue with GitHub</a><small className="login-note">RusttyObject requests repository read/write access so uploads can be committed to GitHub.</small></div></div>
}

function BucketIcon({ tone = 'green' }) { return <span className={`bucket-icon ${tone}`}><Icon name="box" size={19} /></span> }
function ObjectIcon({ object }) {
  const icon = object.content_type?.startsWith('video/') ? 'video' : object.content_type?.startsWith('image/') ? 'image' : object.content_type?.includes('json') || object.content_type?.includes('javascript') ? 'code' : 'file'
  return <span className={`object-icon ${icon === 'video' ? 'pink' : icon === 'image' ? 'green' : 'orange'}`}><Icon name={icon} size={17} /></span>
}
function Toggle({ checked, onChange }) { return <button className={`toggle ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)} aria-label={checked ? 'Disable setting' : 'Enable setting'}><span /></button> }
function MetricCard({ label, value, detail, icon }) { return <article className="metric-card"><div className="metric-card-top"><span className="metric-label">{label}</span><span className="metric-icon"><Icon name={icon} size={17} /></span></div><div className="metric-value">{value}</div><div className="metric-bottom"><span>{detail}</span><span className="trend up"><Icon name="arrowUp" size={13} /> live</span></div></article> }
function FeatureHeader({ eyebrow, title, subtitle, children }) { return <div className="page-heading feature-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> {eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div><div className="heading-actions">{children}</div></div> }

function UploadModal({ repository, buckets, onClose, onUploaded }) {
  const [file, setFile] = useState(null)
  const [bucket, setBucket] = useState(buckets[0]?.name || 'root')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const submit = async () => {
    if (!file) return setError('Choose a file first.')
    setBusy(true); setError('')
    try {
      const form = new FormData(); form.append('file', file); form.append('bucket', bucket)
      await api(`/api/repositories/${encodeURIComponent(repository.owner.login)}/${encodeURIComponent(repository.name)}/files`, { method: 'POST', body: form })
      await onUploaded(); onClose()
    } catch (uploadError) { setError(uploadError.message) } finally { setBusy(false) }
  }
  return <div className="modal-backdrop" onClick={onClose}><div className="upload-modal" onClick={(event) => event.stopPropagation()}><div className="modal-head"><div><div className="modal-icon"><Icon name="upload" size={20} /></div><h2>New object</h2><p>Upload a file to <strong>{repository.full_name}</strong>.</p></div><button className="modal-close" onClick={onClose}><Icon name="close" size={18} /></button></div><label className="dropzone upload-dropzone"><input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} /> <div className="dropzone-icon"><Icon name="upload" size={22} /></div><strong>{file ? file.name : 'Choose an object'}</strong><span>{file ? formatBytes(file.size) : 'Click to browse from your computer'}</span><small>GitHub Contents API limit: 100 MB</small></label><label className="modal-label">Destination bucket<select value={bucket} onChange={(event) => setBucket(event.target.value)}>{buckets.length ? buckets.map((item) => <option key={item.name}>{item.name}</option>) : <option>root</option>}</select></label>{error && <div className="error-banner">{error}</div>}<div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={busy} onClick={submit}><Icon name="upload" size={16} /> {busy ? 'Committing…' : 'Upload to GitHub'}</button></div></div></div>
}

function ObjectTable({ objects, empty = 'No files in this repository yet.', onOpen }) {
  return <div className="table-scroll"><table><thead><tr><th>Object</th><th>Bucket</th><th>Type</th><th>Size</th><th>SHA</th></tr></thead><tbody>{objects.map((object) => <tr className={onOpen ? 'object-preview-row' : ''} title={onOpen ? 'Open preview' : undefined} key={object.path} onClick={() => onOpen?.(object)}><td><div className="object-cell"><ObjectIcon object={object} /><span><strong>{object.name}</strong><small>/{object.path}</small></span></div></td><td className="bucket-name-cell">{object.bucket}</td><td><span className="type-label">{object.content_type}</span></td><td className="mono-cell">{formatBytes(object.size)}</td><td className="mono-cell">{object.sha ? `${object.sha.slice(0, 7)}…` : '—'}</td></tr>)}{objects.length === 0 && <tr><td colSpan="5" className="empty-state">{empty}</td></tr>}</tbody></table></div>
}

function TextPreview({ url, name }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    fetch(url, { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Could not load ${name} (${response.status})`)
        return response.text()
      })
      .then((value) => { if (active) setContent(value) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [url, name])

  if (loading) return <div className="text-preview-state">Loading file contents…</div>
  if (error) return <div className="text-preview-state text-preview-error">{error}</div>
  return <pre className="text-preview" aria-label={`Contents of ${name}`}>{content}</pre>
}

function PreviewModal({ object, repository, onClose }) {
  const protectedUrl = `${API_BASE}/api/repositories/${encodeURIComponent(repository.owner.login)}/${encodeURIComponent(repository.name)}/file?path=${encodeURIComponent(object.path)}&branch=${encodeURIComponent(repository.default_branch)}`
  const rawUrl = repository.private ? protectedUrl : (object.raw_url || object.download_url || protectedUrl)
  const previewUrl = repository.private ? protectedUrl : rawUrl
  const urlLabel = repository.private ? 'Authenticated preview URL' : 'Public raw GitHub URL'
  const type = object.content_type || 'application/octet-stream'
  const isImage = type.startsWith('image/')
  const isVideo = type.startsWith('video/')
  const isAudio = type.startsWith('audio/')
  const fileName = object.name.toLowerCase()
  const extension = fileName.includes('.') ? fileName.split('.').pop() : ''
  const textExtensions = new Set(['adoc', 'astro', 'bash', 'bat', 'c', 'cc', 'conf', 'config', 'cpp', 'cs', 'css', 'csv', 'dart', 'diff', 'dockerignore', 'editorconfig', 'elm', 'env', 'ex', 'exs', 'fs', 'fsx', 'gitattributes', 'gitignore', 'go', 'graphql', 'h', 'hcl', 'hpp', 'htm', 'html', 'ini', 'java', 'jl', 'js', 'json', 'jsx', 'kt', 'less', 'liquid', 'lock', 'log', 'lua', 'map', 'md', 'mdix', 'mdx', 'markdown', 'mjs', 'nim', 'npmrc', 'patch', 'perl', 'php', 'pl', 'prettierrc', 'proto', 'properties', 'ps1', 'py', 'r', 'rb', 'rs', 'sass', 'scss', 'sh', 'sql', 'svelte', 'swift', 'tex', 'tf', 'toml', 'ts', 'tsx', 'txt', 'v', 'vue', 'xml', 'yaml', 'yml', 'zsh'])
  const isTextLike = !isImage && (type.startsWith('text/') || type.includes('json') || type.includes('xml') || type.includes('javascript') || textExtensions.has(extension) || ['dockerfile', 'makefile', 'license', 'readme'].includes(fileName))
  const isPdf = type === 'application/pdf' || extension === 'pdf'
  const embeddedUrl = isTextLike || isPdf ? protectedUrl : previewUrl
  const copyRawUrl = () => navigator.clipboard?.writeText(rawUrl)
  return <div className="modal-backdrop preview-backdrop" onClick={onClose}><div className="preview-modal" onClick={(event) => event.stopPropagation()}><div className="preview-head"><div><span className="eyebrow compact-eyebrow">OBJECT PREVIEW</span><h2>{object.name}</h2><p>{object.path} · {formatBytes(object.size)} · {type}</p></div><div className="preview-actions"><a className="secondary-button" href={previewUrl} target="_blank" rel="noreferrer"><Icon name="download" size={14} /> Open original</a><button className="modal-close" onClick={onClose}><Icon name="close" size={18} /></button></div></div><div className="raw-url-row"><span><small>{urlLabel}</small><code>{rawUrl}</code></span><button className="copy-setting" onClick={copyRawUrl}><Icon name="copy" size={14} /> Copy URL</button></div><div className={`preview-stage ${isImage ? 'image-stage' : ''}`}>{isImage && <img src={previewUrl} alt={object.name} />}{isVideo && <video controls playsInline preload="metadata" src={previewUrl}>Your browser cannot play this video.</video>}{isAudio && <audio controls src={previewUrl}>Your browser cannot play this audio.</audio>}{isTextLike && <TextPreview url={embeddedUrl} name={object.name} />}{isPdf && <iframe title={`Preview of ${object.name}`} src={embeddedUrl} />}{!isImage && !isVideo && !isAudio && !isTextLike && !isPdf && <div className="unsupported-preview"><ObjectIcon object={object} /><strong>This file type is not embeddable</strong><p>Open the original file in a new tab to view or download it.</p><a className="primary-button" href={previewUrl} target="_blank" rel="noreferrer"><Icon name="external" size={15} /> Open file</a></div>}</div></div></div>
}

function ProfileModal({ profile, loading, error, onClose }) {
  if (loading) return <div className="modal-backdrop" onClick={onClose}><div className="profile-modal loading-profile" onClick={(event) => event.stopPropagation()}>Loading GitHub profile…</div></div>
  if (error) return <div className="modal-backdrop" onClick={onClose}><div className="profile-modal" onClick={(event) => event.stopPropagation()}><div className="preview-head"><h2>GitHub profile</h2><button className="modal-close" onClick={onClose}><Icon name="close" size={18} /></button></div><div className="error-banner">{error}</div></div></div>
  if (!profile) return null
  const { user, stats, activities } = profile
  return <div className="modal-backdrop" onClick={onClose}><div className="profile-modal" onClick={(event) => event.stopPropagation()}><div className="profile-head"><img src={user.avatar_url} alt={user.login} /><div><span className="eyebrow compact-eyebrow">GITHUB PROFILE</span><h2>{user.name || user.login}</h2><p>@{user.login} · <a href={user.html_url} target="_blank" rel="noreferrer">View on GitHub</a></p></div><button className="modal-close" onClick={onClose}><Icon name="close" size={18} /></button></div>{user.bio && <p className="profile-bio">{user.bio}</p>}<div className="profile-stats"><div><strong>{stats.total_contributions}</strong><span>Total contributions</span></div><div><strong>{stats.repositories}</strong><span>Repositories</span></div><div><strong>{stats.public_repositories}</strong><span>Public repos</span></div><div><strong>{stats.followers}</strong><span>Followers</span></div><div><strong>{stats.following}</strong><span>Following</span></div></div><div className="profile-activity"><div className="profile-section-head"><div><h3>Recent GitHub activity</h3><p>Latest events from @{user.login}</p></div><Icon name="activity" size={16} /></div>{activities.length ? activities.map((activity) => <a className="profile-activity-row" key={activity.id} href={activity.url || user.html_url} target="_blank" rel="noreferrer"><span className="activity-mark"><Icon name="branch" size={14} /></span><span><strong>{activity.kind}</strong><small>{activity.repository || 'GitHub'} · {activity.created_at ? new Date(activity.created_at).toLocaleString() : 'recently'}</small></span><Icon name="external" size={13} /></a>) : <div className="empty-state">No recent public activity.</div>}</div></div></div>
}

function NotificationsPanel({ notifications, loading, error, onRefresh, onClose }) {
  return <div className="notification-panel"><div className="notification-head"><div><h2>Notifications</h2><p>GitHub notifications for your account</p></div><div><button className="notification-refresh" onClick={onRefresh} disabled={loading}><Icon name="activity" size={14} /></button><button className="modal-close" onClick={onClose}><Icon name="close" size={16} /></button></div></div>{error && <div className="error-banner">{error}</div>}{loading ? <div className="notification-empty">Loading GitHub notifications…</div> : notifications.length ? <div className="notification-list">{notifications.map((notification) => <a className={`notification-item ${notification.unread ? 'unread' : ''}`} key={notification.id} href={notification.url} target="_blank" rel="noreferrer"><span className="notification-mark"><Icon name="bell" size={14} /></span><span><strong>{notification.title}</strong><small>{notification.repository} · {notification.reason || notification.kind || 'GitHub update'}</small><time>{notification.updated_at ? new Date(notification.updated_at).toLocaleString() : ''}</time></span>{notification.unread && <i />}</a>)}</div> : <div className="notification-empty"><Icon name="check" size={18} /> You’re all caught up.</div>}</div>
}

function BucketsPage({ buckets, objects, openUpload, onPreview }) {
  const [selected, setSelected] = useState(buckets[0]?.name || 'root')
  const [search, setSearch] = useState('')
  const current = buckets.find((bucket) => bucket.name === selected) || buckets[0] || { name: 'root', objects: 0, size: 0 }
  const visible = objects.filter((object) => object.bucket === current.name && `${object.name} ${object.content_type}`.toLowerCase().includes(search.toLowerCase()))
  return <div className="feature-page"><FeatureHeader eyebrow="WORKSPACE / BUCKETS" title="Buckets" subtitle="Directories in the selected GitHub repository become storage buckets."><button className="primary-button" onClick={openUpload}><Icon name="upload" size={16} /> Upload object</button></FeatureHeader><div className="feature-stats"><div className="mini-stat"><span>Total buckets</span><strong>{String(buckets.length).padStart(2, '0')}</strong><small>derived from repository paths</small></div><div className="mini-stat"><span>Total objects</span><strong>{objects.length}</strong><small>indexed from GitHub</small></div><div className="mini-stat"><span>Storage used</span><strong>{formatBytes(objects.reduce((sum, object) => sum + object.size, 0))}</strong><small>repository contents</small></div><div className="mini-stat"><span>Sync status</span><strong>Live</strong><small className="positive">GitHub-backed</small></div></div><div className="bucket-browser"><aside className="panel bucket-directory"><div className="directory-head"><div><h2>All buckets</h2><p>{buckets.length} storage spaces</p></div></div><div className="directory-search"><Icon name="search" size={15} /><input placeholder="Find a bucket" /></div><div className="directory-list">{buckets.map((bucket, index) => <button key={bucket.name} className={`directory-item ${selected === bucket.name ? 'active' : ''}`} onClick={() => setSelected(bucket.name)}><BucketIcon tone={['violet', 'blue', 'green'][index % 3]} /><span><strong>{bucket.name}</strong><small>{bucket.objects} objects · {formatBytes(bucket.size)}</small></span><Icon name="chevron" size={14} /></button>)}</div></aside><div className="bucket-detail"><div className="panel bucket-detail-card"><div className="bucket-detail-top"><div className="bucket-detail-name"><BucketIcon /><div><div className="detail-title-row"><h2>{current.name}</h2><StatusPill tone="success">Synced</StatusPill></div><p>GitHub directory bucket · {current.objects} objects</p></div></div><button className="secondary-button" onClick={openUpload}><Icon name="upload" size={15} /> Upload</button></div><div className="bucket-detail-metrics"><div><span>Objects</span><strong>{current.objects}</strong></div><div><span>Storage used</span><strong>{formatBytes(current.size)}</strong></div><div><span>Source</span><strong>GitHub</strong></div><div><span>Access</span><strong>Private</strong></div></div></div><div className="panel object-index-card"><div className="table-heading"><div><h2>Object index</h2><p>Files currently stored in {current.name}</p></div><div className="inline-search"><Icon name="search" size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search objects" /></div></div><ObjectTable objects={visible} onOpen={onPreview} /></div></div></div></div>
}

function RepositoriesPage({ repositories, selectedRepository, onSelect }) {
  const [pickerOpen, setPickerOpen] = useState(false)
  return <div className="feature-page"><FeatureHeader eyebrow="WORKSPACE / GITHUB" title="Repositories" subtitle="Choose which GitHub repository is your active object store."><button className="primary-button" onClick={() => setPickerOpen(true)}><Icon name="branch" size={16} /> Choose repository</button></FeatureHeader><div className="repo-summary"><div className="repo-connection"><span className="github-large"><Icon name="github" size={23} /></span><div><span className="repo-overline">ACTIVE GITHUB REPOSITORY</span><strong>{selectedRepository?.full_name || 'No repository selected'}</strong><small>{selectedRepository ? `${selectedRepository.private ? 'Private' : 'Public'} · default branch ${selectedRepository.default_branch}` : 'Choose a repository to begin'}</small></div><StatusPill tone={selectedRepository ? 'success' : 'warning'}>{selectedRepository ? 'Connected' : 'Select one'}</StatusPill></div><div className="repo-health"><div><span>Accessible repositories</span><strong>{repositories.length}</strong></div><div><span>Current branch</span><strong>{selectedRepository?.default_branch || '—'}</strong></div><div><span>Sync model</span><strong>GitHub API</strong></div></div></div><div className="repository-panel panel"><div className="panel-heading table-heading"><div><h2>Available repositories</h2><p>Repositories are loaded from the signed-in GitHub account.</p></div></div><div className="table-scroll"><table><thead><tr><th>Repository</th><th>Visibility</th><th>Branch</th><th>Updated</th><th /></tr></thead><tbody>{repositories.map((repo) => <tr key={repo.id} className={selectedRepository?.id === repo.id ? 'selected-row' : ''} onClick={() => onSelect(repo)}><td><div className="repository-cell"><span className="repo-icon green"><Icon name="github" size={16} /></span><span><strong>{repo.full_name}</strong><small>{repo.html_url}</small></span></div></td><td>{repo.private ? 'Private' : 'Public'}</td><td><span className="branch-label"><Icon name="branch" size={13} /> {repo.default_branch}</span></td><td className="muted-cell">{repo.updated_at ? new Date(repo.updated_at).toLocaleDateString() : '—'}</td><td><button className="secondary-button" onClick={(event) => { event.stopPropagation(); onSelect(repo) }}>{selectedRepository?.id === repo.id ? 'Selected' : 'Select'}</button></td></tr>)}</tbody></table></div></div>{pickerOpen && <div className="modal-backdrop" onClick={() => setPickerOpen(false)}><div className="upload-modal feature-modal repo-picker" onClick={(event) => event.stopPropagation()}><div className="modal-head"><div><div className="modal-icon github-modal-icon"><Icon name="github" size={20} /></div><h2>Choose repository</h2><p>RusttyObject will index its default branch.</p></div><button className="modal-close" onClick={() => setPickerOpen(false)}><Icon name="close" size={18} /></button></div><div className="repo-picker-list">{repositories.map((repo) => <button key={repo.id} onClick={() => { onSelect(repo); setPickerOpen(false) }}><span className="repo-icon green"><Icon name="github" size={16} /></span><span><strong>{repo.full_name}</strong><small>{repo.private ? 'Private' : 'Public'} · {repo.default_branch}</small></span><Icon name="chevron" size={15} /></button>)}</div></div></div>}</div>
}

function QueryPage({ objects, onPreview }) {
  const [query, setQuery] = useState('SELECT * FROM objects LIMIT 20')
  const [ran, setRan] = useState(false)
  return <div className="feature-page oql-page"><FeatureHeader eyebrow="WORKSPACE / QUERY" title="OQL terminal" subtitle="Query the live object index from the selected GitHub repository."><button className="primary-button" onClick={() => setRan(true)}><Icon name="terminal" size={16} /> Run query</button></FeatureHeader><div className="oql-layout"><aside className="panel oql-explorer"><div className="explorer-head"><h2>Schema explorer</h2></div><p className="explorer-caption">Available fields across objects</p>{['name', 'path', 'bucket', 'content_type', 'size', 'sha'].map((field) => <div className="schema-field" key={field}><span className="field-type string">Aa</span>{field}</div>)}</aside><div className="oql-workspace"><div className="console-shell full-console"><div className="console-top"><div className="console-title"><span className="terminal-icon"><Icon name="terminal" size={17} /></span><div><h2>query.oql</h2><p>{objects.length} objects available</p></div></div><StatusPill tone="dark">OQL v1</StatusPill></div><div className="console-body"><div className="console-editor"><textarea className="query-textarea query-editor-standalone" value={query} onChange={(event) => setQuery(event.target.value)} spellCheck="false" /><div className="editor-actions"><button className="run-button" onClick={() => setRan(true)}><Icon name="play" size={13} /> Run query</button></div></div><div className="console-output"><div className="output-head"><span>OUTPUT</span><span className="output-time">{ran ? `${Math.min(objects.length, 20)} objects returned` : 'Ready'}</span></div>{ran ? <div className="query-result">{objects.slice(0, 4).map((object) => <button className="result-row result-preview-row" key={object.path} onClick={() => onPreview?.(object)}><span>{object.path}</span><span>{formatBytes(object.size)}</span></button>)}</div> : <div className="output-placeholder"><span className="prompt">›</span><span>Run a query to see results here</span></div>}</div></div></div></div></div></div>
}

function ActivityPage({ objects, repository }) { return <div className="feature-page"><FeatureHeader eyebrow="WORKSPACE / AUDIT" title="Activity log" subtitle="GitHub commits are the audit trail for every object change." /><div className="activity-summary"><div className="mini-stat"><span>Indexed objects</span><strong>{objects.length}</strong><small>{repository?.full_name || 'No repository'}</small></div><div className="mini-stat"><span>Write path</span><strong>API</strong><small>GitHub Contents API</small></div><div className="mini-stat"><span>Auth</span><strong>OAuth</strong><small>GitHub account</small></div><div className="mini-stat"><span>State</span><strong>Live</strong><small className="positive">Connected</small></div></div><div className="panel audit-note audit-note-large"><span className="note-icon"><Icon name="check" size={16} /></span><div><strong>Changes are committed directly to GitHub</strong><p>Uploads from this console and the CLI use the selected repository and branch. The repository history remains the source of truth.</p></div></div></div> }

function SettingsPage({ user, onLogout }) { const [autoSync, setAutoSync] = useState(true); return <div className="feature-page settings-page"><FeatureHeader eyebrow="WORKSPACE / SETTINGS" title="Settings" subtitle="Control your GitHub connection and sync behavior."><button className="secondary-button" onClick={onLogout}>Sign out</button></FeatureHeader><div className="settings-layout"><aside className="panel settings-nav"><div className="settings-nav-label">Configuration</div><button className="active"><Icon name="github" size={16} /><span>GitHub connection</span></button><div className="settings-nav-bottom"><StatusPill tone="success">Authenticated</StatusPill><small>{user.login}</small></div></aside><div className="settings-content"><div className="panel settings-card"><div className="github-setting-banner"><span className="github-large"><Icon name="github" size={21} /></span><span><strong>{user.name || user.login}</strong><small>@{user.login} · GitHub OAuth session</small></span><StatusPill tone="success">Connected</StatusPill></div><div className="setting-toggle-row"><span><strong>Automatic GitHub sync</strong><small>Frontend uploads become GitHub commits immediately.</small></span><Toggle checked={autoSync} onChange={setAutoSync} /></div><button className="danger-outline" onClick={onLogout}><Icon name="close" size={14} /> Sign out of GitHub</button></div></div></div></div> }

function Overview({ repository, objects, buckets, openUpload, setActiveNav, onPreview }) {
  const filtered = objects.slice(0, 8)
  const storage = objects.reduce((sum, object) => sum + object.size, 0)
  return <div className="overview-content"><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> WORKSPACE / MAIN</div><h1>Storage overview</h1><p>{repository.full_name} · files synced from GitHub and ready to query.</p></div><div className="heading-actions"><button className="primary-button" onClick={openUpload}><Icon name="plus" size={17} /> New object</button></div></div><section className="metrics-grid"><MetricCard label="Storage used" value={formatBytes(storage)} detail="from selected repository" icon="activity" /><MetricCard label="Total objects" value={objects.length} detail="indexed files" icon="box" /><MetricCard label="Active buckets" value={String(buckets.length).padStart(2, '0')} detail="directory namespaces" icon="grid" /><MetricCard label="Connection" value="Live" detail="GitHub API" icon="check" /></section><section className="panel buckets-panel"><div className="panel-heading table-heading"><div><h2>Buckets</h2><p>Directories in {repository.full_name}</p></div><button className="secondary-button" onClick={() => setActiveNav('Buckets')}>Browse buckets <Icon name="arrowUp" size={14} /></button></div><div className="table-scroll"><table><thead><tr><th>Bucket name</th><th>Objects</th><th>Storage used</th><th>Status</th></tr></thead><tbody>{buckets.map((bucket, index) => <tr key={bucket.name}><td><div className="bucket-cell"><BucketIcon tone={['violet', 'blue', 'green'][index % 3]} /><span><strong>{bucket.name}</strong><small>GitHub directory</small></span></div></td><td className="mono-cell">{bucket.objects}</td><td className="mono-cell">{formatBytes(bucket.size)}</td><td><StatusPill tone="success">Synced</StatusPill></td></tr>)}</tbody></table></div></section><section className="panel objects-panel"><div className="panel-heading table-heading"><div><h2>Recent objects</h2><p>Latest files in the active repository</p></div><button className="secondary-button" onClick={() => setActiveNav('OQL terminal')}>Open query <Icon name="terminal" size={14} /></button></div><ObjectTable objects={filtered} onOpen={onPreview} /></section></div>
}

function App() {
  const [auth, setAuth] = useState({ loading: true, user: null, error: '' })
  const [repositories, setRepositories] = useState([])
  const [selectedRepository, setSelectedRepository] = useState(null)
  const [index, setIndex] = useState({ objects: [], buckets: [], loading: false })
  const [activeNav, setActiveNav] = useState('Overview')
  const [search, setSearch] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [previewObject, setPreviewObject] = useState(null)
  const [mobileNav, setMobileNav] = useState(false)
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [recentRepositories, setRecentRepositories] = useState(readRecentRepositories)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [notificationsError, setNotificationsError] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')

  const loadObjects = async (repo = selectedRepository) => {
    if (!repo) return
    setIndex((current) => ({ ...current, loading: true }))
    try { const data = await api(`/api/repositories/${encodeURIComponent(repo.owner.login)}/${encodeURIComponent(repo.name)}/objects?branch=${encodeURIComponent(repo.default_branch)}`); setIndex({ objects: data.objects || [], buckets: data.buckets || [], loading: false }) } catch (error) { setAuth((current) => ({ ...current, error: error.message })); setIndex((current) => ({ ...current, loading: false })) }
  }
  useEffect(() => { api('/api/session').then((data) => setAuth({ loading: false, user: data.user, error: '' })).catch((error) => setAuth({ loading: false, user: null, error: error.message })) }, [])
  useEffect(() => { if (!auth.user) return; api('/api/repositories').then((repos) => { setRepositories(repos); const available = new Set(repos.map((repo) => repo.id)); setRecentRepositories((current) => current.filter((repo) => available.has(repo.id)).slice(0, 4)); const recent = recentRepositories.map((repo) => repo.id); setSelectedRepository((current) => current || repos.find((repo) => recent.includes(repo.id)) || repos[0] || null) }).catch((error) => setAuth((current) => ({ ...current, error: error.message }))) }, [auth.user])
  useEffect(() => { loadObjects() }, [selectedRepository?.id])

  const visibleObjects = useMemo(() => index.objects.filter((object) => `${object.name} ${object.path} ${object.bucket} ${object.content_type}`.toLowerCase().includes(search.toLowerCase())), [index.objects, search])
  const rememberRepository = (repo) => { setRecentRepositories((current) => { const next = [repo, ...current.filter((item) => item.id !== repo.id)].slice(0, 4); localStorage.setItem(RECENT_REPOSITORIES_KEY, JSON.stringify(next)); return next }) }
  const selectRepository = (repo) => { rememberRepository(repo); setSelectedRepository(repo); setPreviewObject(null); setWorkspaceOpen(false); setActiveNav('Overview') }
  const loadNotifications = async () => { setNotificationsLoading(true); setNotificationsError(''); try { setNotifications(await api('/api/notifications')) } catch (error) { setNotificationsError(error.message) } finally { setNotificationsLoading(false) } }
  const openNotifications = () => { setNotificationsOpen((open) => !open); setProfileOpen(false); if (!notifications.length) loadNotifications() }
  const openProfile = async () => { setProfileOpen(true); setNotificationsOpen(false); if (profile || profileLoading) return; setProfileLoading(true); setProfileError(''); try { setProfile(await api('/api/profile')) } catch (error) { setProfileError(error.message) } finally { setProfileLoading(false) } }
  const logout = async () => { await api('/api/auth/logout', { method: 'POST' }).catch(() => {}); setAuth({ loading: false, user: null, error: '' }) }
  if (auth.loading) return <div className="loading-screen">Loading RusttyObject…</div>
  if (!auth.user) return <LoginScreen error={auth.error} />
  if (!selectedRepository) return <div className="empty-workspace"><Logo /><h1>Choose a GitHub repository</h1><p>RusttyObject needs a repository before it can index files.</p>{repositories.length ? <div className="repo-picker-list empty-repo-list">{repositories.map((repo) => <button key={repo.id} onClick={() => selectRepository(repo)}><span className="repo-icon green"><Icon name="github" size={16} /></span><span><strong>{repo.full_name}</strong><small>{repo.private ? 'Private' : 'Public'} · {repo.default_branch}</small></span><Icon name="chevron" size={15} /></button>)}</div> : <span className="login-note">No repositories were returned for this GitHub account.</span>}</div>

  return <div className="app-shell"><aside className={`sidebar ${mobileNav ? 'open' : ''}`}><div className="sidebar-head"><Logo /><button className="mobile-close" onClick={() => setMobileNav(false)}><Icon name="close" size={18} /></button></div><div className="workspace-picker"><button className="workspace-switcher" onClick={() => { setWorkspaceOpen((open) => !open); setNotificationsOpen(false); setProfileOpen(false) }}><span className="workspace-avatar">{initials(auth.user).slice(0, 1)}</span><span className="workspace-copy"><strong>{selectedRepository.full_name}</strong><small>{selectedRepository.default_branch} branch</small></span><Icon name="down" size={15} /></button>{workspaceOpen && <div className="workspace-menu"><span className="workspace-menu-label">RECENT REPOSITORIES</span>{recentRepositories.length ? recentRepositories.map((repo) => <button className={`workspace-menu-item ${repo.id === selectedRepository.id ? 'active' : ''}`} key={repo.id} onClick={() => selectRepository(repo)}><span className="repo-icon green"><Icon name="github" size={14} /></span><span><strong>{repo.full_name}</strong><small>{repo.default_branch} branch</small></span>{repo.id === selectedRepository.id && <Icon name="check" size={14} />}</button>) : <span className="workspace-menu-empty">No recent repositories.</span>}<button className="workspace-menu-browse" onClick={() => { setActiveNav('Repositories'); setWorkspaceOpen(false) }}>Browse all repositories <Icon name="arrowUp" size={13} /></button></div>}</div><nav className="side-nav"><div className="nav-section-label">Workspace</div>{navItems.map((item) => <button key={item.label} className={`nav-item ${activeNav === item.label ? 'active' : ''}`} onClick={() => { setActiveNav(item.label); setMobileNav(false) }}><Icon name={item.icon} size={17} /><span>{item.label}</span>{item.label === 'Buckets' && <em>{String(index.buckets.length).padStart(2, '0')}</em>}</button>)}<div className="nav-section-label system-label">System</div><button className={`nav-item ${activeNav === 'Settings' ? 'active' : ''}`} onClick={() => setActiveNav('Settings')}><Icon name="settings" size={17} /><span>Settings</span></button></nav><div className="sidebar-bottom"><div className="sync-card"><div className="sync-card-row"><span className="github-small"><Icon name="github" size={14} /></span><span><strong>GitHub connected</strong><small>{selectedRepository.full_name}</small></span><span className="live-dot" /></div><div className="sync-progress"><span /></div><div className="sync-foot"><span>Indexed objects</span><span>{index.loading ? 'loading…' : index.objects.length}</span></div></div><button className="user-row" onClick={openProfile}><span className="user-avatar"><img src={auth.user.avatar_url} alt="" /></span><span><strong>{auth.user.name || auth.user.login}</strong><small>@{auth.user.login}</small></span><Icon name="chevron" size={14} className="user-more" /></button></div></aside><main className="main-content"><header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(true)}><Icon name="grid" size={20} /></button><div className="breadcrumbs"><span>RusttyObject</span><Icon name="chevron" size={13} /><strong>{activeNav}</strong></div><div className="topbar-actions"><div className="global-search"><Icon name="search" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search objects..." /></div><div className="notification-wrap"><button className="icon-button notification" onClick={openNotifications}><Icon name="bell" size={18} />{notifications.some((notification) => notification.unread) && <i />}</button>{notificationsOpen && <NotificationsPanel notifications={notifications} loading={notificationsLoading} error={notificationsError} onRefresh={loadNotifications} onClose={() => setNotificationsOpen(false)} />}</div><button className="avatar-button" onClick={openProfile}><img src={auth.user.avatar_url} alt={auth.user.login} /></button></div></header><div className={`page-wrap ${activeNav !== 'Overview' ? 'detail-mode' : ''}`}>{activeNav === 'Overview' && <Overview repository={selectedRepository} objects={visibleObjects} buckets={index.buckets} openUpload={() => setShowUpload(true)} setActiveNav={setActiveNav} onPreview={setPreviewObject} />}{activeNav === 'Buckets' && <BucketsPage buckets={index.buckets} objects={visibleObjects} openUpload={() => setShowUpload(true)} onPreview={setPreviewObject} />}{activeNav === 'Repositories' && <RepositoriesPage repositories={repositories} selectedRepository={selectedRepository} onSelect={selectRepository} />}{activeNav === 'OQL terminal' && <QueryPage objects={visibleObjects} onPreview={setPreviewObject} />}{activeNav === 'Activity log' && <ActivityPage objects={index.objects} repository={selectedRepository} />}{activeNav === 'Settings' && <SettingsPage user={auth.user} onLogout={logout} />}</div></main>{showUpload && <UploadModal repository={selectedRepository} buckets={index.buckets} onClose={() => setShowUpload(false)} onUploaded={() => loadObjects(selectedRepository)} />}{previewObject && <PreviewModal object={previewObject} repository={selectedRepository} onClose={() => setPreviewObject(null)} />}{profileOpen && <ProfileModal profile={profile} loading={profileLoading} error={profileError} onClose={() => setProfileOpen(false)} />}</div>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
