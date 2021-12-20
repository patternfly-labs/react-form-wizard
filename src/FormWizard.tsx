import {
    ActionGroup,
    ActionList,
    ActionListGroup,
    ActionListItem,
    Alert,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    DescriptionList,
    Drawer,
    DrawerContent,
    DrawerContentBody,
    DrawerPanelContent,
    Flex,
    Form,
    Page,
    PageSection,
    PageSectionTypes,
    Split,
    SplitItem,
    Stack,
    Switch,
    Tab,
    Tabs,
    TabTitleText,
    Text,
    Title,
    Wizard,
    WizardContextConsumer,
    WizardFooter,
    WizardStep,
} from '@patternfly/react-core'
import { ExclamationCircleIcon } from '@patternfly/react-icons'
import Handlebars, { HelperOptions } from 'handlebars'
import { Children, Fragment, isValidElement, ReactNode, useCallback, useContext, useState } from 'react'
import YAML from 'yaml'
import { FormWizardStep } from '.'
import { YamlEditor, YamlToObject } from './components/YamlEditor'
import { FormWizardContext, InputEditMode, InputMode } from './contexts/FormWizardContext'
import { FormWizardItemContext } from './contexts/FormWizardItemContext'
import { FormWizardValidationContext } from './contexts/FormWizardValidationContext'
import './FormWizard.css'
import { isFormWizardHiddenProps, wizardInputHasValidationErrors } from './inputs/FormWizardInput'

Handlebars.registerHelper('if_eq', function (this: unknown, arg1: string, arg2: string, options: HelperOptions) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this)
})

Handlebars.registerHelper('if_ne', function (this: unknown, arg1: string, arg2: string, options: HelperOptions) {
    return arg1 !== arg2 ? options.fn(this) : options.inverse(this)
})

export type FormSubmit = (data: object) => Promise<void>
export type FormCancel = () => void

type FormWizardStep = WizardStep & { id: string; hasValidationErrors: boolean }

export function FormWizardPage(props: {
    title: string
    description?: string
    children: ReactNode
    defaultData?: object
    template?: string
    breadcrumb?: { label: string; to?: string }[]
    onSubmit?: FormSubmit // TODO make required
    onCancel?: FormCancel // TODO make required
}) {
    const [template] = useState(() => (props.template ? Handlebars.compile(props.template) : undefined))
    const [data, setData] = useState(props.defaultData ?? {})
    const [devMode, setDevMode] = useState(false)
    const [isForm, setIsForm] = useState(false)
    const [showValidation, setShowValidation] = useState(false)

    const [drawerExpanded, setDrawerExpanded] = useState(localStorage.getItem('yaml') === 'true')
    const toggleDrawerExpanded = useCallback(() => {
        setDrawerExpanded((drawerExpanded) => {
            localStorage.setItem('yaml', (!drawerExpanded).toString())
            return !drawerExpanded
        })
    }, [])

    const mode = isForm ? InputMode.Form : InputMode.Wizard
    return (
        <Page
            className="form-wizard"
            breadcrumb={
                props.breadcrumb && (
                    <Breadcrumb>
                        {props.breadcrumb.map((crumb) => (
                            <BreadcrumbItem key={crumb.label} to={crumb.to}>
                                {crumb.label}
                            </BreadcrumbItem>
                        ))}
                    </Breadcrumb>
                )
            }
            isBreadcrumbGrouped
            additionalGroupedContent={
                <PageSection variant="light">
                    <Flex alignItems={{ default: 'alignItemsCenter' }} wrap="noWrap" style={{ flexWrap: 'nowrap', gap: 16 }}>
                        <Title headingLevel="h1">{props.title}</Title>
                        <Switch id="yaml-switch" label="YAML" isChecked={drawerExpanded} onChange={() => toggleDrawerExpanded()} />
                        {process.env.NODE_ENV === 'development' && (
                            <Switch label="FORM" isChecked={isForm} onChange={() => setIsForm(!isForm)} />
                        )}
                        {process.env.NODE_ENV === 'development' && props.template && (
                            <Switch label="DEV" isChecked={devMode} onChange={() => setDevMode(!devMode)} />
                        )}
                    </Flex>
                    {props.description && <Text component="small">{props.description}</Text>}
                </PageSection>
            }
            groupProps={{ sticky: 'top' }}
        >
            {/* <Drawer isExpanded={drawerExpanded} isInline={drawerInline}> */}
            <FormWizardContext.Provider
                value={{
                    updateContext: (newData?: any) => setData(JSON.parse(JSON.stringify(newData ?? data)) as object),
                    mode,
                    editMode: InputEditMode.Create,
                    onSubmit: props.onSubmit,
                }}
            >
                <FormWizardValidationContext.Provider value={{ showValidation, setShowValidation }}>
                    <Drawer isExpanded={drawerExpanded} isInline>
                        <DrawerContent
                            panelContent={
                                <FormWizardPageDrawer data={data} template={template} templateString={props.template} devMode={devMode} />
                            }
                        >
                            <DrawerContentBody>
                                <PageSection
                                    variant="light"
                                    style={{ height: '100%' }}
                                    type={mode === InputMode.Wizard ? PageSectionTypes.wizard : PageSectionTypes.default}
                                    isWidthLimited
                                >
                                    <FormWizardItemContext.Provider value={data}>
                                        {mode === InputMode.Wizard ? (
                                            <FormWizardWizardMode template={template} data={data}>
                                                {props.children}
                                            </FormWizardWizardMode>
                                        ) : (
                                            <FormWizardFormMode>{props.children}</FormWizardFormMode>
                                        )}
                                    </FormWizardItemContext.Provider>
                                </PageSection>
                            </DrawerContentBody>
                        </DrawerContent>
                    </Drawer>
                </FormWizardValidationContext.Provider>
            </FormWizardContext.Provider>
        </Page>
    )
}

function FormWizardPageDrawer(props: { data: unknown; devMode: boolean; template?: HandlebarsTemplateDelegate; templateString?: string }) {
    const [activeKey, setActiveKey] = useState<number | string>(0)
    const formWizardContext = useContext(FormWizardContext)

    return (
        <Fragment>
            <DrawerPanelContent isResizable={true} defaultSize="800px" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
                {props.template && props.devMode ? (
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
                                <YamlEditor data={YamlToObject(props.template(props.data))} />
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
                            formWizardContext.updateContext(data)
                        }}
                    />
                    // </PageSection>
                )}
            </DrawerPanelContent>
        </Fragment>
    )
}

export function FormWizardFormMode(props: { children: ReactNode }) {
    return (
        <Form>
            {props.children}
            <ActionGroup>
                <Stack hasGutter style={{ width: '100%' }}>
                    {/* <Alert isInline variant="danger" title="Error">
                                                    Details
                                                </Alert> */}
                    <ActionList>
                        <ActionListGroup>
                            <ActionListItem>
                                <Button
                                    id="next"
                                    // onClick={() => {
                                    //     setShowFormErrors(true)
                                    //     if (!formHasErrors(formData)) {
                                    //         try {
                                    //             const result = formData.submit()
                                    //             if ((result as unknown) instanceof Promise) {
                                    //                 setSubmitText(formData.submittingText)
                                    //                 ;(result as unknown as Promise<void>).catch(
                                    //                     (err) => {
                                    //                         setSubmitError(err.message)
                                    //                         setSubmitText(formData.submitText)
                                    //                     }
                                    //                 )
                                    //             }
                                    //         } catch (err) {
                                    //             setSubmitError(err.message)
                                    //         }
                                    //     }
                                    // }}
                                    variant="primary"
                                    // isDisabled={
                                    //     (showFormErrors && formHasErrors(formData)) ||
                                    //     isSubmitting
                                    // }
                                    // isLoading={isSubmitting}
                                >
                                    Submit
                                </Button>
                            </ActionListItem>
                            <ActionListItem>
                                <Button
                                    id="cancel"
                                    variant="secondary"
                                    // onClick={formData.cancel}
                                    // isDisabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </ActionListItem>
                        </ActionListGroup>
                    </ActionList>
                </Stack>
            </ActionGroup>
        </Form>
    )
}

export function FormWizardWizardMode(props: { data: object; children: ReactNode; template?: HandlebarsTemplateDelegate }) {
    const steps: FormWizardStep[] = []
    const formWizardContext = useContext(FormWizardContext)
    const validationContext = useContext(FormWizardValidationContext)
    const item = useContext(FormWizardItemContext)
    const [showStepValidation, setShowStepValidation] = useState<Record<string, boolean | undefined>>({})

    let formHasValidationErrors = false
    Children.forEach(props.children, (child) => {
        if (!isValidElement(child)) return
        if (child.type !== FormWizardStep) return
        if (isFormWizardHiddenProps(child.props, item)) return

        const stepHasValidationErrors = wizardInputHasValidationErrors(child, item)

        let color: string | undefined = undefined
        if (stepHasValidationErrors) {
            if (validationContext.showValidation) {
                color = '#C9190B'
            }
            formHasValidationErrors = true
        }

        const label = (child.props as { label: ReactNode }).label
        if (label) {
            const childSteps: WizardStep[] = []
            Children.forEach(child.props.children as ReactNode, (grandchild) => {
                if (isValidElement(grandchild)) {
                    if (grandchild.type !== FormWizardStep) return

                    const childStepHasValidationErrors = wizardInputHasValidationErrors(grandchild.props, item)

                    let c: string | undefined = undefined
                    if (childStepHasValidationErrors) {
                        if (validationContext.showValidation) {
                            c = '#C9190B'
                        }
                    }

                    const title = grandchild.props.label
                    if (title) {
                        childSteps.push({
                            id: title,
                            name: (
                                <Split style={{ color: c, alignItems: 'baseline', columnGap: 8 }}>
                                    <SplitItem isFilled>{title}</SplitItem>
                                    {c && <ExclamationCircleIcon color="var(--pf-global--danger-color--100)" />}
                                </Split>
                            ),
                            component: grandchild,
                            hasValidationErrors: childStepHasValidationErrors,
                        } as FormWizardStep)
                    }
                }
            })

            if (childSteps.length) {
                steps.push({
                    id: label as string,
                    name: (
                        <Split style={{ color: color, alignItems: 'baseline', columnGap: 8 }}>
                            <SplitItem isFilled>{label}</SplitItem>
                            {color && <ExclamationCircleIcon color="var(--pf-global--danger-color--100)" />}
                        </Split>
                    ),
                    steps: childSteps,
                    hasValidationErrors: stepHasValidationErrors,
                })
            } else {
                steps.push({
                    id: label as string,
                    name: (
                        <Split style={{ color: color, alignItems: 'baseline', columnGap: 8 }}>
                            <SplitItem isFilled>{label}</SplitItem>
                            {color && <ExclamationCircleIcon color="var(--pf-global--danger-color--100)" />}
                        </Split>
                    ),
                    component: (
                        <FormWizardValidationContext.Provider
                            value={{
                                showValidation: showStepValidation[label as string] ?? false,
                                setShowValidation: () => {
                                    /**/
                                },
                            }}
                        >
                            {child}
                        </FormWizardValidationContext.Provider>
                    ),
                    hasValidationErrors: stepHasValidationErrors,
                })
            }
        }
    })

    steps.push({
        id: 'Review',
        name: 'Review',
        component: <FormWizardDetailsMode>{props.children}</FormWizardDetailsMode>,
        nextButtonText: 'Submit',
        enableNext: !formHasValidationErrors,
        hasValidationErrors: formHasValidationErrors,
    })

    const stepChange = useCallback(
        (step) => {
            if ((step as { name: string }).name === 'Review') {
                validationContext.setShowValidation(true)
            }
        },
        [validationContext]
    )

    const isSubmitting = false
    const Footer = (
        <WizardFooter>
            <WizardContextConsumer>
                {({ activeStep, onNext, onBack, onClose }) => {
                    return (
                        <Stack style={{ width: '100%' }}>
                            {validationContext.showValidation ||
                                (showStepValidation[activeStep.id as string] && (activeStep as FormWizardStep).hasValidationErrors && (
                                    <div className="footer-alert-container">
                                        <Alert isInline variant="danger" title="Please fix validation errors" className="footer-alert" />
                                    </div>
                                ))}
                            <ActionGroup>
                                <ActionList>
                                    <ActionListGroup>
                                        <Button
                                            variant="primary"
                                            onClick={() => {
                                                if ((activeStep as FormWizardStep).hasValidationErrors) {
                                                    setShowStepValidation({ ...showStepValidation, [activeStep.id as string]: true })
                                                    return
                                                }
                                                onNext()
                                            }}
                                            isDisabled={
                                                (validationContext.showValidation || showStepValidation[activeStep.id as string]) &&
                                                (activeStep as FormWizardStep).hasValidationErrors
                                            }
                                        >
                                            {(activeStep as FormWizardStep).nextButtonText ?? 'Next'}
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={onBack}
                                            isDisabled={activeStep.id === steps[0]?.id || isSubmitting}
                                        >
                                            Back
                                        </Button>
                                    </ActionListGroup>
                                    <ActionListGroup>
                                        <Button variant="link" onClick={onClose} isDisabled={isSubmitting}>
                                            Cancel
                                        </Button>
                                    </ActionListGroup>
                                </ActionList>
                            </ActionGroup>
                        </Stack>
                    )
                }}
            </WizardContextConsumer>
        </WizardFooter>
    )

    return (
        <Wizard
            // title="dd"
            // description="description"
            steps={steps}
            onNext={stepChange}
            onGoToStep={stepChange}
            onSave={() => {
                if (props.template) {
                    const data = props.template(props.data)
                    void formWizardContext.onSubmit?.(YAML.parse(data))
                } else {
                    void formWizardContext.onSubmit?.(props.data)
                }
            }}
            // backButtonText
            // cancelButtonText
            // nextButtonText
            footer={Footer}
        />
    )
}

export function FormWizardDetailsMode(props: { children: ReactNode }) {
    const formWizardContext = useContext(FormWizardContext)
    return (
        <FormWizardContext.Provider value={{ ...formWizardContext, ...{ mode: InputMode.Details } }}>
            <DescriptionList isHorizontal>{props.children}</DescriptionList>
        </FormWizardContext.Provider>
    )
}
