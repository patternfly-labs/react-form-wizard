import { createContext, useContext } from 'react'

export enum InputMode {
    Wizard,
    Form,
    Details,
}

/**
 * FormWizardContext is the root level context of an InputForm and represents the forms data.
 */
export interface IFormWizardContext {
    /**
     * updateContext updates the input context state.
     * This should be called by the input components when they update state.
     */
    updateContext: (data?: any) => void

    mode: InputMode

    onSubmit?: (data: object) => Promise<void>
    onCancel?: () => void
}

/**
 * FormWizardContext is the root level context of an InputForm and represents the forms data.
 */
export const FormWizardContext = createContext<IFormWizardContext>({
    updateContext: () => {
        /* Do nothing. */
    },
    mode: InputMode.Wizard,
})

export const WizardContext = FormWizardContext
export const DataContext = FormWizardContext

export function useMode() {
    const wizardContext = useContext(FormWizardContext)
    return wizardContext.mode
}
