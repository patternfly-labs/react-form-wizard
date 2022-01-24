import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'

const SetHasInputsContext = createContext<() => void>(() => null)
export const useSetHasInputs = () => useContext(SetHasInputsContext)

export const HasInputsContext = createContext(false)
export const useHasInputs = () => useContext(HasInputsContext)

const UpdateHasInputsContext = createContext<() => void>(() => null)
export const useUpdateHasInputs = () => useContext(UpdateHasInputsContext)

export function HasInputsProvider(props: { children: ReactNode }) {
    const [hasInputs, setHasInputsState] = useState(false)
    const [setHasInputs, setHasInputsFunction] = useState<() => void>(() => () => setHasInputsState(true))
    const validate = useCallback(() => {
        setHasInputsState(false)
        setHasInputsFunction(() => () => setHasInputsState(true))
    }, [])
    useEffect(() => validate(), [validate])

    const parentUpdateHasInputs = useContext(UpdateHasInputsContext)
    useEffect(() => {
        if (!hasInputs) parentUpdateHasInputs?.()
    }, [parentUpdateHasInputs, hasInputs])

    // When this control goes away - parentUpdateHasInputs
    useEffect(
        () => () => {
            if (parentUpdateHasInputs) parentUpdateHasInputs()
        },
        [parentUpdateHasInputs]
    )

    const parentSetHasInputs = useContext(SetHasInputsContext)
    useEffect(() => {
        if (hasInputs) parentSetHasInputs?.()
    }, [parentSetHasInputs, hasInputs])

    return (
        <UpdateHasInputsContext.Provider value={validate}>
            <SetHasInputsContext.Provider value={setHasInputs}>
                <HasInputsContext.Provider value={hasInputs}>{props.children}</HasInputsContext.Provider>
            </SetHasInputsContext.Provider>
        </UpdateHasInputsContext.Provider>
    )
}
