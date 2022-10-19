import { Button, Popover } from '@patternfly/react-core'
import { HelpIcon } from '@patternfly/react-icons'
import { Fragment, ReactNode } from 'react'
import { useStringContext } from '../contexts/StringContext'

export function LabelHelp(props: { id: string; labelHelp?: ReactNode; labelHelpTitle?: string }): JSX.Element {
    const { moreInfo } = useStringContext()
    return props.labelHelp ? (
        <Popover id={`${props.id}-label-help-popover`} headerContent={props.labelHelpTitle} bodyContent={props.labelHelp}>
            <Button
                variant="plain"
                isInline
                id={`${props.id}-label-help-button`}
                aria-label={moreInfo}
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
