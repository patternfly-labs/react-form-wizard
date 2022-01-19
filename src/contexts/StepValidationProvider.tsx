import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { useItem } from './ItemContext'

const StepSetHasValidationErrorContext = createContext<(label: string, hasError: boolean) => void>(() => null)
export const useSetStepHasValidationError = () => useContext(StepSetHasValidationErrorContext)

export const StepHasValidationErrorContext = createContext<Record<string, boolean>>({})
export const useStepHasValidationError = () => useContext(StepHasValidationErrorContext)

export function StepValidationProvider(props: { children: ReactNode }) {
    const item = useItem()

    const [hasStepValidationErrors, setHasStepValidationErrorsState] = useState<Record<string, true>>({})
    const [setHasValidationErrors, setHasValidationErrorsFunction] = useState<() => void>(() => () => null)
    const validateSteps = useCallback(() => {
        setHasStepValidationErrorsState({})
        setHasValidationErrorsFunction(() => (label: string, hasError: boolean) => {
            setHasStepValidationErrorsState((state) => {
                if (hasError && state[label] !== true) {
                    state = { ...state }
                    state[label] = true
                } else if (!hasError && state[label] !== undefined) {
                    state = { ...state }
                    delete state[label]
                }
                return state
            })
        })
    }, [])
    useEffect(() => validateSteps(), [item, validateSteps])

    return (
        <StepSetHasValidationErrorContext.Provider value={setHasValidationErrors}>
            <StepHasValidationErrorContext.Provider value={hasStepValidationErrors}>
                {props.children}
            </StepHasValidationErrorContext.Provider>
        </StepSetHasValidationErrorContext.Provider>
    )
}
