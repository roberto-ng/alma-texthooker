import { atomWithStorage } from 'jotai/utils'

export const clearOnUpdatesAtom = atomWithStorage<boolean>('clearOnUpdates', false)
export const clearOnUpdatesTimeframeAtom = atomWithStorage<number>('clearOnUpdatesTimeframe', 0.5)
