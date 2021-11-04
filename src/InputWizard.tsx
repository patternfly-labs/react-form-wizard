import { Alert, FormAlert, Split, SplitItem, Stack, Wizard, WizardStep } from '@patternfly/react-core'
import { Children, isValidElement, ReactNode, useCallback, useContext } from 'react'
import { InputStep } from '.'
import { InputContext } from './contexts/InputContext'
import { InputDetails } from './InputDetails'
import { hasValidationErrorsProps, isInputHiddenProps } from './lib/input-utils'

export function InputWizard(props: { children: ReactNode }) {
    const steps: WizardStep[] = []
    let inputContext = useContext(InputContext)

    let formHasValidationErrors = false
    Children.forEach(props.children, (child) => {
        if (!isValidElement(child)) return
        if (child.type !== InputStep) return
        if (isInputHiddenProps(child.props)) return

        let color: string | undefined = undefined
        if (hasValidationErrorsProps(child.props)) {
            if (inputContext.showValidation) {
                color = '#C9190B'
            }
            formHasValidationErrors = true
        }

        const label = child.props.label
        if (label) {
            steps.push({
                name: (
                    <Split style={{ color: color }}>
                        <SplitItem>{label}</SplitItem>
                    </Split>
                ),
                component: child,
            })
        }
    })

    if (formHasValidationErrors) {
        steps.push({
            name: 'Summary',
            component: (
                <Stack hasGutter>
                    <FormAlert style={{ paddingBottom: 16 }}>
                        <Alert variant="danger" title="Fix validation errors before summitting." isInline isPlain />
                    </FormAlert>
                    <InputDetails>{props.children}</InputDetails>
                </Stack>
            ),
            nextButtonText: 'Submit',
            enableNext: false,
        })
    } else {
        steps.push({
            name: 'Summary',
            component: <InputDetails>{props.children}</InputDetails>,
            nextButtonText: 'Submit',
        })
    }

    const stepChange = useCallback((step) => {
        if (step.name === 'Summary') {
            inputContext.setShowValidation(true)
        }
    }, [])

    return <Wizard steps={steps} onNext={stepChange} onGoToStep={stepChange} />
}
