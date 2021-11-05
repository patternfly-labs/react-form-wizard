import {
    Card,
    CardBody,
    Gallery,
    Nav,
    NavItem,
    NavList,
    Page,
    PageHeader,
    PageSection,
    PageSidebar,
    Text,
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
                    <Title headingLevel="h2">InputForm Examples</Title>
                    <Text component="p">The InputForm is used to create forms for editing data.</Text>
                </PageSection>
            }
            groupProps={{ sticky: 'top' }}
        >
            <PageSection>
                <Gallery hasGutter>
                    {Object.keys(RouteE)
                        .filter((r) => r !== 'Home')
                        .map((route) => (
                            <AppCard key={route} title={route} route={RouteE[route as RouteE]}>
                                {/* {`Create ${route}`} */}
                            </AppCard>
                        ))}
                </Gallery>
            </PageSection>
        </Page>
    )
}

function AppCard(props: { title: string; children: ReactNode; route: RouteE }) {
    const navigate = useNavigate()
    return (
        <Card
            isRounded
            isHoverable
            onClick={() => {
                navigate(props.route)
            }}
        >
            <CardBody>{props.title}</CardBody>
        </Card>
        // <Tile
        //     title={props.title}
        //     onClick={() => {
        //         history.push(props.route)
        //     }}
        // >
        //     {props.children}
        // </Tile>
    )
}

function AppHeader() {
    return (
        <PageHeader
            logo={
                <div style={{ display: 'flex', gap: 8, alignItems: 'start' }}>
                    <div style={{ color: 'white' }}>
                        <Title headingLevel="h4" style={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                            PatternFly
                        </Title>
                        <Title headingLevel="h3" style={{ fontWeight: 'lighter', lineHeight: 1.2 }}>
                            Form Wizard
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
                                <Link to={RouteE[route as RouteE]}>{route}</Link>
                            </NavItem>
                        ))}
                    </NavList>
                </Nav>
            }
        />
    )
}

// export function AppPageHeader(props: { title: string; navigation?: ReactNode }) {
//     return (
//         <PageSection variant={PageSectionVariants.light} style={{ paddingBottom: props.navigation ? 0 : undefined }}>
//             {props.isLoading ? <Title headingLevel="h2">&nbsp;</Title> : <Title headingLevel="h2">{props.title}</Title>}
//             {props.navigation !== undefined && <div style={{ paddingTop: '6px' }}>{props.navigation}</div>}
//         </PageSection>
//     )
// }
