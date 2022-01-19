import {
    Alert,
    Button,
    Drawer,
    DrawerContent,
    DrawerContentBody,
    DrawerPanelContent,
    PageSection,
    PageSectionTypes,
    Tab,
    Tabs,
    TabTitleText,
} from '@patternfly/react-core'
import { Children, Fragment, isValidElement, ReactElement, ReactNode, useCallback, useEffect, useState } from 'react'
import { FormCancel, FormSubmit } from '.'
import { YamlEditor, YamlToObject } from './components/YamlEditor'
import { DataContext, useData } from './contexts/DataContext'
import { ItemContext } from './contexts/ItemContext'
import { Mode, ModeContext } from './contexts/ModeContext'
import { ShowValidationProvider, useSetShowValidation, useShowValidation } from './contexts/ShowValidationProvider'
import { useValid, ValidProvider } from './contexts/ValidProvider'
import { useID } from './inputs/FormWizardInput'
import { Step } from './Step'

export interface WizardProps {
    title: string
    description?: string
    children: ReactNode
    defaultData?: object
    template?: string
    yamlToDataTemplate?: string
    onSubmit: FormSubmit
    onCancel: FormCancel
}

export function Wizard(props: WizardProps & { showHeader?: boolean; showYaml?: boolean }) {
    const [data, setData] = useState(props.defaultData ?? {})
    const update = useCallback(() => setData((data) => JSON.parse(JSON.stringify(data))), [])
    const [drawerExpanded, setDrawerExpanded] = useState<boolean>(props.showYaml === undefined ? false : true)
    useEffect(() => {
        if (props.showYaml !== undefined) {
            setDrawerExpanded(props.showYaml)
        }
    }, [props.showYaml])
    const mode = Mode.Wizard
    const [template] = useState(() => (props.template ? Handlebars.compile(props.template) : undefined))
    const [template2] = useState(() => (props.yamlToDataTemplate ? Handlebars.compile(props.yamlToDataTemplate) : undefined))

    return (
        <ModeContext.Provider value={mode}>
            <DataContext.Provider value={{ update }}>
                <ItemContext.Provider value={data}>
                    <ValidProvider>
                        <Drawer isExpanded={drawerExpanded} isInline>
                            <DrawerContent
                                panelContent={
                                    <FormWizardPageDrawer
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
                                        type={mode === Mode.Wizard ? PageSectionTypes.wizard : PageSectionTypes.default}
                                        isWidthLimited
                                    >
                                        <ItemContext.Provider value={data}>
                                            {/* {mode === Mode.Wizard ? ( */}
                                            <WizardInternal>{props.children}</WizardInternal>
                                            {/* ) : (
                                                <FormWizardFormMode>{props.children}</FormWizardFormMode>
                                            )} */}
                                        </ItemContext.Provider>
                                    </PageSection>
                                </DrawerContentBody>
                            </DrawerContent>
                        </Drawer>
                    </ValidProvider>
                </ItemContext.Provider>
            </DataContext.Provider>
        </ModeContext.Provider>
    )
}

function WizardInternal(props: { children: ReactNode }) {
    const steps = Children.toArray(props.children).filter((child) => isValidElement(child) && child.type === Step) as ReactElement[]
    steps.push(
        <Step label="Review">
            <ModeContext.Provider value={Mode.Details}>{props.children}</ModeContext.Provider>
        </Step>
    )

    const [activeIndex, setActiveIndex] = useState(0)
    const next = useCallback(() => setActiveIndex((activeIndex) => activeIndex + 1), [])
    const back = useCallback(() => setActiveIndex((activeIndex) => activeIndex - 1), [])
    const setActiveStep = (step: ReactElement) => setActiveIndex(steps.indexOf(step))

    let activeStep = steps[activeIndex]
    if (!activeStep) activeStep = steps[0]

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
                        <ShowValidationProvider key={step.props.label}>
                            <ValidProvider>
                                <div style={{ display: 'none' }}>{step}</div>
                            </ValidProvider>
                        </ShowValidationProvider>
                    )
                return (
                    <ShowValidationProvider key={step.props.label}>
                        <ValidProvider>
                            <WizardActiveStep activeStep={activeStep} setActiveStep={setActiveStep} steps={steps} next={next} back={back} />
                        </ValidProvider>
                    </ShowValidationProvider>
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
}) {
    const valid = useValid()
    const showValidation = useShowValidation()
    const setShowValidation = useSetShowValidation()
    const id = useID(props.activeStep.props)
    return (
        <div className="pf-c-wizard__outer-wrap" id={id}>
            <div className="pf-c-wizard__inner-wrap">
                <nav className="pf-c-wizard__nav" aria-label="Steps">
                    <ol className="pf-c-wizard__nav-list">
                        {props.steps?.map((step) => {
                            let classname = 'pf-c-wizard__nav-link'
                            if (props.activeStep === step) {
                                classname += ' pf-m-current'
                            }
                            return (
                                <li key={step.props.label} className="pf-c-wizard__nav-item">
                                    <button
                                        className={classname}
                                        onClick={() => {
                                            props.setActiveStep(step)
                                        }}
                                    >
                                        {step.props.label}
                                    </button>
                                </li>
                            )
                        })}
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
            {!valid && showValidation && <Alert title="Please fix validation errors." isInline variant="danger" />}
            <footer className="pf-c-wizard__footer">
                <Button
                    variant="primary"
                    isDisabled={!valid && showValidation}
                    type="submit"
                    onClick={() => {
                        setShowValidation(true)
                        if (valid) {
                            props.next()
                        }
                    }}
                >
                    Next
                </Button>
                <Button variant="secondary" onClick={props.back} isDisabled={props.activeStep === props.steps?.[0]}>
                    Back
                </Button>
                <div className="pf-c-wizard__footer-cancel">
                    <Button variant="link">Cancel</Button>
                </div>
            </footer>
        </div>
    )
}

function FormWizardPageDrawer(props: {
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
