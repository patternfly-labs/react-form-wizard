import { createContext } from 'react'

export interface IFormWizardValidationContext {
    showValidation: boolean
    setShowValidation: (show: boolean) => void
}

export const FormWizardValidationContext = createContext<IFormWizardValidationContext>({
    showValidation: true,
    setShowValidation: () => {
        /* Do nothing. */
    },
})
