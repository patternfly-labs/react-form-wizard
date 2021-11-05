import {
    Card,
    CardBody,
    CardTitle,
    Gallery,
    Nav,
    NavItem,
    NavList,
    Page,
    PageHeader,
    PageSection,
    PageSidebar,
    Title,
} from '@patternfly/react-core'
import { ReactNode, Suspense } from 'react'
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom'
import { AnsibleForm } from './Forms/AnsibleForm'
import { AppForm } from './Forms/AppForm'
import { ClusterForm } from './Forms/ClusterForm'
import { CredentialsForm } from './Forms/CredentialsForm'
import { DeploymentForm } from './Forms/DeploymentForm'
import { PolicyForm } from './Forms/PolicyForm'

export enum RouteE {
    Home = '/home',
    Ansible = '/ansible',
    Application = '/application',
    Cluster = '/cluster',
    Credentials = '/credentials',
    Deployment = '/deployment',
    Policy = '/policy',
}

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
                <Suspense fallback={<div />}>
                    <Routes>
                        <Route path={'/'} element={<AppHome />} />
                        <Route path={RouteE.Home} element={<AppHome />} />
                        <Route path={RouteE.Ansible} element={<AnsibleForm />} />
                        <Route path={RouteE.Application} element={<AppForm />} />
                        <Route path={RouteE.Cluster} element={<ClusterForm />} />
                        <Route path={RouteE.Credentials} element={<CredentialsForm />} />
                        <Route path={RouteE.Deployment} element={<DeploymentForm />} />
                        <Route path={RouteE.Policy} element={<PolicyForm />} />
                        {/* <Route path="*" element={<Redirect to={RouteE.Home} />} /> */}
                    </Routes>
                </Suspense>
            </Page>
        </BrowserRouter>
    )
}

function AppHome() {
    return (
        <Page
            additionalGroupedContent={
                <PageSection variant="light">
                    <Title headingLevel="h2">PatternFly React Form Wizard Examples</Title>
                    {/* <Text component="p">The InputForm is used to create forms for editing data.</Text> */}
                </PageSection>
            }
            groupProps={{ sticky: 'top' }}
        >
            <PageSection>
                <Gallery hasGutter>
                    {Object.keys(RouteE)
                        .filter((route) => !['Home'].includes(route))
                        .map((route) => (
                            <AppCard
                                key={route}
                                // title={route}
                                route={
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                    (RouteE as any)[route] // eslint-disable-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any
                                }
                            >
                                {`Create ${route} Wizard`}
                            </AppCard>
                        ))}
                </Gallery>
            </PageSection>
        </Page>
    )
}

function AppCard(props: { title: string; children: ReactNode; route: string }) {
    const navigate = useNavigate()
    return (
        <Card isRounded isHoverable onClick={() => navigate(props.route)}>
            {props.title && <CardTitle>{props.title}</CardTitle>}
            {props.children && <CardBody>{props.children}</CardBody>}
        </Card>
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
                            PatternFly
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
    return (
        <PageSidebar
            nav={
                <Nav>
                    <NavList>
                        {Object.keys(RouteE).map((route) => (
                            <NavItem key={route}>
                                <Link
                                    to={
                                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                        (RouteE as any)[route] // eslint-disable-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any
                                    }
                                >
                                    {route}
                                </Link>
                            </NavItem>
                        ))}
                    </NavList>
                </Nav>
            }
        />
    )
}
