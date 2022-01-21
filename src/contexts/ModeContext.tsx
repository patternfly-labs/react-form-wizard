import { createContext, useContext } from 'react'

export enum Mode {
    Wizard,
    Form,
    Details,
}

export const ModeContext = createContext<Mode>(Mode.Wizard)

export function useMode() {
    return useContext(ModeContext)
}
