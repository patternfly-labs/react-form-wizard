import { DescriptionList, FormSection, Split, Stack, Text, Title } from '@patternfly/react-core'
import { Fragment, ReactNode, useContext } from 'react'
import { LabelHelp } from './components/LabelHelp'
import { ItemContext } from './contexts/ItemContext'
import { Mode, useMode } from './contexts/ModeContext'
import { inputHasValue, useInputHidden } from './inputs/Input'

interface FormWizardSectionProps {
    label: string
    labelHelp?: string
    labelHelpTitle?: string
    id?: string
    prompt?: string
    description?: string
    children?: ReactNode
    hidden?: (item: any) => boolean
}

export function FormWizardSection(props: FormWizardSectionProps) {
    const mode = useMode()
    const item = useContext(ItemContext)

    let label = props.label
    if (mode == Mode.Wizard) {
        if (props.prompt) {
            label = props.prompt
        }
    }

    const hidden = useInputHidden(props)
    if (hidden) return <Fragment />

    if (mode === Mode.Details) {
        if (!inputHasValue(props, item)) {
            return <Fragment />
        }
        return (
            <Fragment>
                <Title headingLevel="h2">{label}</Title>
                <DescriptionList id={props.id} isHorizontal isCompact style={{ paddingLeft: 16, paddingBottom: 16, paddingRight: 16 }}>
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
                    {props.id && <LabelHelp id={props.id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />}
                </Split>
                {props.description && <Text component="small">{props.description}</Text>}
            </Stack>
            {props.children}
        </FormSection>
    )
}
