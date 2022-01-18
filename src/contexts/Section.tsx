import { DescriptionList, Divider, Split, SplitItem, Title } from '@patternfly/react-core'
import { AngleDownIcon, AngleLeftIcon, ExclamationCircleIcon } from '@patternfly/react-icons'
import { Fragment, ReactNode, useState } from 'react'
import { Mode, useMode } from './ModeContext'
import { useShowValidation } from './ShowValidationProvider'
import { ValidContext, ValidProvider } from './ValidProvider'

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
        <ValidProvider>
            <ValidContext.Consumer>
                {(valid) => (
                    <section className="pf-c-form__section" role="group">
                        <Split hasGutter onClick={() => setExpanded(!expanded)}>
                            <SplitItem isFilled className="pf-c-form__section-title">
                                {props.label}
                            </SplitItem>
                            {showValidation && !expanded && !valid && (
                                <SplitItem>
                                    <ExclamationCircleIcon color="#c00" />
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
            </ValidContext.Consumer>
        </ValidProvider>
    )
}
