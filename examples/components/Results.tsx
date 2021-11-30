import { Breadcrumb, BreadcrumbItem, ClipboardCopyButton, CodeBlock, CodeBlockAction, Page, PageSection } from '@patternfly/react-core'
import { useState } from 'react'
import YAML from 'yaml'
import { RouteE } from '../Routes'

export function ResultYaml() {
    const [copied, setCopied] = useState(false)
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
            <PageSection padding={{ default: 'noPadding' }}>
                <CodeBlock
                    actions={
                        <CodeBlockAction>
                            <ClipboardCopyButton
                                id="copy-button"
                                textId="code-content"
                                aria-label="Copy to clipboard"
                                onClick={() => {
                                    setCopied(true)
                                    void navigator.clipboard.writeText(YAML.stringify(data))
                                    setTimeout(() => {
                                        setCopied(false)
                                    }, 1000)
                                }}
                                exitDelay={600}
                                maxWidth="110px"
                                variant="plain"
                            >
                                {copied ? 'Successfully copied to clipboard!' : 'Copy to clipboard'}
                            </ClipboardCopyButton>
                        </CodeBlockAction>
                    }
                >
                    <pre>{YAML.stringify(data)}</pre>
                </CodeBlock>
            </PageSection>
        </Page>
    )
}
