import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'

const SetValidContext = createContext<(valid: boolean) => void>(() => null)
export function useSetValid() {
    return useContext(SetValidContext)
}

export const ValidContext = createContext(true)
export function useValid() {
    return useContext(ValidContext)
}

const ValidateContext = createContext<() => void>(() => null)
export function useValidate() {
    return useContext(ValidateContext)
}

export function ValidProvider(props: { children: ReactNode }) {
    const [valid, setValidState] = useState(true)

    const [setValid, setValidFunction] = useState<(valid: boolean) => void>(() => (valid: boolean) => {
        if (!valid) setValidState(false)
    })

    const validate = useCallback(() => {
        setValidState(true)
        setValidFunction(() => (valid: boolean) => {
            if (!valid) setValidState(false)
        })
    }, [])

    // If valid changes, have parent revalidate
    const parentValidate = useContext(ValidateContext)
    useEffect(() => {
        parentValidate?.()
    }, [parentValidate, valid])

    // If valid changes, set parentValid
    const parentSetValid = useContext(SetValidContext)
    useEffect(() => {
        if (!valid) parentSetValid?.(valid)
    }, [parentSetValid, valid])

    useEffect(() => {
        validate()
    }, [validate])

    return (
        <ValidateContext.Provider value={validate}>
            <SetValidContext.Provider value={setValid}>
                <ValidContext.Provider value={valid}>{props.children}</ValidContext.Provider>
            </SetValidContext.Provider>
        </ValidateContext.Provider>
    )
}
