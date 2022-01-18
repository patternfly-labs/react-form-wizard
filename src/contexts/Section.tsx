import { Divider, Split, SplitItem } from '@patternfly/react-core'
import { AngleDownIcon, AngleLeftIcon, ExclamationCircleIcon } from '@patternfly/react-icons'
import { ReactNode, useState } from 'react'
import { useShowValidation } from './ShowValidationProvider'
import { ValidContext, ValidProvider } from './ValidProvider'

export function Section(props: { label: string; children?: ReactNode; defaultExpanded?: boolean }) {
    const showValidation = useShowValidation()
    const [expanded, setExpanded] = useState(props.defaultExpanded === undefined ? true : props.defaultExpanded)
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
