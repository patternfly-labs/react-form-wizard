import { DescriptionList, FormSection, Stack, Text, Title } from '@patternfly/react-core'
import { Fragment, ReactNode, useContext } from 'react'
import { InputContext, InputMode } from './contexts/InputContext'
import { inputHasValue, isInputHiddenProps } from './lib/input-utils'

interface InputSectionProps {
    label: string
    prompt?: string
    description?: string
    children: ReactNode
    hidden?: (item: any) => boolean
}

export function InputSection(props: InputSectionProps) {
    let inputContext = useContext(InputContext)

    let label = props.label
    if (inputContext.mode == InputMode.Wizard) {
        if (props.prompt) {
            label = props.prompt
        }
    }

    const hidden = isInputHiddenProps(props)
    if (hidden) return <Fragment />

    if (inputContext.mode === InputMode.Details) {
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
