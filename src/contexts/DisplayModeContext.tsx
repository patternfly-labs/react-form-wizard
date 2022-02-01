import { createContext, useContext } from 'react'

export enum DisplayMode {
    Wizard,
    Form,
    Details,
    Steps,
}

export const DisplayModeContext = createContext<DisplayMode>(DisplayMode.Wizard)

export function useDisplayMode() {
    return useContext(DisplayModeContext)
}
