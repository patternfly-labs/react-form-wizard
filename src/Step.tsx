import { Split, SplitItem } from '@patternfly/react-core'
import { Fragment, ReactNode, useLayoutEffect } from 'react'
import { DisplayMode, useDisplayMode } from './contexts/DisplayModeContext'
import { useHasInputs } from './contexts/HasInputsProvider'
import { useSetShowValidation } from './contexts/ShowValidationProvider'
import { useSetStepHasInputs } from './contexts/StepHasInputsProvider'
import { useStepShowValidation } from './contexts/StepShowValidationProvider'
import { useSetStepHasValidationError } from './contexts/StepValidationProvider'
import { useHasValidationError } from './contexts/ValidationProvider'
import { HiddenFn, useInputHidden } from './inputs/Input'

export function Step(props: { label: string; children?: ReactNode; id: string; hidden?: HiddenFn; autohide?: boolean }) {
    const displayMode = useDisplayMode()

    const setShowValidation = useSetShowValidation()
    const stepShowValidation = useStepShowValidation()
    useLayoutEffect(() => {
        if (displayMode !== DisplayMode.Details) {
            if (stepShowValidation[props.id]) {
                setShowValidation(true)
            }
        }
    }, [displayMode, props.id, setShowValidation, stepShowValidation])

    const hasValidationError = useHasValidationError()
    const setStepHasValidationError = useSetStepHasValidationError()
    useLayoutEffect(() => {
        if (displayMode !== DisplayMode.Details) setStepHasValidationError(props.id, hasValidationError)
    }, [hasValidationError, displayMode, props.id, setStepHasValidationError])

    const hasInputs = useHasInputs()
    const setStepHasInputs = useSetStepHasInputs()
    useLayoutEffect(() => {
        if (displayMode !== DisplayMode.Details) setStepHasInputs(props.id, hasInputs)
    }, [hasInputs, displayMode, props.id, setStepHasInputs])

    const hidden = useInputHidden(props)
    if (hidden && props.autohide !== false) return <Fragment />

    if (displayMode == DisplayMode.Steps) {
        const classname = 'pf-c-wizard__nav-link'
        // if (props.activeStep === props.step) {
        //     classname += ' pf-m-current'
        // }

        return (
            <li key={props.id} className="pf-c-wizard__nav-item">
                <button
                    id={`${props.id}-button`}
                    className={classname}
                    // onClick={() => {
                    //     props.setActiveStep(props.step)
                    // }}
                >
                    <Split>
                        <SplitItem isFilled>{props.label}</SplitItem>
                        {/* {stepHasInputs[props.id] === true ? (
                    <SplitItem>
                        <CircleIcon color="var(--pf-global--success-color--100)" />
                    </SplitItem>
                ) : (
                    <SplitItem>
                        <CircleIcon color="var(--pf-global--danger-color--100)" />
                    </SplitItem>
                )} */}
                        {/* {props.id !== 'review-step' && stepHasValidationError[props.id] && (
                            <SplitItem>
                                <ExclamationCircleIcon color="var(--pf-global--danger-color--100)" />
                            </SplitItem>
                        )} */}
                    </Split>
                </button>
            </li>
        )
    }

    return <Fragment>{props.children}</Fragment>
}
