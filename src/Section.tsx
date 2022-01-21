import { DescriptionList, Divider, Split, SplitItem, Stack, Text, Title } from '@patternfly/react-core'
import { AngleDownIcon, AngleLeftIcon, ExclamationCircleIcon } from '@patternfly/react-icons'
import { Fragment, ReactNode, useState } from 'react'
import { LabelHelp } from './components/LabelHelp'
import { HasValueContext, HasValueProvider } from './contexts/HasValueProvider'
import { Mode, useMode } from './contexts/ModeContext'
import { useShowValidation } from './contexts/ShowValidationProvider'
import { HasValidationErrorContext, ValidationProvider } from './contexts/ValidationProvider'

export function Section(props: {
    id?: string
    label: string
    description?: string
    prompt?: string
    children?: ReactNode
    defaultExpanded?: boolean
    labelHelpTitle?: string
    labelHelp?: string
}) {
    const mode = useMode()
    const id = props.id ?? props.label.toLowerCase().split(' ').join('-')
    const showValidation = useShowValidation()
    const [expanded, setExpanded] = useState(props.defaultExpanded === undefined ? true : props.defaultExpanded)

    return (
        <HasValueProvider>
            {mode === Mode.Details ? (
                <HasValueContext.Consumer>
                    {(hasValue) =>
                        hasValue ? (
                            <Fragment>
                                <Title headingLevel="h2">{props.label}</Title>
                                <DescriptionList
                                    id={id}
                                    isHorizontal
                                    isCompact
                                    style={{ paddingLeft: 16, paddingBottom: 16, paddingRight: 16 }}
                                >
                                    {props.children}
                                </DescriptionList>
                            </Fragment>
                        ) : (
                            <div style={{ display: 'none' }}>{props.children}</div>
                        )
                    }
                </HasValueContext.Consumer>
            ) : (
                <ValidationProvider key={id}>
                    <HasValidationErrorContext.Consumer>
                        {(hasValidationError) => (
                            <section id={id} className="pf-c-form__section" role="group">
                                <Split hasGutter onClick={() => setExpanded(!expanded)}>
                                    <SplitItem isFilled>
                                        <Stack hasGutter>
                                            <Split hasGutter>
                                                <span className="pf-c-form__section-title">{props.label}</span>
                                                {props.id && (
                                                    <LabelHelp
                                                        id={props.id}
                                                        labelHelp={props.labelHelp}
                                                        labelHelpTitle={props.labelHelpTitle}
                                                    />
                                                )}
                                            </Split>
                                            {expanded && props.description && <Text component="small">{props.description}</Text>}
                                        </Stack>
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
            )}
        </HasValueProvider>
    )
}
