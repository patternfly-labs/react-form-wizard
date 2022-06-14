import { Split, Stack, Switch as PFSwitch, Text } from '@patternfly/react-core'
import { CheckIcon } from '@patternfly/react-icons'
import { Fragment, ReactNode } from 'react'
import { Indented } from '../components/Indented'
import { LabelHelp } from '../components/LabelHelp'
import { DisplayMode } from '../contexts/DisplayModeContext'
import { InputCommonProps, useInput } from './Input'
import { WizFormGroup } from './WizFormGroup'

export type WizSwitchProps = InputCommonProps & {
    children?: ReactNode
    title?: string
}

// isChecked prop needs to be a boolean. If value is a string need to get the boolean
function getIsChecked(value: any) {
    if (value === 'true') {
        return true
    } else if (value === 'false') {
        return false
    }
    return value
}

export function WizSwitch(props: WizSwitchProps) {
    const { displayMode: mode, value, setValue, hidden, id } = useInput(props)

    if (hidden) return <Fragment />

    if (mode === DisplayMode.Details) {
        if (!value) return <Fragment />
        return (
            <Fragment>
                <Split id={id}>
                    <CheckIcon style={{ paddingRight: 5 }} />
                    <div className="pf-c-description-list__term" style={{ paddingLeft: 2 }}>
                        {props.label}
                    </div>
                </Split>
                {value && props.children}
            </Fragment>
        )
    }

    return (
        <Stack hasGutter>
            <Stack>
                <WizFormGroup {...props} id={id} label={props.title} helperText={undefined}>
                    <Split>
                        <PFSwitch id={id} isChecked={getIsChecked(value)} onChange={setValue} label={props.label} value={value} />
                        <LabelHelp id={id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />
                    </Split>
                </WizFormGroup>
                {props.helperText && (
                    <Text className="pf-c-form__helper-text" style={{ paddingLeft: 22 }}>
                        {props.helperText}
                    </Text>
                )}
            </Stack>
            {value && <Indented paddingBottom={8}>{props.children}</Indented>}
        </Stack>
    )
}
