import {
    Card,
    CardBody,
    CardTitle,
    Checkbox,
    Flex,
    FlexItem,
    Grid,
    GridItem,
    gridSpans,
    InputGroup,
    Label,
    LabelGroup,
    Masthead,
    MastheadBrand,
    MastheadContent,
    MastheadMain,
    MastheadToggle,
    Nav,
    NavItem,
    NavList,
    Page,
    PageSection,
    PageSidebar,
    PageToggleButton,
    Select,
    SelectOption,
    SelectVariant,
    Split,
    SplitItem,
    Stack,
    Text,
    TextInput,
    Title,
} from '@patternfly/react-core'
import { BarsIcon, GithubIcon } from '@patternfly/react-icons'
import useResizeObserver from '@react-hook/resize-observer'
import { Children, ReactNode, useLayoutEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, useHistory, useLocation } from 'react-router-dom'
import { ClearInputButton } from '../src/components/ClearInputButton'
import { AnsibleExample } from './Ansible/AnsibleExample'
import { ApplicationExample } from './Application/ApplicationExample'
import { AppExample } from './AppWizard/AppExample'
import { ClusterForm } from './Cluster/ClusterForm'
import { CredentialsExample } from './Credentials/CredentialsExample'
import { HomeWizard } from './Home/HomeWizard'
import { InputsWizard } from './Inputs/InputsWizard'
import { PlacementExample } from './Placement/PlacementExample'
import { PolicyExample } from './Policy/PolicyExample'
import { PolicySetExample } from './PolicySet/PolicySetExample'
import { RosaExample } from './ROSA/RosaExample'
import { RouteE } from './Routes'

enum StateE {
    prototype = 'prototype',
    alpha = 'alpha',
    beta = 'beta',
    production = 'production',
}

function stateValue(state?: StateE) {
    switch (state) {
        case StateE.beta:
            return 1
        case StateE.alpha:
            return 2
        case StateE.prototype:
            return 3
    }
    return 0
}

enum SortE {
    name = 'name',
    quality = 'quality',
}

interface IWizard {
    shortName: string
    name: string
    description?: string
    route: RouteE
    state?: StateE
    labels?: string[]
}

const wizards: IWizard[] = [
    {
        shortName: 'Ansible',
        name: 'Ansible automation',
        route: RouteE.Ansible,
        description: 'Multi-Cluster Engine uses ansible to run ansible jobs during cluster provisioning and upgrade.',
        labels: ['MCE'],
        state: StateE.beta,
    },
    {
        shortName: 'Application',
        name: 'Application',
        route: RouteE.Application,
        description: 'Advanced Cluster Management configures applications for deployment to clusters managed by ACM.',
        labels: ['ACM'],
        state: StateE.alpha,
    },
    {
        shortName: 'Cluster',
        name: 'Cluster',
        route: RouteE.Cluster,
        state: StateE.prototype,
        description:
            'Multi-Cluster Engine creates clusters on cloud providers. This is an early prototype of a possible cluster wizard flow.',
        labels: ['MCE'],
    },
    {
        shortName: 'Credentials',
        name: 'Credentials',
        route: RouteE.Credentials,
        description:
            'Multi-Cluster Engine uses credentials to provision clusters on cloud providers. Credentials are also used for integrations such as automation using Ansible.',
        labels: ['MCE'],
        state: StateE.alpha,
    },
    // {
    //     shortName: 'Placement',
    //     name: 'Placement',
    //     route: RouteE.Placement,
    //     description:
    //         'Advanced Cluster Management has placement custom resources to control the placement of various resources on managed clusters. This is an early prototype of common wizard functionality for handling placement.',
    //     labels: ['ACM'],
    //     state: StateE.prototype,
    // },
    {
        shortName: 'Policy',
        name: 'Policy',
        route: RouteE.Policy,
        description:
            'Advanced Cluster Management uses policies to generate reports and validate a cluster compliance based on specified security standards, categories, and controls.',
        labels: ['ACM'],
        state: StateE.alpha,
    },
    {
        shortName: 'Policy Set',
        name: 'Policy Set',
        route: RouteE.PolicySet,
        description: 'Advanced Cluster Management groups policies in policy sets.',
        labels: ['ACM'],
        state: StateE.alpha,
    },
    {
        shortName: 'ROSA',
        name: 'ROSA',
        route: RouteE.ROSA,
        description:
            "Red Hat OpenShift Service on AWS provides a model that allows Red Hat to deploy clusters into a customer's existing Amazon Web Service (AWS) account.",
        state: StateE.prototype,
    },
]

export default function Demo() {
    return (
        <BrowserRouter>
            <Page
                header={<DemoHeader />}
                sidebar={<DemoSidebar />}
                isManagedSidebar
                defaultManagedSidebarIsOpen={true}
                style={{ height: '100vh' }}
            >
                <DemoRouter />
            </Page>
        </BrowserRouter>
    )
}
export function DemoRouter(): JSX.Element {
    const location = useLocation()
    switch (location.search) {
        case RouteE.Ansible:
            return <AnsibleExample />
        case RouteE.Application:
            return <ApplicationExample />
        case RouteE.App:
            return <AppExample />
        case RouteE.Cluster:
            return <ClusterForm />
        case RouteE.Credentials:
            return <CredentialsExample />
        case RouteE.Placement:
            return <PlacementExample />
        case RouteE.Policy:
            return <PolicyExample />
        case RouteE.PolicySet:
            return <PolicySetExample />
        case RouteE.ROSA:
            return <RosaExample />
        case RouteE.Inputs:
            return <InputsWizard />
        case RouteE.Wizards:
            return <ExampleWizards />
        default:
            return <HomeWizard />
    }
}

function ExampleWizards() {
    const history = useHistory()
    const [labelFilter, setLabelFilter] = useState<string[]>([])
    const [qualityFilter, setQualityFilter] = useState<string[]>([])
    const [sort, setSort] = useState<SortE>(SortE.name)
    const [sortOpen, setSortOpen] = useState(false)
    const [search, setSearch] = useState('')

    return (
        <Page
            additionalGroupedContent={
                <PageSection variant="light">
                    <Stack hasGutter>
                        <Stack>
                            <Title headingLevel="h2">Example Wizards</Title>
                            <Text>
                                Example wizards not only show what can be done with the framework but also serve as a testbed for automated
                                testing.
                            </Text>
                        </Stack>
                    </Stack>
                </PageSection>
            }
            groupProps={{ sticky: 'top' }}
        >
            <PageSection isWidthLimited variant="light">
                <Stack hasGutter>
                    <Split hasGutter>
                        <SplitItem style={{ paddingLeft: 8, paddingRight: 32, paddingTop: 64 }}>
                            <Flex direction={{ default: 'column' }} style={{ gap: 24 }}>
                                <Flex direction={{ default: 'column' }}>
                                    <Title headingLevel="h6">Quality</Title>
                                    <Flex direction={{ default: 'column' }} style={{ paddingLeft: 8 }}>
                                        {['Production', 'Beta', 'Alpha', 'Prototype'].map((quality) => (
                                            <Checkbox
                                                key={quality}
                                                id={quality}
                                                label={quality}
                                                isChecked={qualityFilter.includes(quality.toLowerCase())}
                                                onChange={(checked) => {
                                                    if (checked) qualityFilter.push(quality.toLowerCase())
                                                    else qualityFilter.splice(qualityFilter.indexOf(quality.toLowerCase()), 1)
                                                    setQualityFilter([...qualityFilter])
                                                }}
                                            />
                                        ))}
                                    </Flex>
                                </Flex>
                                <Flex direction={{ default: 'column' }}>
                                    <Title headingLevel="h4">Labels</Title>
                                    <Flex direction={{ default: 'column' }} style={{ paddingLeft: 8 }}>
                                        {wizards
                                            .reduce((labels, wizard) => {
                                                for (const label of wizard.labels ?? []) {
                                                    if (!labels.includes(label)) labels.push(label)
                                                }
                                                return labels
                                            }, [] as string[])
                                            .sort()
                                            .map((label) => (
                                                <Checkbox
                                                    key={label}
                                                    id={label}
                                                    label={label}
                                                    isChecked={labelFilter.includes(label)}
                                                    onChange={(checked) => {
                                                        if (checked) labelFilter.push(label)
                                                        else labelFilter.splice(labelFilter.indexOf(label), 1)
                                                        setLabelFilter([...labelFilter])
                                                    }}
                                                />
                                            ))}
                                    </Flex>
                                </Flex>
                            </Flex>
                        </SplitItem>
                        <SplitItem isFilled>
                            <Flex style={{ paddingBottom: 16 }}>
                                <FlexItem grow={{ default: 'grow' }}>
                                    <InputGroup>
                                        <TextInput placeholder="Search" value={search} onChange={setSearch} />
                                        {search !== '' && <ClearInputButton onClick={() => setSearch('')} />}
                                    </InputGroup>
                                </FlexItem>
                                <FlexItem>
                                    <Select
                                        variant={SelectVariant.single}
                                        placeholder="Sort by"
                                        isOpen={sortOpen}
                                        onToggle={setSortOpen}
                                        onSelect={(_, value) => {
                                            setSort(value as SortE)
                                            setSortOpen(false)
                                        }}
                                        selections={sort}
                                    >
                                        <SelectOption value={SortE.name}>Sort by Name</SelectOption>
                                        <SelectOption value={SortE.quality}>Sort by Quality</SelectOption>
                                    </Select>
                                </FlexItem>
                            </Flex>
                            <Masonry size={400}>
                                {wizards
                                    .filter((wizard) => {
                                        if (labelFilter.length == 0) return true
                                        for (const filterLabel of labelFilter) {
                                            if (wizard.labels?.includes(filterLabel)) return true
                                        }
                                        return false
                                    })
                                    .filter((wizard) => {
                                        if (qualityFilter.length == 0) return true
                                        for (const quality of qualityFilter) {
                                            if (wizard.state === quality) return true
                                        }
                                        return false
                                    })
                                    .filter((wizard) => {
                                        if (!search) return true
                                        if (wizard.name.toLowerCase().includes(search.toLowerCase())) return true
                                        if (wizard.description?.toLowerCase().includes(search.toLowerCase())) return true
                                        return false
                                    })
                                    .sort((lhs, rhs) => {
                                        switch (sort) {
                                            case SortE.quality:
                                                return stateValue(lhs.state) > stateValue(rhs.state) ? 1 : -1
                                            default:
                                                return lhs.name > rhs.name ? 1 : -1
                                        }
                                    })
                                    .map((wizard, index) => (
                                        <Card
                                            key={index}
                                            onClick={() => {
                                                history.push(wizard.route)
                                            }}
                                            isSelectable
                                            isRounded
                                            isFlat
                                            style={{ transition: 'box-shadow 400ms' }}
                                        >
                                            <CardTitle>
                                                <Split>
                                                    <SplitItem isFilled style={{ fontSize: 'larger' }}>
                                                        {wizard.name}
                                                    </SplitItem>
                                                    <SplitItem>
                                                        {wizard.state !== StateE.production && (
                                                            <div
                                                                style={{
                                                                    border: '1px solid var(--pf-global--palette--gold-200)',
                                                                    backgroundColor: 'var(--pf-global--palette--gold-50)',
                                                                    color: 'var(--pf-global--palette--gold-600)',
                                                                    paddingLeft: 4,
                                                                    paddingRight: 4,
                                                                    fontSize: 'small',
                                                                    borderRadius: 4,
                                                                    opacity: 0.6,
                                                                }}
                                                            >
                                                                {wizard.state}
                                                            </div>
                                                        )}
                                                    </SplitItem>
                                                </Split>
                                            </CardTitle>
                                            {(wizard.description || wizard.labels) && (
                                                <CardBody>
                                                    <Stack hasGutter>
                                                        {wizard.description && <div>{wizard.description}</div>}
                                                        {wizard.labels && wizard.labels.length && (
                                                            <LabelGroup isCompact>
                                                                {wizard.labels.map((label) => (
                                                                    <Label isCompact color="blue" key={label}>
                                                                        {label}
                                                                    </Label>
                                                                ))}
                                                            </LabelGroup>
                                                        )}
                                                    </Stack>
                                                </CardBody>
                                            )}
                                        </Card>
                                    ))}
                            </Masonry>
                        </SplitItem>
                    </Split>
                </Stack>
            </PageSection>
        </Page>
    )
}

function DemoHeader() {
    return (
        <Masthead>
            <MastheadToggle>
                <PageToggleButton variant="plain" aria-label="Global navigation">
                    <BarsIcon />
                </PageToggleButton>
            </MastheadToggle>
            <MastheadMain>
                <MastheadBrand>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'start' }}>
                        <svg width="45" height="40.5" viewBox="0 0 30 27" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="prefix__a">
                                    <stop stopColor="#7DC3E8" stopOpacity=".6" offset="0%" />
                                    <stop stopColor="#007BBA" offset="100%" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M29.305 13.607L14.803.092 14.696 0l-.136.092L.087 13.607 0 13.69l.068.092 5.756 7.789.058.074h.097l4.3-.925 4.281 5.716.117.158.116-.158 4.3-5.753 4.29.925h.098l.058-.074 5.766-7.789.068-.092-.068-.046zm-8.31 1.563l.506 1.082-2.718 3.626-1.204-.259 3.417-4.449zm.166-1.425l-5.077-10.97L23.22 11.1l-2.058 2.645zm1.165 2.655l.048-.065v-.074l-.815-1.757 2.553-3.404h.058l-.068-.083-5.145-6.004 9.455 8.806L26.47 16.4l-3.32 4.486-3.6-.786 2.776-3.7zm-10.057 3.848l2.398 3.127.126.166.117-.166 2.213-3.127 1.194.268-3.62 4.847-3.622-4.847 1.194-.268zm.602-.425l1.825-16.937 1.806 16.937-1.748 2.47-1.883-2.47zm.97-16.475l-1.717 15.466-3.388-4.393 5.106-11.073zM6.175 11.1l7.144-8.325-5.087 10.97L6.174 11.1zm4.26-6.105L5.29 10.998l-.068.102.068.083 2.592 3.367-.815 1.758v.138L9.794 20.1l-3.591.786L.97 13.773l9.464-8.778zm1.38 14.652l-1.204.259L7.9 16.252l.495-1.082 3.417 4.477zM15.53 3.348l5.115 11.1-3.378 4.394-1.737-15.494z"
                                fill="url(#prefix__a)"
                            />
                        </svg>
                        <div style={{ color: 'white' }}>
                            <Title headingLevel="h4" style={{ fontWeight: 'bold', lineHeight: 1.3 }}>
                                PatternFly Labs
                            </Title>
                            <Title headingLevel="h3" style={{ fontWeight: 'lighter', lineHeight: 1.3 }}>
                                React Form Wizard
                            </Title>
                        </div>
                    </div>
                </MastheadBrand>
            </MastheadMain>
            <MastheadContent>
                <span style={{ flexGrow: 1 }} />
                <a href="https://github.com/patternfly-labs/react-form-wizard" style={{ color: 'white' }}>
                    <GithubIcon size="lg" />
                </a>
            </MastheadContent>
        </Masthead>
    )
}

function DemoSidebar() {
    const location = useLocation()
    return (
        <PageSidebar
            nav={
                <Nav>
                    <NavList>
                        <NavItem isActive={location.search === ''}>
                            <Link to={RouteE.Home}>Home</Link>
                        </NavItem>
                        <NavItem isActive={location.search === RouteE.Inputs}>
                            <Link to={RouteE.Inputs}>Inputs</Link>
                        </NavItem>
                        <NavItem isActive={location.search === RouteE.Wizards}>
                            <Link to={RouteE.Wizards}>Example Wizards</Link>
                        </NavItem>
                        {/* <NavExpandable title="Wizards" isExpanded={true}>
                            {wizards.map((wizard, index) => (
                                <NavItem key={index} isActive={location.search === wizard.route}>
                                    <Link to={wizard.route}>{wizard.shortName}</Link>
                                </NavItem>
                            ))}
                        </NavExpandable> */}
                    </NavList>
                </Nav>
            }
        />
    )
}

function Masonry(props: { size: number; children?: ReactNode }) {
    const target = useRef(null)
    const [columns, setColumns] = useState(2)
    useResizeObserver(target, (entry) => {
        setColumns(Math.max(Math.floor(entry.contentRect.width / props.size), 1))
    })
    const [span, setSpan] = useState<gridSpans>(2)
    useLayoutEffect(() => {
        switch (columns) {
            case 1:
                setSpan(12)
                break
            case 2:
                setSpan(6)
                break
            case 3:
                setSpan(4)
                break
            case 4:
                setSpan(3)
                break
            case 5:
                setSpan(2)
                break
            case 6:
                setSpan(2)
                break
            default:
                setSpan(1)
                break
        }
    }, [columns])

    const realColumns = 12 / span

    return (
        <div ref={target}>
            <Grid hasGutter>
                {new Array(realColumns).fill(0).map((_, index) => (
                    <GridItem span={span} key={index}>
                        <Stack hasGutter>
                            {Children.toArray(props.children)
                                .filter((_, i) => (i - index) % realColumns === 0)
                                .map((child) => child)}
                        </Stack>
                    </GridItem>
                ))}
            </Grid>
        </div>
    )
}
