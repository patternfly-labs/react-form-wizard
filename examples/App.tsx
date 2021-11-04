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
import RedHatIcon from '@patternfly/react-icons/dist/js/icons/redhat-icon'
import { ReactNode, Suspense } from 'react'
import { BrowserRouter, Link, Redirect, Route, Switch, useHistory } from 'react-router-dom'
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

export function App() {
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
                    <Switch>
                        <Route exact path={RouteE.Home} component={AppHome} />
                        <Route exact path={RouteE.Ansible} component={AnsibleForm} />
                        <Route exact path={RouteE.Application} component={AppForm} />
                        <Route exact path={RouteE.Cluster} component={ClusterForm} />
                        <Route exact path={RouteE.Credentials} component={CredentialsForm} />
                        <Route exact path={RouteE.Deployment} component={DeploymentForm} />
                        <Route exact path={RouteE.Policy} component={PolicyForm} />
                        <Route path="*">
                            <Redirect to={RouteE.Home} />
                        </Route>
                    </Switch>
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
    const history = useHistory()
    return (
        <Card
            isRounded
            isHoverable
            onClick={() => {
                history.push(props.route)
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
                    <RedHatIcon size="lg" style={{ color: '#EE0000', marginTop: -8 }} />
                    <div style={{ color: 'white' }}>
                        <Title headingLevel="h4" style={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                            Red Hat
                        </Title>
                        <Title headingLevel="h3" style={{ fontWeight: 'lighter', lineHeight: 1.2 }}>
                            Advanced Cluster Management for Kubernetes
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
