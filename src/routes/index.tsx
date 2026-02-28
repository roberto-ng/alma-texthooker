import { createFileRoute } from '@tanstack/react-router'
import { useRef, useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import { clearOnUpdatesAtom, clearOnUpdatesTimeframeAtom, mlpModeAtom } from '../state/settings'
import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'


export const Route = createFileRoute('/')({ component: App })

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<{ text: string; timestamp: number }[]>([])

  const clearOnUpdates = useAtomValue(clearOnUpdatesAtom)
  const timeframe = useAtomValue(clearOnUpdatesTimeframeAtom)
  const mlpMode = useAtomValue(mlpModeAtom)

  useEffect(() => {
    // Scroll to the bottom whenever text is updated
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    })
  }, [lines])

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      let insertedText = ''
      const nodesToRemove: Node[] = []

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          // Ignore our own root container if it's somehow caught
          if (node === document.getElementById('root')) return
          // Ignore nodes added inside our content box
          if (containerRef.current?.contains(node)) return
          // Ignore script tags and other hidden elements
          if (
            node instanceof HTMLElement &&
            (node.tagName === 'SCRIPT' ||
              node.tagName === 'STYLE' ||
              node.tagName === 'LINK' ||
              node.id === 'root')
          ) {
            return
          }

          // If it's a text node or basic element typically pasted by inserters
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent?.trim()
            if (text) insertedText += text + '\n'
            nodesToRemove.push(node)
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const text = (node as HTMLElement).innerText?.trim() || node.textContent?.trim()
            if (text) insertedText += text + '\n'
            // Keep DevTools or other vital extension overlays
            // We'll target typical generic tags <p>, <div>, <span>
            if (['P', 'DIV', 'SPAN'].includes((node as HTMLElement).tagName)) {
              nodesToRemove.push(node)
            }
          }
        })
      })

      if (insertedText) {
        setLines((prev) => {
          const now = Date.now()
          const newLines = insertedText.trim().split('\n').filter(Boolean).map(text => ({ text, timestamp: now }))

          let keptPrev = prev;
          if (clearOnUpdates) {
            keptPrev = prev.filter(line => (now - line.timestamp) <= timeframe * 1000)
          }

          // Add an empty string at the end of each inserted block to act as a spacer
          return keptPrev.length === 0 ? newLines : [...keptPrev, { text: '', timestamp: now }, ...newLines]
        })

        // Clean up the DOM to prevent it from growing infinitely
        nodesToRemove.forEach((node) => {
          if (node.parentNode) {
            node.parentNode.removeChild(node)
          }
        })
      }
    })

    // Observe the entire body for global insertions
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [clearOnUpdates, timeframe])

  return (
    <main className="min-h-screen bg-[#0f172a] selection:bg-indigo-500/30 flex justify-center px-6 py-12 sm:px-12 sm:py-24 transition-colors duration-500 relative">
      <Link
        to="/options"
        className="fixed top-6 right-6 z-50 p-3 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-full transition-all"
        title="Settings"
      >
        <Settings size={28} />
      </Link>

      <div className="w-full max-w-4xl pt-8">
        <div
          ref={containerRef}
          contentEditable
          suppressContentEditableWarning
          className={`w-full min-h-[50vh] bg-transparent text-slate-100 text-2xl sm:text-3xl md:text-4xl font-medium tracking-wide leading-relaxed sm:leading-loose placeholder:text-slate-600 outline-none font-sans ${mlpMode ? 'pr-40 md:pr-35' : ''}`}
          data-text="Start typing..."
        >
          {lines.map((line, i) => (
            <div key={i} className={line.text === '' ? 'h-6 sm:h-8 md:h-10' : ''}>
              {line.text}
            </div>
          ))}
        </div>
      </div>

      {mlpMode && (
        <img
          src="/images/extra/dancing.gif"
          alt="Dancing Pony"
          className="fixed bottom-4 right-4 pointer-events-none z-50 mix-blend-screen w-32 md:w-48 opacity-80"
        />
      )}
    </main>
  )
}

