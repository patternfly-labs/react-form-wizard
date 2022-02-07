import '@patternfly/react-core/dist/styles/base.css'
import '@patternfly/react-styles/css/components/Wizard/wizard.css'
import { lazy, StrictMode, Suspense } from 'react'
import { render } from 'react-dom'

const Demo = lazy(() => import('./Demo'))

const root = document.createElement('div')
document.body.appendChild(root)
render(
    <StrictMode>
        <Suspense fallback={<div />}>
            <Demo />
        </Suspense>
    </StrictMode>,
    root
)
