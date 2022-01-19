import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'

const SetHasValidationErrorContext = createContext<() => void>(() => null)
export const useSetHasValidationError = () => useContext(SetHasValidationErrorContext)

export const HasValidationErrorContext = createContext(true)
export const useHasValidationError = () => useContext(HasValidationErrorContext)

const ValidateContext = createContext<() => void>(() => null)
export const useValidate = () => useContext(ValidateContext)

export function ValidationProvider(props: { children: ReactNode }) {
    const [hasValidationErrors, setHasValidationErrorsState] = useState(false)
    const [setHasValidationErrors, setHasValidationErrorsFunction] = useState<() => void>(() => () => setHasValidationErrorsState(true))
    const validate = useCallback(() => {
        setHasValidationErrorsState(false)
        setHasValidationErrorsFunction(() => () => setHasValidationErrorsState(true))
    }, [])
    useEffect(() => validate(), [validate])

    const parentValidate = useContext(ValidateContext)
    const parentSetHasValidationError = useContext(SetHasValidationErrorContext)
    useEffect(() => {
        if (hasValidationErrors) parentSetHasValidationError?.()
        else parentValidate?.()
    }, [parentValidate, parentSetHasValidationError, hasValidationErrors])

    return (
        <ValidateContext.Provider value={validate}>
            <SetHasValidationErrorContext.Provider value={setHasValidationErrors}>
                <HasValidationErrorContext.Provider value={hasValidationErrors}>{props.children}</HasValidationErrorContext.Provider>
            </SetHasValidationErrorContext.Provider>
        </ValidateContext.Provider>
    )
}
