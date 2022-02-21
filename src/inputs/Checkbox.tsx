import { Checkbox as PFCheckbox, Split, Stack, Text } from '@patternfly/react-core'
import { CheckIcon } from '@patternfly/react-icons'
import { Fragment, ReactNode, useCallback, useMemo } from 'react'
import { Indented } from '../components/Indented'
import { LabelHelp } from '../components/LabelHelp'
import { DisplayMode } from '../contexts/DisplayModeContext'
import { InputCommonProps, useInput } from './Input'
import { InputLabel } from './InputLabel'

export type CheckboxProps = InputCommonProps & {
    children?: ReactNode
    title?: string
    map?: (value: unknown, checked: boolean) => unknown
    unmap?: (value: unknown) => boolean
}

export function Checkbox(props: CheckboxProps) {
    const { displayMode: mode, value, setValue, hidden, id } = useInput(props)

    const isChecked = useMemo(() => {
        if (props.unmap) {
            return props.unmap(value)
        } else {
            return value
        }
    }, [props, value])

    const onChange = useCallback(
        (checked: boolean) => {
            if (props.map) {
                setValue(props.map(value, checked))
            } else {
                setValue(checked)
            }
        },
        [props, setValue, value]
    )

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
                <InputLabel {...props} id={id} label={props.title} helperText={undefined}>
                    <Split>
                        <PFCheckbox id={id} isChecked={isChecked} onChange={onChange} label={props.label} />
                        <LabelHelp id={id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />
                    </Split>
                </InputLabel>
                {props.helperText && (
                    <Text className="pf-c-form__helper-text" style={{ paddingLeft: 22 }}>
                        {props.helperText}
                    </Text>
                )}
            </Stack>
            {isChecked && <Indented paddingBottom={8}>{props.children}</Indented>}
        </Stack>
    )
}
