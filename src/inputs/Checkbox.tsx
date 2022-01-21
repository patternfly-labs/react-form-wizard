import {
    Checkbox as PFCheckbox,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Split,
    Stack,
    Text,
} from '@patternfly/react-core'
import { Fragment, ReactNode } from 'react'
import { Indented } from '../components/Indented'
import { LabelHelp } from '../components/LabelHelp'
import { Mode } from '../contexts/ModeContext'
import { InputCommonProps, useInput } from './Input'
import { InputLabel } from './InputLabel'

type CheckboxProps = InputCommonProps & { children?: ReactNode; title?: string }

export function Checkbox(
    props: CheckboxProps

    // id: string
    // label: string
    // path?: string
    // placeholder?: string
    // secret?: boolean
    // readonly?: boolean
    // disabled?: boolean
    // hidden?: () => boolean
    // labelHelp?: string
    // labelHelpTitle?: string
    // helperText?: string
    // validation?: (value: string) => string | undefined
    // children?: ReactNode
    // title?: string
) {
    const { mode, value, setValue, hidden, id } = useInput(props)

    if (hidden) return <Fragment />

    if (mode === Mode.Details) {
        if (value === undefined) return <Fragment />
        return (
            <DescriptionListGroup id={props.id}>
                <DescriptionListTerm>{props.label}</DescriptionListTerm>
                <DescriptionListDescription>{value ? 'True' : 'False'}</DescriptionListDescription>
            </DescriptionListGroup>
        )
    }

    return (
        <Fragment>
            <Stack>
                <InputLabel {...props} id={id} label={props.title}>
                    <Split>
                        <PFCheckbox id={id ?? props.label} isChecked={value} onChange={setValue} label={props.label} value={value} />
                        <LabelHelp id={id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />
                    </Split>
                </InputLabel>

                {props.helperText && (
                    <Text style={{ paddingLeft: 24, paddingTop: 8 }} component="small">
                        {props.helperText}
                    </Text>
                )}
            </Stack>
            {value && <Indented>{props.children}</Indented>}
        </Fragment>
    )
}
