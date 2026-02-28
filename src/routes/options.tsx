import { createFileRoute, Link } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { clearOnUpdatesAtom, clearOnUpdatesTimeframeAtom } from '../state/settings'

export const Route = createFileRoute('/options')({
    component: Options,
})

function Options() {
    const [clearOnUpdates, setClearOnUpdates] = useAtom(clearOnUpdatesAtom)
    const [timeframe, setTimeframe] = useAtom(clearOnUpdatesTimeframeAtom)

    return (
        <main className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col items-center px-6 py-12 sm:px-12 sm:py-24 transition-colors duration-500 font-sans">
            <div className="w-full max-w-4xl">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight">Options</h1>
                    <Link
                        to="/"
                        className="rounded-full bg-slate-800 px-6 py-2 text-sm font-semibold hover:bg-slate-700 transition"
                    >
                        ← Back
                    </Link>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-6 sm:p-8 space-y-8 border border-slate-700/50">

                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">Clear on Updates</h2>
                            <p className="text-slate-400 text-sm">Automatically remove old text when new text is added.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={clearOnUpdates}
                                onChange={(e) => setClearOnUpdates(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                    </div>

                    {clearOnUpdates && (
                        <div className="flex flex-col space-y-3 pt-4 border-t border-slate-700/50">
                            <div className="flex justify-between">
                                <label htmlFor="timeframe" className="text-sm font-medium text-slate-300">
                                    Timeframe (seconds)
                                </label>
                                <span className="text-sm text-slate-400">{timeframe}s</span>
                            </div>
                            <input
                                id="timeframe"
                                type="range"
                                min="0.1"
                                max="5"
                                step="0.1"
                                value={timeframe}
                                onChange={(e) => setTimeframe(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <p className="text-slate-400 text-xs text-right">
                                Text older than {timeframe}s will be cleared on new updates.
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </main>
    )
}
