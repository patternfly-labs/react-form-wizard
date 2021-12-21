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
 * FormWizardContext is the root level context of an InputForm and represents the forms data.
 */
export interface IFormWizardContext {
    /**
     * updateContext updates the input context state.
     * This should be called by the input components when they update state.
     */
    updateContext: (data?: any) => void

    mode: InputMode

    editMode: InputEditMode

    // showValidation: boolean
    // setShowValidation: (show: boolean) => void

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
    editMode: InputEditMode.Create,
    // showValidation: true,
    // setShowValidation: () => {
    //     /* Do nothing. */
    // },
})
