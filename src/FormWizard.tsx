import {
    ActionGroup,
    ActionList,
    ActionListGroup,
    ActionListItem,
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
import { FormWizardStep, WizardCancel, WizardSubmit } from '.'
import { YamlEditor, YamlToObject } from './components/YamlEditor'
import { DataContext, useData } from './contexts/DataContext'
import { ItemContext } from './contexts/ItemContext'
import { Mode, ModeContext } from './contexts/ModeContext'
import { ShowValidationProvider } from './contexts/ShowValidationProvider'
import './FormWizard.css'
import { isHidden, wizardInputHasValidationErrors } from './inputs/Input'

Handlebars.registerHelper('if_eq', function (this: unknown, arg1: string, arg2: string, options: HelperOptions) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this)
})

Handlebars.registerHelper('if_ne', function (this: unknown, arg1: string, arg2: string, options: HelperOptions) {
    return arg1 !== arg2 ? options.fn(this) : options.inverse(this)
})

type FormWizardStep = WizardStep & { id: string; hasValidationErrors: boolean }

export function FormWizardPage(props: {
    title: string
    description?: string
    children: ReactNode
    defaultData?: object
    template?: string
    yamlToDataTemplate?: string
    breadcrumb?: { label: string; to?: string }[]
    onSubmit?: WizardSubmit // TODO make required
    onCancel?: WizardCancel // TODO make required
    yaml?: boolean
}) {
    const [template] = useState(() => (props.template ? Handlebars.compile(props.template) : undefined))
    const [template2] = useState(() => (props.yamlToDataTemplate ? Handlebars.compile(props.yamlToDataTemplate) : undefined))
    const [data, setData] = useState(props.defaultData ?? {})
    const [devMode, setDevMode] = useState(false)
    const [isForm] = useState(false)
    // const [showValidation, setShowValidation] = useState(false)

    const [drawerExpanded, setDrawerExpanded] = useState(props.yaml !== false && localStorage.getItem('yaml') === 'true')
    const toggleDrawerExpanded = useCallback(() => {
        setDrawerExpanded((drawerExpanded) => {
            localStorage.setItem('yaml', (!drawerExpanded).toString())
            return !drawerExpanded
        })
    }, [])

    const mode = isForm ? Mode.Form : Mode.Wizard
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
                        {props.yaml !== false && (
                            <Switch id="yaml-switch" label="YAML" isChecked={drawerExpanded} onChange={() => toggleDrawerExpanded()} />
                        )}
                        {/* {process.env.NODE_ENV === 'development' && (
                            <Switch label="FORM" isChecked={isForm} onChange={() => setIsForm(!isForm)} />
                        )} */}
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
            <DataContext.Provider value={{ update: (newData?: any) => setData(JSON.parse(JSON.stringify(newData ?? data)) as object) }}>
                <ModeContext.Provider value={mode}>
                    <ShowValidationProvider>
                        <Drawer isExpanded={drawerExpanded} isInline>
                            <DrawerContent
                                panelContent={
                                    <FormWizardPageDrawer
                                        data={data}
                                        template={template}
                                        template2={template2}
                                        templateString={props.template}
                                        devMode={devMode}
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
                                            {mode === Mode.Wizard ? (
                                                <FormWizardWizardMode
                                                    template={template}
                                                    data={data}
                                                    onSubmit={props.onSubmit}
                                                    onCancel={props.onCancel}
                                                >
                                                    {props.children}
                                                </FormWizardWizardMode>
                                            ) : (
                                                <FormWizardFormMode>{props.children}</FormWizardFormMode>
                                            )}
                                        </ItemContext.Provider>
                                    </PageSection>
                                </DrawerContentBody>
                            </DrawerContent>
                        </Drawer>
                    </ShowValidationProvider>
                </ModeContext.Provider>
            </DataContext.Provider>
        </Page>
    )
}

function FormWizardPageDrawer(props: {
    data: unknown
    devMode: boolean
    template?: HandlebarsTemplateDelegate
    template2?: HandlebarsTemplateDelegate
    templateString?: string
}) {
    const [activeKey, setActiveKey] = useState<number | string>(0)
    const { update } = useData()
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

export function FormWizardWizardMode(props: {
    data: object
    children: ReactNode
    template?: HandlebarsTemplateDelegate
    onSubmit?: WizardSubmit
    onCancel?: WizardCancel
}) {
    const steps: FormWizardStep[] = []
    const item = useContext(ItemContext)
    const [showStepValidation, setShowStepValidation] = useState<Record<string, boolean | undefined>>({})

    let formHasValidationErrors = false
    Children.forEach(props.children, (child) => {
        if (!isValidElement(child)) return
        if (child.type !== FormWizardStep) return
        if (isHidden(child, item)) return

        const stepHasValidationErrors = wizardInputHasValidationErrors(child, item)

        if (stepHasValidationErrors) {
            formHasValidationErrors = true
        }

        const label = (child.props as { label: ReactNode }).label
        if (label) {
            const childSteps: WizardStep[] = []
            Children.forEach(child.props.children as ReactNode, (grandchild) => {
                if (isValidElement(grandchild)) {
                    if (grandchild.type !== FormWizardStep) return

                    const childStepHasValidationErrors = wizardInputHasValidationErrors(grandchild.props, item)

                    const title = grandchild.props.label
                    if (title) {
                        childSteps.push({
                            id: title,
                            name: (
                                <Split style={{ alignItems: 'baseline', columnGap: 8 }}>
                                    <SplitItem isFilled>{title}</SplitItem>
                                    <ExclamationCircleIcon color="var(--pf-global--danger-color--100)" />
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
                        <Split style={{ alignItems: 'baseline', columnGap: 8 }}>
                            <SplitItem isFilled>{label}</SplitItem>
                        </Split>
                    ),
                    steps: childSteps,
                    hasValidationErrors: stepHasValidationErrors,
                })
            } else {
                steps.push({
                    id: label as string,
                    name: (
                        <Split style={{ alignItems: 'baseline', columnGap: 8 }}>
                            <SplitItem isFilled>{label}</SplitItem>
                        </Split>
                    ),
                    component: <ShowValidationProvider>{child}</ShowValidationProvider>,
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

    const stepChange = useCallback((step) => {
        if ((step as { name: string }).name === 'Review') {
            // validationContext.setShowValidation(true)
        }
    }, [])

    const isSubmitting = false
    const Footer = (
        <WizardFooter>
            <WizardContextConsumer>
                {({ activeStep, onNext, onBack, onClose }) => {
                    return (
                        <Stack style={{ width: '100%' }}>
                            {/* {validationContext.showValidation ||
                                (showStepValidation[activeStep.id as string] && (activeStep as FormWizardStep).hasValidationErrors && (
                                    <div className="footer-alert-container">
                                        <Alert isInline variant="danger" title="Please fix validation errors" className="footer-alert" />
                                    </div>
                                ))} */}
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
                                            // isDisabled={
                                            //     (validationContext.showValidation || showStepValidation[activeStep.id as string]) &&
                                            //     (activeStep as FormWizardStep).hasValidationErrors
                                            // }
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
                    void props.onSubmit?.(YAML.parse(data))
                } else {
                    void props.onSubmit?.(props.data)
                }
            }}
            // backButtonText
            // cancelButtonText
            // nextButtonText
            footer={Footer}
            onClose={() => props.onCancel?.()}
        />
    )
}

export function FormWizardDetailsMode(props: { children: ReactNode }) {
    return (
        <ModeContext.Provider value={Mode.Details}>
            <DescriptionList isHorizontal>{props.children}</DescriptionList>
        </ModeContext.Provider>
    )
}
