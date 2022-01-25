import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'

const SetHasValueContext = createContext<() => void>(() => null)
export const useSetHasValue = () => useContext(SetHasValueContext)

export const HasValueContext = createContext(false)
export const useHasValue = () => useContext(HasValueContext)

const UpdateHasValueContext = createContext<() => void>(() => null)
export const useUpdateHasValue = () => useContext(UpdateHasValueContext)

export function HasValueProvider(props: { children: ReactNode }) {
    const [hasValue, setHasValueState] = useState(false)
    const [setHasValue, setHasValueFunction] = useState<() => void>(() => () => setHasValueState(true))
    const validate = useCallback(() => {
        setHasValueState(false)
        setHasValueFunction(() => () => setHasValueState(true))
    }, [])
    useEffect(() => validate(), [validate])

    const parentUpdateHasValue = useContext(UpdateHasValueContext)
    useEffect(() => {
        if (!hasValue) parentUpdateHasValue?.()
    }, [parentUpdateHasValue, hasValue])

    // When this control goes away - parentUpdateHasValue
    useEffect(
        () => () => {
            if (parentUpdateHasValue) parentUpdateHasValue()
        },
        [parentUpdateHasValue]
    )

    const parentSetHasValue = useContext(SetHasValueContext)
    useEffect(() => {
        if (hasValue) parentSetHasValue?.()
    }, [parentSetHasValue, hasValue])

    return (
        <UpdateHasValueContext.Provider value={validate}>
            <SetHasValueContext.Provider value={setHasValue}>
                <HasValueContext.Provider value={hasValue}>{props.children}</HasValueContext.Provider>
            </SetHasValueContext.Provider>
        </UpdateHasValueContext.Provider>
    )
}
