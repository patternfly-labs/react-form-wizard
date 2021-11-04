import { Alert, FormAlert, Split, SplitItem, Stack, Wizard, WizardStep } from '@patternfly/react-core'
import { Children, isValidElement, ReactNode, useCallback, useContext } from 'react'
import { FormWizardStep } from '.'
import { FormWizardContext } from './contexts/FormWizardContext'
import { FormWizardDetailsView } from './FormWizardDetails'
import { hasValidationErrorsProps, isFormWizardHiddenProps } from './lib/input-utils'

export function FormWizardWizardView(props: { children: ReactNode }) {
    const steps: WizardStep[] = []
    let formWizardContext = useContext(FormWizardContext)

    let formHasValidationErrors = false
    Children.forEach(props.children, (child) => {
        if (!isValidElement(child)) return
        if (child.type !== FormWizardStep) return
        if (isFormWizardHiddenProps(child.props)) return

        let color: string | undefined = undefined
        if (hasValidationErrorsProps(child.props)) {
            if (formWizardContext.showValidation) {
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
                    <FormWizardDetailsView>{props.children}</FormWizardDetailsView>
                </Stack>
            ),
            nextButtonText: 'Submit',
            enableNext: false,
        })
    } else {
        steps.push({
            name: 'Summary',
            component: <FormWizardDetailsView>{props.children}</FormWizardDetailsView>,
            nextButtonText: 'Submit',
        })
    }

    const stepChange = useCallback((step) => {
        if (step.name === 'Summary') {
            formWizardContext.setShowValidation(true)
        }
    }, [])

    return <Wizard steps={steps} onNext={stepChange} onGoToStep={stepChange} />
}
