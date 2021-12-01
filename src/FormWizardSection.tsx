import { DescriptionList, FormSection, Split, Stack, Text, Title } from '@patternfly/react-core'
import { Fragment, ReactNode, useContext } from 'react'
import { FormWizardLabelHelp } from './components/FormWizardLabelHelp'
import { FormWizardContext, InputMode } from './contexts/FormWizardContext'
import { FormWizardItemContext } from './contexts/FormWizardItemContext'
import { inputHasValue, isFormWizardHiddenProps } from './utils/input-utils'

interface FormWizardSectionProps {
    label: string
    labelHelp?: string
    labelHelpTitle?: string
    id?: string
    prompt?: string
    description?: string
    children: ReactNode
    hidden?: (item: any) => boolean
}

export function FormWizardSection(props: FormWizardSectionProps) {
    const formWizardContext = useContext(FormWizardContext)
    const item = useContext(FormWizardItemContext)

    let label = props.label
    if (formWizardContext.mode == InputMode.Wizard) {
        if (props.prompt) {
            label = props.prompt
        }
    }

    const hidden = isFormWizardHiddenProps(props, item)
    if (hidden) return <Fragment />

    if (formWizardContext.mode === InputMode.Details) {
        if (!inputHasValue(props, item)) {
            return <Fragment />
        }
        return (
            <Fragment>
                <Title headingLevel="h2">{label}</Title>
                <DescriptionList isHorizontal isCompact style={{ paddingLeft: 16, paddingBottom: 16, paddingRight: 16 }}>
                    {props.children}
                </DescriptionList>
            </Fragment>
        )
    }

    return (
        <FormSection id={props.id}>
            <Stack>
                <Split>
                    <Title headingLevel="h2">{label}</Title>
                    {props.id && <FormWizardLabelHelp id={props.id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />}
                </Split>
                {props.description && <Text component="small">{props.description}</Text>}
            </Stack>
            {props.children}
        </FormSection>
    )
}
