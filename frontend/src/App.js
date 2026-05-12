import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:5000/api';

export default function App() {
  const [tab, setTab] = useState('editor');
  const [file, setFile] = useState(null);
  const [jsxCode, setJsxCode] = useState('');
  const [templates, setTemplates] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [backendOnline, setBackendOnline] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSteps, setAiSteps] = useState([]);
  const [aiBanner, setAiBanner] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPromptIgnored, setAiPromptIgnored] = useState(false);
  const [aiCfg, setAiCfg] = useState(null);
  const [commands, setCommands] = useState([]);
  const [batchFiles, setBatchFiles] = useState([]);
  const [batchCommandId, setBatchCommandId] = useState('');
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchId, setBatchId] = useState('');
  const [batchStatus, setBatchStatus] = useState(null);
  const fileInputRef = useRef();

  const loadCommands = async () => {
    try {
      const { data } = await axios.get(`${API}/commands`);
      setCommands(data.commands || []);
      if (!batchCommandId && data.commands && data.commands.length) {
        setBatchCommandId(data.commands[0].id);
      }
    } catch (e) {
      setCommands([]);
    }
  };

  const loadAiConfig = async () => {
    try {
      const { data } = await axios.get(`${API}/ai/config`);
      setAiCfg(data);
    } catch {
      setAiCfg({ configured: false });
    }
  };

  useEffect(() => {
    checkBackend();
    loadTemplates();
    loadJobs();
    loadAiConfig();
    loadCommands();
  }, []);

  const checkBackend = async () => {
    try {
      await axios.get(`http://localhost:5000/api/health`);
      setBackendOnline(true);
      loadAiConfig();
    } catch {
      setBackendOnline(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const { data } = await axios.get(`${API}/templates`);
      setTemplates(data.templates || {});
    } catch (err) {
      console.error('Failed to load templates:', err);
    }
  };

  const loadJobs = async () => {
    try {
      const { data } = await axios.get(`${API}/illustrator/jobs`);
      setJobs(data.jobs || []);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    }
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const formData = new FormData();
    formData.append('file', uploadedFile);
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(`${API}/illustrator/upload`, formData);
      setFile(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!file) {
      setError('Please upload a file first');
      return;
    }
    if (!jsxCode.trim()) {
      setError('Please enter JSX code');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data } = await axios.post(`${API}/illustrator/execute`, {
        filePath: file.filePath,
        jsxCode: jsxCode.trim()
      });

      setResult(data);
      setJsxCode('');
      setAiPromptIgnored(false);
      setSelectedTemplate(null);
      loadJobs();
    } catch (err) {
      setError(err.response?.data?.error || 'Execution failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchSelectFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setBatchFiles(files);
  };

  const uploadBatchFiles = async () => {
    if (!batchFiles.length) {
      throw new Error('Please select files first');
    }
    const form = new FormData();
    batchFiles.forEach((f) => form.append('files', f));
    const { data } = await axios.post(`${API}/illustrator/upload-multiple`, form);
    return data.files || [];
  };

  const refreshBatchStatus = async (id) => {
    if (!id) return;
    try {
      const { data } = await axios.get(`${API}/illustrator/batch/${id}`);
      setBatchStatus(data.batch);
    } catch (e) {
      // ignore
    }
  };

  const startBatch = async () => {
    if (!batchCommandId) {
      setError('Select a command first');
      return;
    }
    if (!batchFiles.length) {
      setError('Select one or more files');
      return;
    }
    setError('');
    setBatchRunning(true);
    setBatchStatus(null);
    try {
      const uploaded = await uploadBatchFiles();
      const paths = uploaded.map((f) => f.filePath).filter(Boolean);
      const { data } = await axios.post(`${API}/illustrator/batch`, {
        commandId: batchCommandId,
        filePaths: paths
      });
      setBatchId(data.batchId);
      await refreshBatchStatus(data.batchId);
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Batch failed to start');
    } finally {
      setBatchRunning(false);
    }
  };

  const loadTemplate = (id) => {
    let code = '';
    for (const category in templates) {
      const template = templates[category].find(t => t.id === id);
      if (template) {
        code = template.code;
        break;
      }
    }
    setJsxCode(code);
    setAiPromptIgnored(false);
    setSelectedTemplate(id);
  };

  const handleGenerateFromAi = async () => {
    const trimmed = aiPrompt.trim();
    if (!trimmed) {
      setError('Describe what Illustrator should do (e.g. draw a circle, then fill it blue)');
      return;
    }
    setAiLoading(true);
    setError('');
    setAiBanner('');
    setAiPromptIgnored(false);
    try {
      const { data } = await axios.post(`${API}/ai/from-prompt`, { prompt: trimmed });
      const ignored = !!data.promptIgnored;
      setAiPromptIgnored(ignored);
      setAiSteps(Array.isArray(data.steps) ? data.steps : []);
      setJsxCode(typeof data.jsx === 'string' ? data.jsx : '');
      setAiBanner(typeof data.message === 'string' ? data.message : '');
      setSelectedTemplate(null);
      const hasJsx = typeof data.jsx === 'string' && data.jsx.trim();
      if (hasJsx && !ignored) {
        setTab('editor');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.hint || 'Could not generate script');
      setAiSteps([]);
    } finally {
      setAiLoading(false);
    }
  };

  const goToAiTab = () => {
    setTab('assistant');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">✨</span>
            <div>
              <h1>Illustrator Automation Studio</h1>
              <p>Execute any Illustrator JSX script instantly</p>
            </div>
          </div>
          <div className={`status ${backendOnline ? 'online' : 'offline'}`}>
            <span className="dot"></span>
            {backendOnline ? 'Backend Online' : 'Backend Offline'}
          </div>
        </div>
      </header>

      <nav className="nav">
          <button className={tab === 'editor' ? 'active' : ''} onClick={() => setTab('editor')}>
          ✏️ Script Editor
        </button>
        <button className={tab === 'batch' ? 'active' : ''} onClick={() => setTab('batch')}>
          🧰 Batch Runner
        </button>
        <button className={tab === 'assistant' ? 'active' : ''} onClick={() => setTab('assistant')}>
          ✨ AI Steps
        </button>
        <button className={tab === 'templates' ? 'active' : ''} onClick={() => setTab('templates')}>
          📚 Templates
        </button>
        <button className={tab === 'jobs' ? 'active' : ''} onClick={() => setTab('jobs')}>
          📋 Jobs History
        </button>
        <button className={tab === 'guide' ? 'active' : ''} onClick={() => setTab('guide')}>
          📖 Setup Guide
        </button>
      </nav>

      <main className="main">
        {tab === 'batch' && (
          <div className="section">
            <h2>Batch Runner (commands + scripts)</h2>
            <p className="hint">
              This is the .NET-style workflow: scripts live in <code>backend/scripts</code>, commands live in{' '}
              <code>backend/commands</code>. Select files, choose a command, run — results + logs are saved per file.
            </p>

            <div className="two-columns">
              <div className="column">
                <h2>Step 1: Select Files</h2>
                <p className="hint">Choose one or more .ai/.eps/.pdf/.svg files</p>
                <input type="file" multiple accept=".ai,.eps,.pdf,.svg,.psd" onChange={handleBatchSelectFiles} />
                {batchFiles.length ? (
                  <div className="file-info" style={{ marginTop: '1rem' }}>
                    <p>
                      <strong>Selected:</strong> {batchFiles.length} file(s)
                    </p>
                  </div>
                ) : null}

                <h2 style={{ marginTop: '2rem' }}>Step 2: Choose Command</h2>
                <p className="hint">Commands are loaded from the backend</p>
                <select
                  value={batchCommandId}
                  onChange={(e) => setBatchCommandId(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 8 }}
                >
                  {commands.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name || c.id}
                    </option>
                  ))}
                </select>

                <div className="editor-actions" style={{ marginTop: '1.25rem' }}>
                  <button className="btn btn-secondary" type="button" onClick={loadCommands}>
                    Refresh Commands
                  </button>
                  <button className="btn btn-primary" type="button" disabled={batchRunning} onClick={startBatch}>
                    {batchRunning ? 'Starting…' : '▶ Run Batch'}
                  </button>
                </div>
                {error ? <div className="alert error">❌ {error}</div> : null}
              </div>

              <div className="column">
                <h2>Step 3: Progress</h2>
                <p className="hint">After starting, refresh to see updates</p>
                {!batchId ? (
                  <div className="result-box">
                    <p className="hint" style={{ marginBottom: 0 }}>
                      No batch started yet.
                    </p>
                  </div>
                ) : (
                  <div className="result-box">
                    <p>
                      <strong>Batch ID:</strong> {batchId}
                    </p>
                    <button className="btn btn-secondary" type="button" onClick={() => refreshBatchStatus(batchId)}>
                      🔄 Refresh Status
                    </button>
                    {batchStatus ? (
                      <div style={{ marginTop: '1rem' }}>
                        <p>
                          <strong>Status:</strong> {batchStatus.status} | <strong>Done:</strong> {batchStatus.completed}/
                          {batchStatus.total} | <strong>Failed:</strong> {batchStatus.failed}
                        </p>
                        <details>
                          <summary>View per-file logs</summary>
                          <div style={{ marginTop: '0.75rem' }}>
                            {(batchStatus.items || []).map((it) => (
                              <div key={it.index} className="job-card" style={{ marginBottom: '0.75rem' }}>
                                <div className="job-header">
                                  <span className={`job-status ${it.status === 'completed' ? 'completed' : it.status === 'failed' ? 'failed' : 'running'}`}>
                                    {String(it.status).toUpperCase()}
                                  </span>
                                  <code className="job-id">{String(it.sourcePath).split('\\').pop()}</code>
                                </div>
                                {it.outputPath ? (
                                  <p className="hint" style={{ margin: 0 }}>
                                    Output: <code>{it.outputPath}</code>
                                  </p>
                                ) : null}
                                {it.logs ? (
                                  <pre className="log-output">{it.logs}</pre>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'assistant' && (
          <div className="section">
            <h2>AI Steps (natural language)</h2>
            <p className="hint">
              When an AI backend is configured, your description becomes a plan plus JSX—similar in spirit to scripts on{' '}
              <a href="http://www.illustratorscripts.com" target="_blank" rel="noopener noreferrer">
                illustratorscripts.com
              </a>
              . ExtendScript builds vectors with code (paths, text, placed images), not freehand illustration.
              {aiCfg?.configured ? (
                <>
                  {' '}
                  Status: <strong>{aiCfg.provider}</strong> / <code>{aiCfg.model}</code>
                  {aiCfg.hint ? ` — ${aiCfg.hint}` : ''}.
                </>
              ) : (
                <>
                  {' '}
                  Right now nothing is wired: configure <strong>local Ollama</strong>, <strong>LM Studio</strong>, or any <strong>OpenAI-compatible URL</strong> in{' '}
                  <code>backend/.env</code>
                  {' '}
                  (see <strong>Setup Guide</strong>, step 8). Until then Generate only returns the fixed red-circle demo and ignores your wording.
                </>
              )}
            </p>

            {aiPromptIgnored ? (
              <div className="ai-prompt-ignored" role="alert">
                <strong>Your text was ignored.</strong> The backend did not call any language model—it only returned the wired test script (red circle). Add one of{' '}
                <code>AI_PROVIDER=ollama</code> + pull a model, <code>AI_PROVIDER=lmstudio</code> + start LM Studio&apos;s server, <code>AI_CHAT_URL=…</code> for Groq/OpenRouter/etc.,{' '}
                or <code>OPENAI_API_KEY</code> if you use OpenAI. Restart the backend, then Generate again. Complex scenes (“house, people…” ) still become simplified geometry or placeholders, not auto paintings.
              </div>
            ) : null}
            {aiBanner ? <div className={`ai-banner${aiPromptIgnored ? ' muted' : ''}`}>{aiBanner}</div> : null}

            <div className="ai-layout">
              <div>
                <h3 style={{ marginTop: 0 }}>What should Illustrator do?</h3>
                <textarea
                  className="prompt-area"
                  value={aiPrompt}
                  spellCheck={true}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Example: draw a 120 pt circle centered on the active artboard, fill it coral red RGB, stroke off, send to front"
                />
                <div className="ai-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={aiLoading}
                    onClick={handleGenerateFromAi}
                  >
                    {aiLoading ? 'Generating…' : 'Generate plan + JSX'}
                  </button>
                  {aiPromptIgnored && jsxCode.trim() ? (
                    <button type="button" className="btn btn-secondary" onClick={() => setTab('editor')}>
                      Open Script Editor anyway (sample JSX)
                    </button>
                  ) : null}
                </div>
                {error && tab === 'assistant' ? <div className="alert error" style={{ marginTop: '1rem' }}>{error}</div> : null}
              </div>
              <div className="ai-steps-panel">
                <h3>Plan (preview before Illustrator runs)</h3>
                {aiSteps.length === 0 ? (
                  <p className="hint" style={{ marginBottom: 0 }}>
                    After you generate, numbered steps appear here. Illustrator still runs everything as one script; refresh with <code>app.redraw()</code> lets you visually follow along.
                  </p>
                ) : (
                  <ol>
                    {aiSteps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'editor' && (
          <div className="section">
            {aiPromptIgnored ? (
              <div className="ai-prompt-ignored ai-prompt-ignored-compact" role="status">
                Sample JSX only — prompt ignored. Configure Ollama, LM Studio, or <code>AI_CHAT_URL</code> in{' '}
                <code>backend/.env</code>, restart backend — see{' '}
                <button type="button" className="inline-link-btn" onClick={() => setTab('guide')}>
                  Setup Guide
                </button>
                {' '}or{' '}
                <button type="button" className="inline-link-btn" onClick={() => setTab('assistant')}>
                  AI Steps
                </button>
                .
              </div>
            ) : null}
            <div className="two-columns">
              <div className="column">
                <h2>Step 1: Upload File</h2>
                <p className="hint">Upload your .ai, .eps, .pdf, or .svg file</p>

                <div className="upload-box" onClick={() => fileInputRef.current.click()}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".ai,.eps,.pdf,.svg"
                    onChange={handleFileUpload}
                    hidden
                  />
                  <span className="upload-icon">📁</span>
                  <p>{file ? `✅ ${file.fileName}` : 'Click to upload or drag & drop'}</p>
                </div>

                {file && (
                  <div className="file-info">
                    <p><strong>File:</strong> {file.fileName}</p>
                    <p><strong>Path:</strong> {file.filePath}</p>
                    <p><strong>Size:</strong> {(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}

                <h2 style={{ marginTop: '2rem' }}>Available Templates</h2>
                <p className="hint">Quick load pre-built scripts</p>
                <div className="template-quick-list">
                  {Object.values(templates).flat().slice(0, 6).map(template => (
                    <button
                      key={template.id}
                      className={`template-btn ${selectedTemplate === template.id ? 'selected' : ''}`}
                      onClick={() => loadTemplate(template.id)}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="column">
                <h2>Step 2: Write or Load JSX Code</h2>
                <p className="hint">Edit or paste your ExtendScript code</p>

                {aiSteps.length > 0 && (
                  <details className="ai-steps-reminder">
                    <summary>Recent AI plan (from ✨ AI Steps)</summary>
                    <ol style={{ margin: '0.75rem 0 0 0', paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {aiSteps.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ol>
                  </details>
                )}

                <textarea
                  className="code-editor"
                  value={jsxCode}
                  onChange={e => setJsxCode(e.target.value)}
                  placeholder={`// Write your Illustrator JSX code here
// Examples:
// - Change colors
// - Modify layers
// - Transform objects
// - Execute any Illustrator function

var color = new RGBColor();
color.red = 255;
color.green = 100;
color.blue = 0;

for (var i = 0; i < doc.pageItems.length; i++) {
  try {
    doc.pageItems[i].fillColor = color;
  } catch (e) {}
}

alert("Color changed!");`}
                  spellCheck="false"
                />

                <div className="editor-actions">
                  <button type="button" className="btn btn-secondary" onClick={goToAiTab}>
                    ✨ Describe with AI Steps
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setJsxCode('');
                      setAiPromptIgnored(false);
                    }}
                    disabled={!jsxCode}
                  >
                    Clear Code
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleExecute}
                    disabled={!file || !jsxCode.trim() || loading}
                  >
                    {loading ? '⏳ Executing...' : '▶ Execute in Illustrator'}
                  </button>
                </div>
              </div>
            </div>

            {error && <div className="alert error">❌ {error}</div>}

            {result && (
              <div className="result-box success">
                <h3>✅ Execution Successful</h3>
                <p><strong>Job ID:</strong> {result.jobId}</p>
                {result.logs && (
                  <details>
                    <summary>View Logs</summary>
                    <pre className="log-output">{result.logs}</pre>
                  </details>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'templates' && (
          <div className="section">
            <h2>Script Templates Library</h2>
            <p className="hint">Pre-built JSX scripts for common Illustrator tasks</p>

            {Object.entries(templates).map(([category, categoryTemplates]) => (
              <div key={category} className="template-category">
                <h3>{category}</h3>
                <div className="template-grid">
                  {categoryTemplates.map(template => (
                    <div key={template.id} className="template-card">
                      <h4>{template.name}</h4>
                      <p>{template.description}</p>
                      <button
                        className="btn btn-sm"
                        onClick={() => {
                          loadTemplate(template.id);
                          setTab('editor');
                        }}
                      >
                        Load Template
                      </button>
                      <details>
                        <summary>View Code</summary>
                        <pre className="template-code">{template.code}</pre>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'jobs' && (
          <div className="section">
            <h2>Execution History</h2>
            <button className="btn btn-secondary" onClick={loadJobs}>
              🔄 Refresh
            </button>

            {jobs.length === 0 ? (
              <p className="hint">No jobs executed yet. Run a script to see history here.</p>
            ) : (
              <div className="jobs-list">
                {jobs.map(job => (
                  <div key={job.jobId} className="job-card">
                    <div className="job-header">
                      <span className={`job-status ${job.status}`}>{job.status.toUpperCase()}</span>
                      <code className="job-id">{job.jobId.substring(0, 8)}...</code>
                      <time>{new Date(job.timestamp).toLocaleString()}</time>
                    </div>
                    {job.hasLogs && (
                      <button className="btn btn-xs" onClick={() => {
                        // Can add detailed job view here
                        console.log('View job details:', job.jobId);
                      }}>
                        View Details
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'guide' && (
          <div className="section guide">
            <h2>Complete Setup & Installation Guide</h2>

            <div className="guide-step">
              <h3>1. Prerequisites</h3>
              <ul>
                <li>Node.js v14 or higher (Download from nodejs.org)</li>
                <li>Adobe Illustrator 2020 or newer (installed & licensed)</li>
                <li>Windows 10/11 (ExtendScript support)</li>
              </ul>
            </div>

            <div className="guide-step">
              <h3>2. Extract Project</h3>
              <p>Extract the zip file to a folder, e.g.:</p>
              <code>C:\Projects\illustrator-full</code>
            </div>

            <div className="guide-step">
              <h3>3. Install Backend Dependencies</h3>
              <p>Open Command Prompt and run:</p>
              <pre className="code-block">{`cd C:\\Projects\\illustrator-full\\backend
npm install`}</pre>
            </div>

            <div className="guide-step">
              <h3>4. Configure .env File</h3>
              <p>Edit <code>backend/.env</code> and set your Illustrator path:</p>
              <pre className="code-block">{`PORT=5000
ILLUSTRATOR_PATH=C:\\Program Files\\Adobe\\Adobe Illustrator 2024\\Support Files\\Contents\\Windows\\Illustrator.exe`}</pre>
              <p style={{ marginTop: '1rem' }}>
                To find your Illustrator path: Right-click Illustrator shortcut → Properties → copy "Target"
              </p>
            </div>

            <div className="guide-step">
              <h3>5. Install Frontend Dependencies</h3>
              <pre className="code-block">{`cd C:\\Projects\\illustrator-full\\frontend
npm install`}</pre>
            </div>

            <div className="guide-step">
              <h3>6. Start the Application</h3>
              <p>Open 2 Command Prompt windows:</p>
              <p><strong>Window 1 - Backend:</strong></p>
              <pre className="code-block">{`cd C:\\Projects\\illustrator-full\\backend
npm run dev`}</pre>
              <p style={{ marginTop: '1rem' }}><strong>Window 2 - Frontend:</strong></p>
              <pre className="code-block">{`cd C:\\Projects\\illustrator-full\\frontend
npm start`}</pre>
            </div>

            <div className="guide-step">
              <h3>7. Use the Application</h3>
              <ol>
                <li>Browser opens at http://localhost:3000</li>
                <li>Check "Backend Online" status (green dot)</li>
                <li>Upload your .ai file</li>
                <li>Write JSX code or load a template</li>
                <li>Click "Execute in Illustrator"</li>
                <li>Illustrator opens, runs the script, and closes</li>
              </ol>
            </div>

            <div className="guide-step">
              <h3>8. AI Steps — no OpenAI account required</h3>
              <p>You only need something that exposes an OpenAI-compatible <code>/v1/chat/completions</code> endpoint.</p>
              <ul>
                <li>
                  <strong>Ollama (local)</strong>: install from{' '}
                  <a href="https://ollama.com/" target="_blank" rel="noopener noreferrer">ollama.com</a>, then{' '}
                  <code>ollama pull llama3.2</code> (or another model). In <code>backend/.env</code> add{' '}
                  <code>AI_PROVIDER=ollama</code> and <code>OLLAMA_MODEL=llama3.2</code>. Optionally <code>OLLAMA_HOST=http://127.0.0.1:11434</code>. Run <code>ollama serve</code> before Generate.
                </li>
                <li>
                  <strong>LM Studio (local GUI)</strong>: load a model, enable <em>Developer → Local Server</em>. In .env put{' '}
                  <code>AI_PROVIDER=lmstudio</code> and{' '}
                  <code>
                    LMSTUDIO_MODEL=id-from-the-lm-studio-dropdown
                  </code>
                  . Default host is{' '}
                  <code>http://127.0.0.1:1234</code> (<code>LMSTUDIO_HOST</code> to override).
                </li>
                <li>
                  <strong>Groq, OpenRouter, Azure, other hosted APIs</strong>: set{' '}
                  <code>AI_CHAT_URL</code> to the server base that ends in <code>/v1</code> (or paste the full{' '}
                  <code>/chat/completions</code> URL){' '}
                  plus <code>AI_CHAT_API_KEY</code> and <code>AI_MODEL</code> from that provider&apos;s docs.
                </li>
                <li>
                  Optional: <code>AI_JSON_MODE=1</code> asks for strict JSON output (helps some cloud APIs; omit for many local models if responses break).
                </li>
              </ul>
              <pre className="code-block">{`# Example — Ollama only (OpenAI lines optional):
AI_PROVIDER=ollama
OLLAMA_MODEL=llama3.2
# OLLAMA_HOST=http://127.0.0.1:11434`}</pre>
            </div>

            <div className="guide-step warning">
              <h3>⚠️ Important Notes</h3>
              <ul>
                <li><strong>Always backup your files!</strong> Scripts modify your documents.</li>
                <li><strong>Illustrator must be closed</strong> before executing a script.</li>
                <li><strong>ExtendScript documentation:</strong> https://github.com/Adobe-CEP/CEP-Resources</li>
                <li><strong>Keep both terminals open</strong> while using the app.</li>
              </ul>
            </div>

            <div className="guide-step">
              <h3>ExtendScript Examples</h3>
              <p>Common patterns you can use:</p>
              <pre className="code-block">{`// Access document
var doc = app.activeDocument;

// Loop through all objects
for (var i = 0; i < doc.pageItems.length; i++) {
  var item = doc.pageItems[i];
}

// Change fill color
var color = new RGBColor();
color.red = 255; color.green = 0; color.blue = 0;
doc.pageItems[0].fillColor = color;

// Access layers
for (var i = 0; i < doc.layers.length; i++) {
  var layer = doc.layers[i];
  layer.visible = true;
  layer.locked = false;
}

// Create new item
var circle = doc.pathItems.ellipse(100, 100, 50, 50);
circle.filled = true;
circle.stroked = false;

// Save and close
doc.save();
doc.close();`}</pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
