import { Fragment, ReactNode, useLayoutEffect } from 'react'
import { useHasInputs } from './contexts/HasInputsProvider'
import { Mode, useMode } from './contexts/ModeContext'
import { useShowValidation } from './contexts/ShowValidationProvider'
import { useSetStepHasInputs } from './contexts/StepHasInputsProvider'
import { useSetStepHasValidationError } from './contexts/StepValidationProvider'
import { useHasValidationError } from './contexts/ValidationProvider'
import { HiddenFn, useInputHidden } from './inputs/Input'

export function Step(props: { label: string; children?: ReactNode; id: string; hidden?: HiddenFn }) {
    const hasValidationError = useHasValidationError()
    const setStepHasValidationError = useSetStepHasValidationError()
    const hasInputs = useHasInputs()
    const setStepHasInputs = useSetStepHasInputs()
    const showValidation = useShowValidation()
    const mode = useMode()
    useLayoutEffect(() => {
        if (mode !== Mode.Details) setStepHasValidationError(props.id, hasValidationError && showValidation)
    }, [hasValidationError, mode, props.id, setStepHasValidationError, showValidation])

    useLayoutEffect(() => {
        if (mode !== Mode.Details) setStepHasInputs(props.id, hasInputs)
    }, [hasInputs, mode, props.id, setStepHasInputs])

    const hidden = useInputHidden(props)
    if (hidden) return <Fragment />

    return <Fragment>{props.children}</Fragment>
}
