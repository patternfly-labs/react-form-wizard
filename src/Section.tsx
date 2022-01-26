import { DescriptionList, Divider, Split, SplitItem, Stack, Title } from '@patternfly/react-core'
import { AngleDownIcon, AngleLeftIcon, ExclamationCircleIcon } from '@patternfly/react-icons'
import { Fragment, ReactNode, useState } from 'react'
import { LabelHelp } from './components/LabelHelp'
import { HasInputsContext, HasInputsProvider } from './contexts/HasInputsProvider'
import { HasValueContext, HasValueProvider } from './contexts/HasValueProvider'
import { Mode, useMode } from './contexts/ModeContext'
import { useShowValidation } from './contexts/ShowValidationProvider'
import { HasValidationErrorContext, ValidationProvider } from './contexts/ValidationProvider'
import { HiddenFn, useInputHidden } from './inputs/Input'

type SectionProps = {
    id?: string
    label: string
    description?: string
    prompt?: string
    children?: ReactNode
    defaultExpanded?: boolean
    labelHelpTitle?: string
    labelHelp?: string
    hidden?: HiddenFn
    collapsable?: boolean
}

export function Section(props: SectionProps) {
    return <SectionInternal {...props} />
}

function SectionInternal(props: SectionProps) {
    const mode = useMode()
    const id = props.id ?? props.label.toLowerCase().split(' ').join('-')
    const showValidation = useShowValidation()
    const [expanded, setExpanded] = useState(props.defaultExpanded === undefined ? true : props.defaultExpanded)
    const hidden = useInputHidden(props)

    if (hidden) return <Fragment />

    if (mode === Mode.Details)
        return (
            <HasValueProvider key={id}>
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
            </HasValueProvider>
        )

    return (
        <HasInputsProvider key={id}>
            <HasInputsContext.Consumer>
                {(hasInputs) => (
                    <ValidationProvider>
                        <HasValidationErrorContext.Consumer>
                            {(hasValidationError) => (
                                <section
                                    id={id}
                                    className="pf-c-form__section"
                                    role="group"
                                    style={{ display: hasInputs ? undefined : 'none' }}
                                >
                                    <Split
                                        hasGutter
                                        onClick={() => {
                                            if (props.collapsable) setExpanded(!expanded)
                                        }}
                                    >
                                        <SplitItem isFilled>
                                            <Stack>
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
                                                {expanded && props.description && <p style={{ paddingTop: 8 }}>{props.description}</p>}
                                            </Stack>
                                        </SplitItem>
                                        {showValidation && !expanded && hasValidationError && (
                                            <SplitItem>
                                                <Split>
                                                    <SplitItem>
                                                        <ExclamationCircleIcon color="var(--pf-global--danger-color--100)" />
                                                    </SplitItem>
                                                    <SplitItem>
                                                        <span className="pf-c-form__helper-text pf-m-error">
                                                            &nbsp; Expand to fix validation errors
                                                        </span>
                                                    </SplitItem>
                                                </Split>
                                            </SplitItem>
                                        )}
                                        {props.collapsable &&
                                            (expanded ? (
                                                <SplitItem>
                                                    <div style={{ marginBottom: -5 }}>
                                                        <AngleDownIcon />
                                                    </div>
                                                </SplitItem>
                                            ) : (
                                                <SplitItem>
                                                    <div style={{ marginBottom: -5 }}>
                                                        <AngleLeftIcon />
                                                    </div>
                                                </SplitItem>
                                            ))}
                                    </Split>
                                    {expanded ? props.children : <div style={{ display: 'none' }}>{props.children}</div>}
                                    {!expanded && <Divider />}
                                </section>
                            )}
                        </HasValidationErrorContext.Consumer>
                    </ValidationProvider>
                )}
            </HasInputsContext.Consumer>
        </HasInputsProvider>
    )
}
