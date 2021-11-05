import { DescriptionList, FormSection, Stack, Text, Title } from '@patternfly/react-core'
import { Fragment, ReactNode, useContext } from 'react'
import { FormWizardContext, InputMode } from './contexts/FormWizardContext'
import { inputHasValue, isFormWizardHiddenProps } from './lib/input-utils'

interface FormWizardSectionProps {
    label: string
    prompt?: string
    description?: string
    children: ReactNode
    hidden?: (item: any) => boolean
}

export function FormWizardSection(props: FormWizardSectionProps) {
    let formWizardContext = useContext(FormWizardContext)

    let label = props.label
    if (formWizardContext.mode == InputMode.Wizard) {
        if (props.prompt) {
            label = props.prompt
        }
    }

    const hidden = isFormWizardHiddenProps(props)
    if (hidden) return <Fragment />

    if (formWizardContext.mode === InputMode.Details) {
        if (!inputHasValue(props)) {
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
        <FormSection>
            <Stack>
                <Title headingLevel="h2">{label}</Title>
                {props.description && <Text component="small">{props.description}</Text>}
            </Stack>
            {props.children}
        </FormSection>
    )
}