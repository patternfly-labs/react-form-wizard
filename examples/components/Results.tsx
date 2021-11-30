import { Breadcrumb, BreadcrumbItem, Page, PageSection } from '@patternfly/react-core'
import YAML from 'yaml'
import { RouteE } from '../Routes'

export function ResultYaml() {
    const results = sessionStorage.getItem('results') ?? ''
    let data: any
    try {
        data = JSON.parse(results)
    } catch {
        data = { message: 'No results' }
    }
    return (
        <Page
            breadcrumb={
                <Breadcrumb>
                    <BreadcrumbItem to={RouteE.Home}>Home</BreadcrumbItem>
                    <BreadcrumbItem>Results</BreadcrumbItem>
                </Breadcrumb>
            }
            isBreadcrumbGrouped
            groupProps={{ sticky: 'top' }}
        >
            <PageSection variant="light">
                <pre>{YAML.stringify(data)}</pre>
            </PageSection>
        </Page>
    )
}
