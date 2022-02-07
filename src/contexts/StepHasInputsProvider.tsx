import { createContext, ReactNode, useCallback, useContext, useLayoutEffect, useState } from 'react'
import { useItem } from './ItemContext'

const StepSetHasInputsContext = createContext<(id: string, has: boolean) => void>(() => null)
export const useSetStepHasInputs = () => useContext(StepSetHasInputsContext)

export const StepHasInputsContext = createContext<Record<string, boolean>>({})
export const useStepHasInputs = () => useContext(StepHasInputsContext)

export function StepHasInputsProvider(props: { children: ReactNode }) {
    const item = useItem()
    const [hasStepInputss, setHasStepInputsState] = useState<Record<string, true>>({})
    const [setHasInputs, setHasInputsFunction] = useState<() => void>(() => () => null)
    const validateSteps = useCallback(() => {
        setHasStepInputsState({})
        setHasInputsFunction(() => (id: string, has: boolean) => {
            setHasStepInputsState((state) => {
                if (has && state[id] !== true) {
                    state = { ...state }
                    state[id] = true
                } else if (!has && state[id] !== undefined) {
                    state = { ...state }
                    delete state[id]
                }
                return state
            })
        })
    }, [])
    useLayoutEffect(() => validateSteps(), [item, validateSteps])
    return (
        <StepSetHasInputsContext.Provider value={setHasInputs}>
            <StepHasInputsContext.Provider value={hasStepInputss}>{props.children}</StepHasInputsContext.Provider>
        </StepSetHasInputsContext.Provider>
    )
}
