import { useEffect, useMemo, useState } from 'react'

function App() {
  const [input, setInput] = useState('')
  const [title, setTitle] = useState('Your Custom Text Page')

  // Persist to localStorage so the user doesn't lose their content on refresh
  useEffect(() => {
    const saved = localStorage.getItem('custom_text_content')
    const savedTitle = localStorage.getItem('custom_text_title')
    if (saved) setInput(saved)
    if (savedTitle) setTitle(savedTitle)
  }, [])

  useEffect(() => {
    localStorage.setItem('custom_text_content', input)
  }, [input])

  useEffect(() => {
    localStorage.setItem('custom_text_title', title)
  }, [title])

  const lineCount = useMemo(() => (input ? input.split('\n').length : 0), [input])
  const charCount = input.length

  const handleDownload = () => {
    const blob = new Blob([input], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || 'content'}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(input)
      alert('Content copied to clipboard')
    } catch (e) {
      alert('Copy failed. Try selecting and copying manually.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">Simple Text Site Builder</h1>
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <span className="hidden sm:inline">Lines:</span>
            <span className="font-medium">{lineCount}</span>
            <span className="mx-2">•</span>
            <span className="hidden sm:inline">Characters:</span>
            <span className="font-medium">{charCount}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Page title"
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-2 rounded-md bg-slate-800 text-white hover:bg-slate-900"
            >
              Download
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste or type any text you want to turn into a webpage."
            className="w-full h-[60vh] p-4 outline-none resize-none font-mono text-sm text-slate-800"
          />
        </section>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Live Preview</h2>
            <p className="text-slate-500 text-sm">This is how your page will look.</p>
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">{title || 'Untitled Page'}</h1>
            {input ? (
              <article className="prose prose-slate max-w-none">
                {input.split('\n\n').map((para, idx) => (
                  <p key={idx} className="whitespace-pre-wrap leading-relaxed">{para}</p>
                ))}
              </article>
            ) : (
              <div className="text-slate-500">Start typing on the left to see a preview here.</div>
            )}
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-4 pb-8 text-center text-slate-500 text-sm">
        Built for quickly turning any text into a clean, readable web page.
      </footer>
    </div>
  )
}

export default App
