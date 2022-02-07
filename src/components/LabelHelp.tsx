import { Popover } from '@patternfly/react-core/dist/js/components//Popover'
import { Button } from '@patternfly/react-core/dist/js/components/Button'
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon'
import { Fragment } from 'react'

export function LabelHelp(props: { id: string; labelHelp?: string; labelHelpTitle?: string }): JSX.Element {
    return props.labelHelp ? (
        <Popover id={`${props.id}-label-help-popover`} headerContent={props.labelHelpTitle} bodyContent={props.labelHelp}>
            <Button
                variant="plain"
                id={`${props.id}-label-help-button`}
                aria-label="More info"
                onClick={(e) => e.preventDefault()}
                className="pf-c-form__group-label-help"
            >
                <HelpIcon noVerticalAlign />
            </Button>
        </Popover>
    ) : (
        <Fragment />
    )
}
