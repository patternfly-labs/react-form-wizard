import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'

const SetHasValidationErrorContext = createContext<() => void>(() => null)
export const useSetHasValidationError = () => useContext(SetHasValidationErrorContext)

export const HasValidationErrorContext = createContext(true)
export const useHasValidationError = () => useContext(HasValidationErrorContext)

const ValidateContext = createContext<() => void>(() => null)
export const useValidate = () => useContext(ValidateContext)

export function ValidationProvider(props: { children: ReactNode }) {
    const [hasValidationError, setHasValidationErrorState] = useState(false)
    const [setHasValidationError, setHasValidationErrorFunction] = useState<() => void>(() => () => setHasValidationErrorState(true))
    const validate = useCallback(() => {
        setHasValidationErrorState(false)
        setHasValidationErrorFunction(() => () => setHasValidationErrorState(true))
    }, [])
    useEffect(() => validate(), [validate])

    const parentValidate = useContext(ValidateContext)
    const parentSetHasValidationError = useContext(SetHasValidationErrorContext)
    useEffect(() => {
        if (hasValidationError) parentSetHasValidationError?.()
        else parentValidate?.()
    }, [parentValidate, parentSetHasValidationError, hasValidationError])

    return (
        <ValidateContext.Provider value={validate}>
            <SetHasValidationErrorContext.Provider value={setHasValidationError}>
                <HasValidationErrorContext.Provider value={hasValidationError}>{props.children}</HasValidationErrorContext.Provider>
            </SetHasValidationErrorContext.Provider>
        </ValidateContext.Provider>
    )
}
