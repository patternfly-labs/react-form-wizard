import {
    Alert,
    Button,
    DescriptionList,
    Drawer,
    DrawerContent,
    DrawerContentBody,
    DrawerPanelContent,
    Form,
    Split,
    SplitItem,
    Stack,
    Wizard as PFWizard,
    WizardContext,
    WizardFooter,
    WizardStep,
} from '@patternfly/react-core'
import { ExclamationCircleIcon } from '@patternfly/react-icons'
import { klona } from 'klona/json'
import {
    Children,
    Fragment,
    isValidElement,
    ReactElement,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from 'react'
import { EditMode } from '.'
import { onSubmit } from '../wizards/common/utils'
import { DataContext } from './contexts/DataContext'
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

export interface WizardProps {
    title: string
    description?: string
    children: ReactNode
    defaultData?: object
    onSubmit: WizardSubmit
    onCancel: WizardCancel
    hasButtons?: boolean
    editMode?: EditMode
    yamlEditor?: () => ReactNode
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
    const [data, setData] = useState(props.defaultData ? klona(props.defaultData) : {})
    const update = useCallback((newData) => setData((data: unknown) => klona(newData ?? data)), [])
    const [drawerExpanded, setDrawerExpanded] = useState<boolean>(false)
    useEffect(() => {
        if (props.showYaml !== undefined) {
            setDrawerExpanded(props.showYaml)
        }
    }, [props.showYaml])
    const displayMode = DisplayMode.Wizard
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
                                            <DrawerContent panelContent={<WizardPageDrawer yamlEditor={props.yamlEditor} />}>
                                                <DrawerContentBody>
                                                    <section className="pf-c-page__main-wizard" style={{ height: '100%' }}>
                                                        {/* <PageSection variant="light" style={{ height: '100%' }} type="wizard" isWidthLimited> */}
                                                        <ItemContext.Provider value={data}>
                                                            <WizardInternal
                                                                title={props.title}
                                                                onSubmit={props.onSubmit}
                                                                onCancel={props.onCancel}
                                                                hasButtons={props.hasButtons}
                                                                isYamlArray={isYamlArray}
                                                            >
                                                                {props.children}
                                                            </WizardInternal>
                                                        </ItemContext.Provider>
                                                        {/* </PageSection> */}
                                                    </section>
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
    title: string
    children: ReactNode
    onSubmit: WizardSubmit
    onCancel: WizardCancel
    hasButtons?: boolean
    isYamlArray: boolean
}) {
    const stepComponents = useMemo(
        () => Children.toArray(props.children).filter((child) => isValidElement(child) && child.type === Step) as ReactElement[],
        [props.children]
    )

    const reviewStep = useMemo(
        () => ({
            name: 'Review',
            component: (
                <Step label="Review" id="review-step">
                    <DescriptionList isHorizontal isCompact style={{ paddingLeft: 16, paddingBottom: 16, paddingRight: 16 }}>
                        <DisplayModeContext.Provider value={DisplayMode.Details}>{props.children}</DisplayModeContext.Provider>
                    </DescriptionList>
                </Step>
            ),
        }),
        [props.children]
    )

    const steps: WizardStep[] = useMemo(() => {
        const steps = stepComponents.map((stepComponent) => ({
            name: stepComponent.props?.label,
            component: (
                <Form>
                    <HasInputsProvider key={stepComponent.props.id}>
                        <ShowValidationProvider>
                            <ValidationProvider>{stepComponent}</ValidationProvider>
                        </ShowValidationProvider>
                    </HasInputsProvider>
                </Form>
            ),
        }))
        steps.push(reviewStep)
        return steps
    }, [reviewStep, stepComponents])

    // const setShowValidation = useSetShowValidation()
    // useLayoutEffect(() => {
    //     if (activeStep.props.id === 'review-step') {
    //         setShowValidation(true)
    //     }
    // }, [activeStep, setShowValidation])

    const setShowValidation = useSetShowValidation()
    useLayoutEffect(() => {
        //     if (activeStep.props.id === 'review-step') {
        setShowValidation(true)
        //     }
    }, [setShowValidation])

    const { title } = props
    return (
        <PFWizard
            navAriaLabel={`${title} steps`}
            mainAriaLabel={`${title} content`}
            steps={steps}
            footer={<MyFooter onSubmit={onSubmit} steps={steps} />}
            onClose={props.onCancel}
        />
    )
}

function MyFooter(props: { onSubmit: (data: object) => Promise<string>; steps: WizardStep[] }) {
    const wizardContext = useContext(WizardContext)
    const { activeStep, goToStepByName, goToStepById, onNext, onBack, onClose } = wizardContext

    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')

    const { onSubmit } = props
    const onSubmitClickHandler = useCallback(
        (data: object) => {
            async function asyncSubmit() {
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
            }
            void asyncSubmit()
        },
        [onSubmit]
    )
    const data = useItem()
    const onSubmitClick = useCallback(() => onSubmitClickHandler(data), [data, onSubmitClickHandler])

    const setShowValidation = useSetShowValidation()
    const showWizardValidation = useShowValidation()
    const wizardHasValidationError = useHasValidationError()

    const firstStep = props.steps[0]
    const lastStep = props.steps[props.steps.length - 1]

    const stepHasValidationError = useStepHasValidationError()
    const activeStepHasValidationError = activeStep.id ? stepHasValidationError[activeStep.id] : false

    const onNextClick = useCallback(() => {
        // showValidation for this step
        if (validStep) {
            onNext()
        }
    }, [onNext])

    if (wizardContext.activeStep.name === lastStep.name) {
        // We are on the review step - show validation for all steps
        setShowValidation(true)
        return (
            <WizardFooter>
                <Button
                    onClick={onSubmitClick}
                    isDisabled={(wizardHasValidationError && showWizardValidation) || submitting}
                    isLoading={submitting}
                >
                    {submitting ? 'Submitting' : 'Submit'}
                </Button>
                <Button onClick={onBack}>Back</Button>
                <Button variant="link" onClick={onClose}>
                    Cancel
                </Button>
            </WizardFooter>
        )
    }

    return (
        <WizardFooter>
            <Stack hasGutter>
                {wizardHasValidationError && showWizardValidation && (
                    <Alert title="Please fix validation errors" isInline variant="danger" isPlain />
                )}
                {submitError && <Alert title={submitError} isInline variant="danger" isPlain />}
                <Split hasGutter>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={onNextClick}
                        isDisabled={(activeStepHasValidationError && showWizardValidation) || submitting}
                    >
                        Next
                    </Button>
                    <Button variant="secondary" onClick={onBack} isDisabled={firstStep.name === activeStep.name}>
                        Back
                    </Button>
                    <Button variant="link" onClick={onClose}>
                        Cancel
                    </Button>
                </Split>
            </Stack>
        </WizardFooter>
    )
}

function WizardInternalOld(props: {
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
            <button aria-label="Wizard Header Toggle" className="pf-c-wizard__toggle" aria-expanded="false">
                <span className="pf-c-wizard__toggle-list">
                    <span className="pf-c-wizard__toggle-list-item">
                        <span className="pf-c-wizard__toggle-num">{steps.indexOf(activeStep) + 1}</span>
                        {activeStep.props?.label}
                        <i className="fas fa-angle-right pf-c-wizard__toggle-separator" aria-hidden="true"></i>
                    </span>
                    {/* <span className="pf-c-wizard__toggle-list-item">Substep B</span> */}
                </span>
                <span className="pf-c-wizard__toggle-icon">
                    <i className="fas fa-caret-down" aria-hidden="true"></i>
                </span>
            </button>
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
                                void onSubmit2(item)
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

function WizardPageDrawer(props: { yamlEditor?: () => ReactNode }) {
    const [yamlEditor] = useState(props.yamlEditor ?? undefined)
    return (
        <DrawerPanelContent isResizable={true} defaultSize="800px" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
            {yamlEditor}
        </DrawerPanelContent>
    )
}
