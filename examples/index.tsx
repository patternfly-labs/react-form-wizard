import '@patternfly/react-core/dist/styles/base.css'
import { lazy, StrictMode, Suspense } from 'react'
import { render } from 'react-dom'

const App = lazy(() => import('./App'))

const root = document.createElement('div')
document.body.appendChild(root)
render(
    <StrictMode>
        <Suspense fallback={<div />}>
            <App />
        </Suspense>
    </StrictMode>,
    root
)
