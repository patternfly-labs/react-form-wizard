import { FormHelperText } from '@patternfly/react-core'
import { ReactNode } from 'react'

export function HelperText(props: { helperText?: ReactNode }) {
    return props.helperText ? <FormHelperText isHidden={false}>{props.helperText}</FormHelperText> : <></>
}
