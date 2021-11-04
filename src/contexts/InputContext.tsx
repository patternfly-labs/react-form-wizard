import { createContext } from 'react'

export enum InputMode {
    Wizard,
    Form,
    Details,
}

export enum InputEditMode {
    Create,
    Edit,
}

/**
 * InputContext is the root level context of an InputForm and represents the forms data.
 */
export interface IInputContext {
    /**
     * updateContext updates the input context state.
     * This should be called by the input components when they update state.
     */
    updateContext: () => void

    mode: InputMode

    editMode: InputEditMode

    showValidation: boolean
    setShowValidation: (show: boolean) => void
}

/**
 * InputContext is the root level context of an InputForm and represents the forms data.
 */
export const InputContext = createContext<IInputContext>({
    updateContext: () => {},
    mode: InputMode.Wizard,
    editMode: InputEditMode.Create,
    showValidation: true,
    setShowValidation: () => {},
})
