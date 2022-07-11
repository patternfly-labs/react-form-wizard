import { Button, Popover } from '@patternfly/react-core'
import { HelpIcon } from '@patternfly/react-icons'
import { Fragment, ReactNode } from 'react'

export function LabelHelp(props: { id: string; labelHelp?: ReactNode; labelHelpTitle?: string }): JSX.Element {
    return props.labelHelp ? (
        <Popover id={`${props.id}-label-help-popover`} headerContent={props.labelHelpTitle} bodyContent={props.labelHelp}>
            <Button
                variant="plain"
                isInline
                id={`${props.id}-label-help-button`}
                aria-label="More info"
                onClick={(e) => e.preventDefault()}
                className="pf-c-form__group-label-help"
                style={{ padding: '0 var(--pf-c-button--PaddingRight) 0 var(--pf-c-button--PaddingLeft)' }}
            >
                <HelpIcon noVerticalAlign />
            </Button>
        </Popover>
    ) : (
        <Fragment />
    )
}
