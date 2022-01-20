import { DescriptionList, Divider, Split, SplitItem, Title } from '@patternfly/react-core'
import { AngleDownIcon, AngleLeftIcon, ExclamationCircleIcon } from '@patternfly/react-icons'
import { Fragment, ReactNode, useState } from 'react'
import { Mode, useMode } from './contexts/ModeContext'
import { useShowValidation } from './contexts/ShowValidationProvider'
import { HasValidationErrorContext, ValidationProvider } from './contexts/ValidationProvider'

export function Section(props: { label: string; children?: ReactNode; defaultExpanded?: boolean }) {
    const mode = useMode()
    const id = props.label.split(' ').join('-')
    const showValidation = useShowValidation()
    const [expanded, setExpanded] = useState(props.defaultExpanded === undefined ? true : props.defaultExpanded)

    if (mode === Mode.Details) {
        // if (!inputHasValue(props, item)) {
        //     return <Fragment />
        // }
        return (
            <Fragment>
                <Title headingLevel="h2">{props.label}</Title>
                <DescriptionList id={id} isHorizontal isCompact style={{ paddingLeft: 16, paddingBottom: 16, paddingRight: 16 }}>
                    {props.children}
                </DescriptionList>
            </Fragment>
        )
    }

    return (
        <ValidationProvider>
            <HasValidationErrorContext.Consumer>
                {(hasValidationError) => (
                    <section className="pf-c-form__section" role="group">
                        <Split hasGutter onClick={() => setExpanded(!expanded)}>
                            <SplitItem isFilled className="pf-c-form__section-title">
                                {props.label}
                            </SplitItem>
                            {showValidation && !expanded && hasValidationError && (
                                <SplitItem>
                                    <Split>
                                        <SplitItem>
                                            <ExclamationCircleIcon color="#c00" />
                                        </SplitItem>
                                        <SplitItem>
                                            <span className="pf-c-form__helper-text pf-m-error">
                                                &nbsp; Expand to fix validation errors
                                            </span>
                                        </SplitItem>
                                    </Split>
                                </SplitItem>
                            )}
                            {expanded ? (
                                <SplitItem>
                                    <AngleDownIcon />
                                </SplitItem>
                            ) : (
                                <SplitItem>
                                    <AngleLeftIcon />
                                </SplitItem>
                            )}
                        </Split>
                        {expanded ? props.children : <div style={{ display: 'none' }}>{props.children}</div>}
                        {!expanded && <Divider />}
                    </section>
                )}
            </HasValidationErrorContext.Consumer>
        </ValidationProvider>
    )
}
