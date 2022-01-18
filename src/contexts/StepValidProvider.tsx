import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'

const SetValidContext = createContext<(valid: boolean) => void>(() => null)
export function useSetValid() {
    return useContext(SetValidContext)
}

export const StepValidContext = createContext(true)
export function useStepValid() {
    return useContext(StepValidContext)
}

const ValidateContext = createContext<() => void>(() => null)
export function useValidate() {
    return useContext(ValidateContext)
}

export function ValidProvider(props: { children: ReactNode }) {
    const parentSetValid = useContext(SetValidContext)

    const [valid, setValidState] = useState(true)

    const [setValid, setValidFunction] = useState<(valid: boolean) => void>(() => (valid: boolean) => {
        if (!valid) setValidState(false)
    })

    const validate = useCallback(() => {
        setValidState(true)
        console.log('LVAA')
        setValidFunction(() => (valid: boolean) => {
            if (!valid) setValidState(false)
        })
    }, [])

    useEffect(() => {
        setValidState(true)
        validate()
    }, [parentSetValid, validate])

    useEffect(() => {
        if (!valid) parentSetValid?.(false)
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
