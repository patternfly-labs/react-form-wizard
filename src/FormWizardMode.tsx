import { Alert, FormAlert, Split, SplitItem, Stack, Wizard, WizardStep } from '@patternfly/react-core'
import { Children, isValidElement, ReactNode, useCallback, useContext } from 'react'
import { FormWizardStep } from '.'
import { FormWizardContext } from './contexts/FormWizardContext'
import { FormWizardItemContext } from './contexts/FormWizardItemContext'
import { FormWizardDetailsView } from './FormWizardDetails'
import { hasValidationErrorsProps, InputCommonProps, isFormWizardHiddenProps } from './lib/input-utils'

export function FormWizardWizardView(props: { children: ReactNode }) {
    const steps: WizardStep[] = []
    const formWizardContext = useContext(FormWizardContext)
    const item = useContext(FormWizardItemContext)

    let formHasValidationErrors = false
    Children.forEach(props.children, (child) => {
        if (!isValidElement(child)) return
        if (child.type !== FormWizardStep) return
        if (isFormWizardHiddenProps(child.props, item)) return

        let color: string | undefined = undefined
        if (hasValidationErrorsProps(child.props as InputCommonProps, item)) {
            if (formWizardContext.showValidation) {
                color = '#C9190B'
            }
            formHasValidationErrors = true
        }

        const label = (child.props as { label: ReactNode }).label
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
        if ((step as { name: string }).name === 'Summary') {
            formWizardContext.setShowValidation(true)
        }
    }, [])

    return <Wizard steps={steps} onNext={stepChange} onGoToStep={stepChange} />
}
