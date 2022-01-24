import { Fragment, ReactNode, useEffect } from 'react'
import { Mode, useMode } from './contexts/ModeContext'
import { useShowValidation } from './contexts/ShowValidationProvider'
import { useSetStepHasValidationError } from './contexts/StepValidationProvider'
import { useHasValidationError } from './contexts/ValidationProvider'
import { HiddenFn } from './inputs/Input'

export function Step(props: { label: string; children?: ReactNode; id: string; hidden?: HiddenFn }) {
    const hasValidationError = useHasValidationError()
    const setStepHasValidationError = useSetStepHasValidationError()
    const showValidation = useShowValidation()
    const mode = useMode()
    useEffect(() => {
        if (mode !== Mode.Details) setStepHasValidationError(props.label, hasValidationError && showValidation)
    }, [hasValidationError, mode, props.label, setStepHasValidationError, showValidation])
    return <Fragment>{props.children}</Fragment>
}
