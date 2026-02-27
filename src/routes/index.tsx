import { createFileRoute } from '@tanstack/react-router'
import { useRef, useEffect, useState } from 'react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    })
  }, [text])

  return (
    <main className="min-h-screen bg-[#0f172a] selection:bg-indigo-500/30 flex justify-center px-6 py-12 sm:px-12 sm:py-24 transition-colors duration-500">
      <div className="w-full max-w-4xl">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          placeholder="Start typing..."
          className="w-full bg-transparent text-slate-100 text-2xl sm:text-3xl md:text-4xl font-medium tracking-wide leading-relaxed sm:leading-loose placeholder:text-slate-600 outline-none resize-none overflow-hidden font-sans"
          style={{ minHeight: '50vh' }}
          autoFocus
        />
      </div>
    </main>
  )
}

