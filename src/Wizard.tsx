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
import { Children, Fragment, isValidElement, ReactElement, ReactNode, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { YamlEditor, YamlToObject } from './components/YamlEditor'
import { DataContext, useData } from './contexts/DataContext'
import { DisplayMode, DisplayModeContext } from './contexts/DisplayModeContext'
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
}

export type WizardSubmit = (data: object) => Promise<void>
export type WizardCancel = () => void

export function Wizard(props: WizardProps & { showHeader?: boolean; showYaml?: boolean }) {
    const [data, setData] = useState(props.defaultData ?? {})
    const update = useCallback((newData) => setData((data) => JSON.parse(JSON.stringify(newData ?? data))), [])
    const [drawerExpanded, setDrawerExpanded] = useState<boolean>(false)
    useEffect(() => {
        if (props.showYaml !== undefined) {
            setDrawerExpanded(props.showYaml)
        }
    }, [props.showYaml])
    const mode = DisplayMode.Wizard
    const [template] = useState(() => (props.template ? Handlebars.compile(props.template) : undefined))
    const [template2] = useState(() => (props.yamlToDataTemplate ? Handlebars.compile(props.yamlToDataTemplate) : undefined))

    return (
        <StepHasInputsProvider>
            <StepValidationProvider>
                <DisplayModeContext.Provider value={mode}>
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
                                                />
                                            }
                                        >
                                            <DrawerContentBody>
                                                <PageSection
                                                    variant="light"
                                                    style={{ height: '100%' }}
                                                    type={mode === DisplayMode.Wizard ? PageSectionTypes.wizard : PageSectionTypes.default}
                                                    isWidthLimited
                                                >
                                                    <ItemContext.Provider value={data}>
                                                        <WizardInternal
                                                            onSubmit={props.onSubmit}
                                                            onCancel={props.onCancel}
                                                            hasButtons={props.hasButtons}
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
    )
}

function WizardInternal(props: { children: ReactNode; onSubmit: WizardSubmit; onCancel: WizardCancel; hasButtons?: boolean }) {
    const steps = Children.toArray(props.children).filter((child) => isValidElement(child) && child.type === Step) as ReactElement[]
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
}) {
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
            {props.hasButtons !== false && (
                <footer className="pf-c-wizard__footer">
                    {props.activeStep === props.steps[props.steps.length - 1] ? (
                        <Button
                            variant="primary"
                            isDisabled={hasValidationError && showValidation}
                            type="submit"
                            onClick={() => {
                                setShowValidation(true)
                                if (props.template) {
                                    void props.onSubmit(YamlToObject(props.template(item)))
                                } else {
                                    void props.onSubmit(item)
                                }
                            }}
                        >
                            Submit
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            isDisabled={hasValidationError && showValidation}
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
                    <Button variant="secondary" onClick={props.back} isDisabled={props.activeStep === props.steps?.[0]}>
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

function StepNavItem(props: { step: ReactElement; activeStep: ReactElement; setActiveStep: (activeStep: ReactElement) => void }) {
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
            >
                <Split>
                    <SplitItem isFilled>{props.step.props.label}</SplitItem>
                    {/* {stepHasInputs[props.step.props.id] === true ? (
                        <SplitItem>
                            <CircleIcon color="var(--pf-global--success-color--100)" />
                        </SplitItem>
                    ) : (
                        <SplitItem>
                            <CircleIcon color="var(--pf-global--danger-color--100)" />
                        </SplitItem>
                    )} */}
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
}) {
    const [activeKey, setActiveKey] = useState<number | string>(0)
    const { update } = useData()
    const devMode = process.env.NODE_ENV === 'development'
    return (
        <Fragment>
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
                                    data={props.template ? YamlToObject(props.template(props.data)) : props.data}
                                    setData={(data: any) => {
                                        let newData = data
                                        if (props.template2) newData = YamlToObject(props.template2(data))
                                        update(newData)
                                    }}
                                />
                            </Tab>
                            <Tab eventKey={2} title={<TabTitleText>Data</TabTitleText>}>
                                <YamlEditor data={props.data} />
                            </Tab>
                        </Tabs>
                    </div>
                ) : (
                    // <PageSection>
                    <YamlEditor
                        data={props.template ? YamlToObject(props.template(props.data)) : props.data}
                        setData={(data: any) => {
                            let newData = data
                            if (props.template2) newData = YamlToObject(props.template2(data))
                            update(newData)
                        }}
                    />
                    // </PageSection>
                )}
            </DrawerPanelContent>
        </Fragment>
    )
}
