import { KeyValue } from '..'

export function FormWizardLabels(props: {
    id: string
    label: string
    path?: string
    placeholder?: string
    secret?: boolean
    readonly?: boolean
    disabled?: boolean
    required?: boolean
    labelHelp?: string
    labelHelpTitle?: string
    helperText?: string
    validation?: (value: string) => string | undefined
    options?: {
        id: string
        label: string
        value: string
    }[]
    hidden?: (item: any) => boolean
}) {
    return <KeyValue id={props.id} path={props.path} label={props.label}></KeyValue>
}
