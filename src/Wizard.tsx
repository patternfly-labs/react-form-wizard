import {
    Alert,
    Button,
    DescriptionList,
    Drawer,
    DrawerContent,
    DrawerContentBody,
    DrawerPanelContent,
    PageSection,
    PageSectionTypes,
    Split,
    SplitItem,
    Tab,
    Tabs,
    TabTitleText,
} from '@patternfly/react-core'
import { ExclamationCircleIcon } from '@patternfly/react-icons'
import Handlebars, { HelperOptions } from 'handlebars'
import {
    Children,
    Fragment,
    isValidElement,
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from 'react'
import { EditMode } from '.'
import { YamlEditor, YamlToObject } from './components/YamlEditor'
import { DataContext, useData } from './contexts/DataContext'
import { DisplayMode, DisplayModeContext } from './contexts/DisplayModeContext'
import { EditModeContext } from './contexts/EditModeContext'
import { HasInputsProvider } from './contexts/HasInputsProvider'
import { ItemContext, useItem } from './contexts/ItemContext'
import { ShowValidationProvider, useSetShowValidation, useShowValidation } from './contexts/ShowValidationProvider'
import { StepHasInputsProvider, useStepHasInputs } from './contexts/StepHasInputsProvider'
import { StepValidationProvider, useStepHasValidationError } from './contexts/StepValidationProvider'
import { useHasValidationError, ValidationProvider } from './contexts/ValidationProvider'
import { useID } from './inputs/Input'
import { Step } from './Step'

Handlebars.registerHelper('if_eq', function (this: unknown, arg1: string, arg2: string, options: HelperOptions) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this)
})

Handlebars.registerHelper('if_ne', function (this: unknown, arg1: string, arg2: string, options: HelperOptions) {
    return arg1 !== arg2 ? options.fn(this) : options.inverse(this)
})

export interface WizardProps {
    title: string
    description?: string
    children: ReactNode
    defaultData?: object
    template?: string
    yamlToDataTemplate?: string
    onSubmit: WizardSubmit
    onCancel: WizardCancel
    hasButtons?: boolean
    editMode?: EditMode
}

export type WizardSubmit = (data: unknown) => Promise<void>
export type WizardCancel = () => void

function getSteps(children: ReactNode | ReactNode[]) {
    const childArray = Children.toArray(children)
    let steps = childArray.filter((child) => isValidElement(child) && child.type === Step) as ReactElement[]
    if (steps.length === 0) {
        if (childArray.length === 1) {
            const child = childArray[0]
            if (isValidElement(child)) {
                steps = getSteps(child.props.children)
            }
        }
    }
    return steps
}

export function Wizard(props: WizardProps & { showHeader?: boolean; showYaml?: boolean }) {
    const [data, setData] = useState(props.defaultData ? JSON.parse(JSON.stringify(props.defaultData)) : {})
    const update = useCallback((newData) => setData((data: unknown) => JSON.parse(JSON.stringify(newData ?? data))), [])
    const [drawerExpanded, setDrawerExpanded] = useState<boolean>(false)
    useEffect(() => {
        if (props.showYaml !== undefined) {
            setDrawerExpanded(props.showYaml)
        }
    }, [props.showYaml])
    const displayMode = DisplayMode.Wizard
    const [template] = useState(() => (props.template ? Handlebars.compile(props.template) : undefined))
    const [template2] = useState(() => (props.yamlToDataTemplate ? Handlebars.compile(props.yamlToDataTemplate) : undefined))
    const isYamlArray = useMemo(() => Array.isArray(props.defaultData), [props.defaultData])

    return (
        <EditModeContext.Provider value={props.editMode === undefined ? EditMode.Create : props.editMode}>
            <StepHasInputsProvider>
                <StepValidationProvider>
                    <DisplayModeContext.Provider value={displayMode}>
                        <DataContext.Provider value={{ update }}>
                            <ItemContext.Provider value={data}>
                                <ShowValidationProvider>
                                    <ValidationProvider>
                                        <Drawer isExpanded={drawerExpanded} isInline>
                                            <DrawerContent
                                                panelContent={
                                                    <WizardPageDrawer
                                                        data={data}
                                                        template={template}
                                                        template2={template2}
                                                        templateString={props.template}
                                                        isYamlArray={isYamlArray}
                                                    />
                                                }
                                            >
                                                <DrawerContentBody>
                                                    <PageSection
                                                        variant="light"
                                                        style={{ height: '100%' }}
                                                        type={
                                                            displayMode === DisplayMode.Wizard
                                                                ? PageSectionTypes.wizard
                                                                : PageSectionTypes.default
                                                        }
                                                        isWidthLimited
                                                    >
                                                        <ItemContext.Provider value={data}>
                                                            <WizardInternal
                                                                onSubmit={props.onSubmit}
                                                                onCancel={props.onCancel}
                                                                hasButtons={props.hasButtons}
                                                                template={template}
                                                                isYamlArray={isYamlArray}
                                                            >
                                                                {props.children}
                                                            </WizardInternal>
                                                        </ItemContext.Provider>
                                                    </PageSection>
                                                </DrawerContentBody>
                                            </DrawerContent>
                                        </Drawer>
                                    </ValidationProvider>
                                </ShowValidationProvider>
                            </ItemContext.Provider>
                        </DataContext.Provider>
                    </DisplayModeContext.Provider>
                </StepValidationProvider>
            </StepHasInputsProvider>
        </EditModeContext.Provider>
    )
}

function WizardInternal(props: {
    template?: HandlebarsTemplateDelegate
    children: ReactNode
    onSubmit: WizardSubmit
    onCancel: WizardCancel
    hasButtons?: boolean
    isYamlArray: boolean
}) {
    const steps = getSteps(props.children)
    if (props.hasButtons !== false) {
        steps.push(
            <Step label="Review" id="review-step">
                <DescriptionList isHorizontal isCompact style={{ paddingLeft: 16, paddingBottom: 16, paddingRight: 16 }}>
                    <DisplayModeContext.Provider value={DisplayMode.Details}>{props.children}</DisplayModeContext.Provider>
                </DescriptionList>
            </Step>
        )
    }

    const [activeIndex, setActiveIndex] = useState(0)
    const next = useCallback(() => setActiveIndex((activeIndex) => activeIndex + 1), [])
    const back = useCallback(() => setActiveIndex((activeIndex) => activeIndex - 1), [])
    const setActiveStep = (step: ReactElement) => setActiveIndex(steps.indexOf(step))

    let activeStep = steps[activeIndex]
    if (!activeStep) activeStep = steps[0]

    const setShowValidation = useSetShowValidation()
    useLayoutEffect(() => {
        if (activeStep.props.id === 'review-step') {
            setShowValidation(true)
        }
    }, [activeStep, setShowValidation])

    return (
        <div className="pf-c-wizard">
            {/* <button aria-label="Wizard Header Toggle" className="pf-c-wizard__toggle" aria-expanded="false">
                <span className="pf-c-wizard__toggle-list">
                    <span className="pf-c-wizard__toggle-list-item">
                        <span className="pf-c-wizard__toggle-num">2</span>
                        Configuration
                        <i className="fas fa-angle-right pf-c-wizard__toggle-separator" aria-hidden="true"></i>
                    </span>
                    <span className="pf-c-wizard__toggle-list-item">Substep B</span>
                </span>
                <span className="pf-c-wizard__toggle-icon">
                    <i className="fas fa-caret-down" aria-hidden="true"></i>
                </span>
            </button> */}
            {steps?.map((step) => {
                if (step !== activeStep)
                    return (
                        <HasInputsProvider key={step.props.id}>
                            <ShowValidationProvider>
                                <ValidationProvider>
                                    <div style={{ display: 'none' }}>{step}</div>
                                </ValidationProvider>
                            </ShowValidationProvider>
                        </HasInputsProvider>
                    )
                if (step.props.id === 'review-step') {
                    return (
                        <HasInputsProvider key={step.props.id}>
                            <WizardActiveStep
                                activeStep={activeStep}
                                setActiveStep={setActiveStep}
                                steps={steps}
                                next={next}
                                back={back}
                                onSubmit={props.onSubmit}
                                onCancel={props.onCancel}
                                hasButtons={props.hasButtons}
                                template={props.template}
                                isYamlArray={props.isYamlArray}
                            />
                        </HasInputsProvider>
                    )
                }
                return (
                    <HasInputsProvider key={step.props.id}>
                        <ShowValidationProvider>
                            <ValidationProvider>
                                <WizardActiveStep
                                    activeStep={activeStep}
                                    setActiveStep={setActiveStep}
                                    steps={steps}
                                    next={next}
                                    back={back}
                                    onSubmit={props.onSubmit}
                                    onCancel={props.onCancel}
                                    hasButtons={props.hasButtons}
                                    isYamlArray={props.isYamlArray}
                                />
                            </ValidationProvider>
                        </ShowValidationProvider>
                    </HasInputsProvider>
                )
            })}
        </div>
    )
}

export function WizardActiveStep(props: {
    steps: ReactElement[]
    activeStep: ReactElement
    setActiveStep: (activeStep: ReactElement) => void
    next: () => void
    back: () => void
    onSubmit: WizardSubmit
    onCancel: WizardCancel
    template?: HandlebarsTemplateDelegate
    hasButtons?: boolean
    isYamlArray: boolean
}) {
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')

    const { onSubmit } = props
    const onSubmit2 = useCallback(
        async (data: object) => {
            setSubmitError('')
            setSubmitting(true)
            try {
                await onSubmit(data)
            } catch (err) {
                if (err instanceof Error) {
                    setSubmitError(err.message)
                    return err.message
                } else {
                    setSubmitError('Unknown error')
                    return 'Unknown error'
                }
            } finally {
                setSubmitting(false)
            }
            return undefined
        },
        [onSubmit]
    )

    const hasValidationError = useHasValidationError()
    const showValidation = useShowValidation()
    const setShowValidation = useSetShowValidation()
    const id = useID(props.activeStep.props)
    const item = useItem()
    return (
        <div className="pf-c-wizard__outer-wrap" id={id}>
            <div className="pf-c-wizard__inner-wrap">
                <nav className="pf-c-wizard__nav" aria-label="Steps">
                    <ol className="pf-c-wizard__nav-list">
                        {props.steps?.map((step) => (
                            <StepNavItem
                                key={step.props.label}
                                step={step}
                                activeStep={props.activeStep}
                                setActiveStep={props.setActiveStep}
                                isDisabled={submitting}
                            />
                        ))}
                    </ol>
                </nav>
                <main className="pf-c-wizard__main">
                    <div className="pf-c-wizard__main-body">
                        <form noValidate className="pf-c-form">
                            {props.activeStep}
                        </form>
                    </div>
                </main>
            </div>
            {hasValidationError && showValidation && <Alert title="Please fix validation errors" isInline variant="danger" />}
            {submitError && <Alert title={submitError} isInline variant="danger" />}
            {props.hasButtons !== false && (
                <footer className="pf-c-wizard__footer">
                    {props.activeStep === props.steps[props.steps.length - 1] ? (
                        <Button
                            variant="primary"
                            isDisabled={(hasValidationError && showValidation) || submitting}
                            type="submit"
                            onClick={() => {
                                setShowValidation(true)
                                if (props.template) {
                                    void onSubmit2(YamlToObject(props.template(item), props.isYamlArray))
                                } else {
                                    void onSubmit2(item)
                                }
                            }}
                            isLoading={submitting}
                        >
                            {submitting ? 'Submitting' : 'Submit'}
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            isDisabled={(hasValidationError && showValidation) || submitting}
                            type="submit"
                            onClick={() => {
                                setShowValidation(true)
                                if (!hasValidationError) {
                                    props.next()
                                }
                            }}
                        >
                            Next
                        </Button>
                    )}
                    <Button variant="secondary" onClick={props.back} isDisabled={props.activeStep === props.steps?.[0] || submitting}>
                        Back
                    </Button>
                    <div className="pf-c-wizard__footer-cancel">
                        <Button variant="link" onClick={props.onCancel}>
                            Cancel
                        </Button>
                    </div>
                </footer>
            )}
        </div>
    )
}

function StepNavItem(props: {
    step: ReactElement
    activeStep: ReactElement
    setActiveStep: (activeStep: ReactElement) => void
    isDisabled: boolean
}) {
    let classname = 'pf-c-wizard__nav-link'
    if (props.activeStep === props.step) {
        classname += ' pf-m-current'
    }

    const stepHasValidationError = useStepHasValidationError()

    const stepHasInputs = useStepHasInputs()
    if (!stepHasInputs[props.step.props.id]) {
        return <Fragment />
    }

    return (
        <li key={props.step.props.id} className="pf-c-wizard__nav-item">
            <button
                id={`${props.step.props.id as string}-button`}
                className={classname}
                onClick={() => {
                    props.setActiveStep(props.step)
                }}
                disabled={props.isDisabled}
            >
                <Split>
                    <SplitItem isFilled>{props.step.props.label}</SplitItem>
                    {props.step.props.id !== 'review-step' && stepHasValidationError[props.step.props.id] && (
                        <SplitItem>
                            <ExclamationCircleIcon color="var(--pf-global--danger-color--100)" />
                        </SplitItem>
                    )}
                </Split>
            </button>
        </li>
    )
}

function WizardPageDrawer(props: {
    data: unknown
    template?: HandlebarsTemplateDelegate
    template2?: HandlebarsTemplateDelegate
    templateString?: string
    isYamlArray: boolean
}) {
    const [activeKey, setActiveKey] = useState<number | string>(0)
    const { update } = useData()
    const devMode = process.env.NODE_ENV === 'development'
    return (
        <DrawerPanelContent isResizable={true} defaultSize="800px" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
            {props.template && devMode ? (
                <div style={{ height: '100%' }}>
                    <Tabs
                        activeKey={activeKey}
                        onSelect={(_event, tabIndex) => setActiveKey(tabIndex)}
                        isBox
                        variant="light300"
                        isFilled
                        style={{ backgroundColor: 'white' }}
                    >
                        <Tab eventKey={0} title={<TabTitleText>Yaml</TabTitleText>}>
                            <YamlEditor
                                data={props.template ? YamlToObject(props.template(props.data), props.isYamlArray) : props.data}
                                setData={(data: any) => {
                                    let newData = data
                                    if (props.template2) newData = YamlToObject(props.template2(data), props.isYamlArray)
                                    update(newData)
                                }}
                                isYamlArray={props.isYamlArray}
                            />
                        </Tab>
                        <Tab eventKey={2} title={<TabTitleText>Data</TabTitleText>}>
                            <YamlEditor data={props.data} isYamlArray={props.isYamlArray} />
                        </Tab>
                    </Tabs>
                </div>
            ) : (
                <YamlEditor
                    data={props.template ? YamlToObject(props.template(props.data), props.isYamlArray) : props.data}
                    setData={(data: any) => {
                        let newData = data
                        if (props.template2) newData = YamlToObject(props.template2(data), props.isYamlArray)
                        update(newData)
                    }}
                    isYamlArray={props.isYamlArray}
                />
            )}
        </DrawerPanelContent>
    )
}
