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
    FormAlert,
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
    WizardStep,
} from '@patternfly/react-core'
import Handlebars, { HelperOptions } from 'handlebars'
import { Children, Fragment, isValidElement, ReactNode, useCallback, useContext, useState } from 'react'
import YAML from 'yaml'
import { FormWizardStep } from '.'
import { YamlEditor, YamlToObject } from './components/YamlEditor'
import { FormWizardContext, InputEditMode, InputMode } from './contexts/FormWizardContext'
import { FormWizardItemContext } from './contexts/FormWizardItemContext'
import { hasValidationErrorsProps, InputCommonProps, isFormWizardHiddenProps } from './inputs/FormWizardInput'

Handlebars.registerHelper('if_eq', function (this: unknown, arg1: string, arg2: string, options: HelperOptions) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this)
})

Handlebars.registerHelper('if_ne', function (this: unknown, arg1: string, arg2: string, options: HelperOptions) {
    return arg1 !== arg2 ? options.fn(this) : options.inverse(this)
})

export type FormSubmit = (data: object) => Promise<void>

export function FormWizardPage(props: {
    title: string
    description?: string
    children: ReactNode
    defaultData?: object
    template?: string
    breadcrumb?: { label: string; to?: string }[]
    onSubmit?: FormSubmit
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
                    showValidation,
                    setShowValidation,
                    onSubmit: props.onSubmit,
                }}
            >
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
    const steps: WizardStep[] = []
    const formWizardContext = useContext(FormWizardContext)
    const item = useContext(FormWizardItemContext)

    let formHasValidationErrors = false
    Children.forEach(props.children, (child) => {
        if (!isValidElement(child)) return
        if (child.type !== FormWizardStep) return
        if (isFormWizardHiddenProps(child.props, item)) return

        let color: string | undefined = undefined
        if (hasValidationErrorsProps(child.props as InputCommonProps, item)) {
            if (formWizardContext.showValidation) {
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

                    let c: string | undefined = undefined
                    if (hasValidationErrorsProps(grandchild.props as InputCommonProps, item)) {
                        if (formWizardContext.showValidation) {
                            c = '#C9190B'
                        }
                    }

                    const title = grandchild.props.label
                    if (title) {
                        childSteps.push({
                            name: (
                                <Split style={{ color: c }}>
                                    <SplitItem>{title}</SplitItem>
                                </Split>
                            ),
                            component: grandchild,
                        })
                    }
                }
            })

            if (childSteps.length) {
                steps.push({
                    name: (
                        <Split style={{ color: color }}>
                            <SplitItem>{label}</SplitItem>
                        </Split>
                    ),
                    steps: childSteps,
                })
            } else {
                steps.push({
                    name: (
                        <Split style={{ color: color }}>
                            <SplitItem>{label}</SplitItem>
                        </Split>
                    ),
                    component: child,
                })
            }
        }
    })

    if (formHasValidationErrors) {
        steps.push({
            name: 'Summary',
            component: (
                <Stack hasGutter>
                    <FormAlert style={{ paddingBottom: 16 }}>
                        <Alert variant="danger" title="Fix validation errors." isInline isPlain />
                    </FormAlert>
                    <FormWizardDetailsMode>{props.children}</FormWizardDetailsMode>
                </Stack>
            ),
            nextButtonText: 'Submit',
            enableNext: false,
        })
    } else {
        steps.push({
            name: 'Summary',
            component: <FormWizardDetailsMode>{props.children}</FormWizardDetailsMode>,
            nextButtonText: 'Submit',
        })
    }

    const stepChange = useCallback(
        (step) => {
            if ((step as { name: string }).name === 'Summary') {
                formWizardContext.setShowValidation(true)
            }
        },
        [formWizardContext]
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
