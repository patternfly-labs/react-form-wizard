import {
    Breadcrumb,
    BreadcrumbItem,
    Drawer,
    DrawerColorVariant,
    DrawerContent,
    DrawerContentBody,
    DrawerPanelContent,
    Flex,
    FlexItem,
    Page,
    PageSection,
    PageSectionTypes,
    Switch,
    Tab,
    Tabs,
    TabTitleText,
    Text,
    Title,
} from '@patternfly/react-core'
import Handlebars, { HelperOptions } from 'handlebars'
import { ReactNode, useState } from 'react'
import YAML from 'yaml'
import { FormWizardWizardView } from '.'
import { YamlHighlighter } from './components/YamlHighlighter'
import { FormWizardContext, InputEditMode, InputMode } from './contexts/FormWizardContext'
import { FormWizardItemContext } from './contexts/FormWizardItemContext'
import { FormWizard } from './FormWizard'

Handlebars.registerHelper('if_eq', function (arg1: string, arg2: string, options: HelperOptions) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this)
})

Handlebars.registerHelper('if_ne', function (arg1: string, arg2: string, options: HelperOptions) {
    return arg1 !== arg2 ? options.fn(this) : options.inverse(this)
})

export function FormWizardPage(props: {
    title: string
    description?: string
    children: ReactNode
    defaultData?: object
    template: string
    breadcrumb?: { label: string; to?: string }[]
}) {
    const [data, setData] = useState(props.defaultData ?? {})
    const [devMode, setDevMode] = useState(false)
    const [isForm, setIsForm] = useState(false)
    const [showValidation, setShowValidation] = useState(false)

    const [drawerExpanded, setDrawerExpanded] = useState(false)
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
                    <Flex alignItems={{ default: 'alignItemsFlexEnd' }} wrap="noWrap" style={{ flexWrap: 'nowrap' }}>
                        <FlexItem grow={{ default: 'grow' }}>
                            <Title headingLevel="h1">{props.title}</Title>
                            {props.description && <Text component="small">{props.description}</Text>}
                        </FlexItem>
                        <Flex alignItems={{ default: 'alignItemsFlexEnd' }} wrap="noWrap" style={{ flexWrap: 'nowrap', gap: 16 }}>
                            {process.env.NODE_ENV === 'development' && (
                                <Switch label="FORM" isChecked={isForm} onChange={() => setIsForm(!isForm)} />
                            )}
                            {process.env.NODE_ENV === 'development' && (
                                <Switch label="DEV" isChecked={devMode} onChange={() => setDevMode(!devMode)} />
                            )}
                            <Switch label="YAML" isChecked={drawerExpanded} onChange={() => setDrawerExpanded(!drawerExpanded)} />
                        </Flex>
                    </Flex>
                </PageSection>
            }
            groupProps={{ sticky: 'top' }}
        >
            {/* <Drawer isExpanded={drawerExpanded} isInline={drawerInline}> */}
            <Drawer isExpanded={drawerExpanded} isInline>
                <DrawerContent panelContent={<FormWizardPageDrawer data={data} template={props.template} devMode={devMode} />}>
                    <DrawerContentBody>
                        <PageSection
                            variant="light"
                            style={{ height: '100%' }}
                            type={mode === InputMode.Wizard ? PageSectionTypes.wizard : PageSectionTypes.default}
                            isWidthLimited
                        >
                            <FormWizardContext.Provider
                                value={{
                                    updateContext: () => setData(JSON.parse(JSON.stringify(data))),
                                    mode,
                                    editMode: InputEditMode.Create,
                                    showValidation,
                                    setShowValidation,
                                }}
                            >
                                <FormWizardItemContext.Provider value={data}>
                                    {mode === InputMode.Wizard ? (
                                        <FormWizardWizardView>{props.children}</FormWizardWizardView>
                                    ) : (
                                        <FormWizard>{props.children}</FormWizard>
                                    )}
                                </FormWizardItemContext.Provider>
                            </FormWizardContext.Provider>
                        </PageSection>
                    </DrawerContentBody>
                </DrawerContent>
            </Drawer>
        </Page>
    )
}

function FormWizardPageDrawer(props: { data: any; template: string; devMode: boolean }) {
    const [template] = useState(() => Handlebars.compile(props.template))
    const [activeKey, setActiveKey] = useState<number | string>(0)

    return (
        <DrawerPanelContent isResizable={true} colorVariant={DrawerColorVariant.light200} defaultSize="50%">
            {props.devMode ? (
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
                            <PageSection>
                                <YamlHighlighter yaml={template(props.data)}></YamlHighlighter>
                            </PageSection>
                        </Tab>
                        <Tab eventKey={2} title={<TabTitleText>Data</TabTitleText>}>
                            <PageSection>
                                <YamlHighlighter yaml={YAML.stringify(props.data)}></YamlHighlighter>
                            </PageSection>
                        </Tab>
                        <Tab eventKey={1} title={<TabTitleText>Template</TabTitleText>}>
                            <PageSection>
                                <YamlHighlighter yaml={props.template}></YamlHighlighter>
                            </PageSection>
                        </Tab>
                    </Tabs>
                </div>
            ) : (
                <PageSection>
                    <YamlHighlighter yaml={template(props.data)}></YamlHighlighter>
                </PageSection>
            )}
        </DrawerPanelContent>
    )
}
