import {
    Alert,
    Button,
    DescriptionList,
    Drawer,
    DrawerContent,
    DrawerContentBody,
    DrawerPanelContent,
    Split,
    SplitItem,
    Wizard as PFWizard,
    WizardContext,
    WizardFooter,
    WizardStep,
} from '@patternfly/react-core'
import { ExclamationCircleIcon } from '@patternfly/react-icons'
import { klona } from 'klona/json'
import { Children, Fragment, isValidElement, ReactElement, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { EditMode } from '.'
import { DataContext } from './contexts/DataContext'
import { DisplayMode, DisplayModeContext } from './contexts/DisplayModeContext'
import { EditModeContext } from './contexts/EditModeContext'
import { ItemContext, useItem } from './contexts/ItemContext'
import { ShowValidationProvider, useSetShowValidation, useShowValidation } from './contexts/ShowValidationProvider'
import { StepHasInputsProvider } from './contexts/StepHasInputsProvider'
import { StepShowValidationProvider, useSetStepShowValidation, useStepShowValidation } from './contexts/StepShowValidationProvider'
import { StepValidationProvider, useStepHasValidationError } from './contexts/StepValidationProvider'
import { useHasValidationError, ValidationProvider } from './contexts/ValidationProvider'
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

export function Wizard(props: WizardProps & { showHeader?: boolean; showYaml?: boolean }) {
    const [data, setData] = useState(props.defaultData ? klona(props.defaultData) : {})
    const update = useCallback((newData) => setData((data: unknown) => klona(newData ?? data)), [])
    const [drawerExpanded, setDrawerExpanded] = useState<boolean>(false)
    useEffect(() => {
        if (props.showYaml !== undefined) {
            setDrawerExpanded(props.showYaml)
        }
    }, [props.showYaml])
    const displayMode = DisplayMode.Step
    const isYamlArray = useMemo(() => Array.isArray(props.defaultData), [props.defaultData])

    return (
        <EditModeContext.Provider value={props.editMode === undefined ? EditMode.Create : props.editMode}>
            <StepHasInputsProvider>
                <StepShowValidationProvider>
                    <StepValidationProvider>
                        <DisplayModeContext.Provider value={displayMode}>
                            <DataContext.Provider value={{ update }}>
                                <ItemContext.Provider value={data}>
                                    <ShowValidationProvider>
                                        <ValidationProvider>
                                            <Drawer isExpanded={drawerExpanded} isInline>
                                                <DrawerContent panelContent={<WizardDrawer yamlEditor={props.yamlEditor} />}>
                                                    <DrawerContentBody>
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
                                                    </DrawerContentBody>
                                                </DrawerContent>
                                            </Drawer>
                                        </ValidationProvider>
                                    </ShowValidationProvider>
                                </ItemContext.Provider>
                            </DataContext.Provider>
                        </DisplayModeContext.Provider>
                    </StepValidationProvider>
                </StepShowValidationProvider>
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

    const reviewStep = useMemo<WizardStep>(
        () => ({
            id: 'Review',
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

    const showValidation = useShowValidation()
    const stepHasValidationError = useStepHasValidationError()
    const stepShowValidation = useStepShowValidation()

    const steps: WizardStep[] = useMemo(() => {
        const steps = stepComponents.map(
            (component) =>
                ({
                    id: component.props?.id,
                    name: (
                        <Split hasGutter>
                            <SplitItem isFilled>{component.props?.label}</SplitItem>
                            {(showValidation || stepShowValidation[component.props?.id]) && stepHasValidationError[component.props?.id] && (
                                <SplitItem>
                                    <ExclamationCircleIcon color="var(--pf-global--danger-color--100)" />
                                </SplitItem>
                            )}
                        </Split>
                    ),
                    component: <Fragment key={component.props?.id}>{component}</Fragment>,
                } as WizardStep)
        )
        steps.push(reviewStep)
        return steps
    }, [reviewStep, showValidation, stepComponents, stepHasValidationError, stepShowValidation])

    const { title } = props
    return (
        <Fragment>
            <PFWizard
                navAriaLabel={`${title} steps`}
                mainAriaLabel={`${title} content`}
                steps={steps}
                footer={<MyFooter onSubmit={props.onSubmit} steps={steps} stepComponents={stepComponents} />}
                onClose={props.onCancel}
            />
        </Fragment>
    )
}

function MyFooter(props: { onSubmit: WizardSubmit; steps: WizardStep[]; stepComponents: ReactElement[] }) {
    const wizardContext = useContext(WizardContext)
    const { activeStep, onNext, onBack, onClose } = wizardContext

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
    const onSubmitClick = useCallback(() => {
        onSubmitClickHandler(data)
    }, [data, onSubmitClickHandler])

    const setShowValidation = useSetShowValidation()
    const showWizardValidation = useShowValidation()
    const wizardHasValidationError = useHasValidationError()

    const firstStep = props.steps[0]
    const lastStep = props.steps[props.steps.length - 1]

    const stepHasValidationError = useStepHasValidationError()
    const activeStepHasValidationError = activeStep.id ? stepHasValidationError[activeStep.id] : false
    const stepShowValidation = useStepShowValidation()
    const activeStepShowValidation = activeStep.id ? stepShowValidation[activeStep.id] : false

    const setStepShowValidation = useSetStepShowValidation()

    const onNextClick = useCallback(() => {
        const stepID = activeStep.id?.toString() ?? ''
        setStepShowValidation(stepID, true)
        if (!activeStepHasValidationError) {
            onNext()
        }
    }, [activeStep.id, activeStepHasValidationError, onNext, setStepShowValidation])

    useEffect(() => {
        if (wizardContext.activeStep.name === lastStep.name) {
            // We are on the review step - show validation for all steps
            setShowValidation(true)
        }
    }, [lastStep.name, setShowValidation, wizardContext.activeStep.name])

    if (wizardContext.activeStep.name === lastStep.name) {
        return (
            <div className="pf-u-box-shadow-sm-top">
                {wizardHasValidationError && wizardHasValidationError && (
                    <Alert title="Please fix validation errors" isInline variant="danger" />
                )}
                {submitError && <Alert title={submitError} isInline variant="danger" />}
                <WizardFooter>
                    <Button
                        onClick={onSubmitClick}
                        isDisabled={(wizardHasValidationError && showWizardValidation) || submitting}
                        isLoading={submitting}
                    >
                        {submitting ? 'Submitting' : 'Submit'}
                    </Button>
                    <Button onClick={onBack}>Back</Button>
                    <div className="pf-c-wizard__footer-cancel">
                        <Button variant="link" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </WizardFooter>
                <RenderHiddenSteps stepComponents={props.stepComponents} />
            </div>
        )
    }

    return (
        <div className="pf-u-box-shadow-sm-top">
            {activeStepHasValidationError && activeStepShowValidation && (
                <Alert title="Please fix validation errors" isInline variant="danger" />
            )}
            <WizardFooter>
                <Button
                    variant="primary"
                    type="submit"
                    onClick={onNextClick}
                    isDisabled={(activeStepHasValidationError && activeStepShowValidation) || submitting}
                >
                    Next
                </Button>
                <Button variant="secondary" onClick={onBack} isDisabled={firstStep.name === activeStep.name}>
                    Back
                </Button>
                <div className="pf-c-wizard__footer-cancel">
                    <Button variant="link" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </WizardFooter>
            <RenderHiddenSteps stepComponents={props.stepComponents} />
        </div>
    )
}

function RenderHiddenSteps(props: { stepComponents: ReactElement[] }) {
    const wizardContext = useContext(WizardContext)
    const { activeStep } = wizardContext
    return (
        <DisplayModeContext.Provider value={DisplayMode.StepsHidden}>
            <div style={{ display: 'none' }}>{props.stepComponents.filter((component) => component.props.id !== activeStep.id)}</div>
        </DisplayModeContext.Provider>
    )
}

function WizardDrawer(props: { yamlEditor?: () => ReactNode }) {
    const [yamlEditor] = useState(props.yamlEditor ?? undefined)
    return (
        <DrawerPanelContent isResizable={true} defaultSize="800px" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
            {yamlEditor}
        </DrawerPanelContent>
    )
}

// function getSteps(children: ReactNode | ReactNode[]) {
//     const childArray = Children.toArray(children)
//     let steps = childArray.filter((child) => isValidElement(child) && child.type === Step) as ReactElement[]
//     if (steps.length === 0) {
//         if (childArray.length === 1) {
//             const child = childArray[0]
//             if (isValidElement(child)) {
//                 steps = getSteps(child.props.children)
//             }
//         }
//     }
//     return steps
// }
