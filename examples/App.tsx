import {
    Card,
    CardBody,
    CardTitle,
    Grid,
    GridItem,
    gridSpans,
    Nav,
    NavExpandable,
    NavItem,
    NavList,
    Page,
    PageHeader,
    PageSection,
    PageSidebar,
    Stack,
    Title,
} from '@patternfly/react-core'
import useResizeObserver from '@react-hook/resize-observer'
import { Children, ReactNode, useLayoutEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, useHistory, useLocation } from 'react-router-dom'
import { ResultYaml } from './components/Results'
import { AnsibleExample } from './Forms/AnsibleExample'
import { AppForm } from './Forms/AppForm'
import { ClusterForm } from './Forms/ClusterForm'
import { CredentialsForm } from './Forms/CredentialsForm'
import { DeploymentForm } from './Forms/DeploymentForm'
import { PolicyForm } from './Forms/PolicyForm'
import { RouteE } from './Routes'

interface IWizard {
    name: string
    description?: string
    route: RouteE
}

const wizards: IWizard[] = [
    {
        name: 'Create Ansible automation template',
        route: RouteE.Ansible,
        description: 'Cluster management uses Ansible automation templates to run ansible jobs as during cluster creating and upgrade.',
    },
    {
        name: 'Create application',
        route: RouteE.Application,
    },
    {
        name: 'Create cluster',
        route: RouteE.Cluster,
    },
    {
        name: 'Add credentials',
        route: RouteE.Credentials,
    },
    {
        name: 'Create deployment',
        route: RouteE.Deployment,
    },
    {
        name: 'Create policy',
        route: RouteE.Policy,
    },
]

export default function App() {
    return (
        <BrowserRouter>
            <Page
                header={<AppHeader />}
                sidebar={<AppSidebar />}
                isManagedSidebar
                defaultManagedSidebarIsOpen={false}
                style={{ height: '100vh' }}
            >
                <AppMain />
            </Page>
        </BrowserRouter>
    )
}
export function AppMain() {
    const location = useLocation()
    switch (location.search) {
        case RouteE.Ansible:
            return <AnsibleExample />
        case RouteE.Application:
            return <AppForm />
        case RouteE.Cluster:
            return <ClusterForm />
        case RouteE.Credentials:
            return <CredentialsForm />
        case RouteE.Deployment:
            return <DeploymentForm />
        case RouteE.Policy:
            return <PolicyForm />
        case RouteE.Results:
            return <ResultYaml />
        default:
            return <AppHome />
    }
}

function AppHome() {
    return (
        <Page
            additionalGroupedContent={
                <PageSection variant="light">
                    <Title headingLevel="h2">Wizards</Title>
                </PageSection>
            }
            groupProps={{ sticky: 'top' }}
        >
            <PageSection>
                <Masonry size={350}>
                    {wizards.map((wizard, index) => (
                        <AppCard key={index} title={wizard.name} route={wizard.route}>
                            {wizard.description}
                        </AppCard>
                    ))}
                </Masonry>
            </PageSection>
        </Page>
    )
}

function AppHeader() {
    return (
        <PageHeader
            logo={
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
            }
            showNavToggle
        />
    )
}

function AppSidebar() {
    const location = useLocation()

    return (
        <PageSidebar
            nav={
                <Nav>
                    <NavList>
                        <NavItem isActive={location.search === ''}>
                            <Link to={RouteE.Home}>Home</Link>
                        </NavItem>
                        <NavExpandable title="Wizards" isExpanded={true}>
                            {wizards.map((wizard, index) => (
                                <NavItem key={index} isActive={location.search === wizard.route}>
                                    <Link to={wizard.route}>{wizard.name}</Link>
                                </NavItem>
                            ))}
                        </NavExpandable>
                    </NavList>
                </Nav>
            }
        />
    )
}

function AppCard(props: { title?: string; children?: ReactNode; route: string }) {
    const history = useHistory()
    return (
        <Card isRounded isHoverable onClick={() => history.push(props.route)}>
            {props.title && <CardTitle>{props.title}</CardTitle>}
            {props.children && <CardBody>{props.children}</CardBody>}
        </Card>
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
