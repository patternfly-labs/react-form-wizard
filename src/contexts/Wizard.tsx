import { Alert, Button } from '@patternfly/react-core'
import { Children, isValidElement, ReactElement, ReactNode, useCallback, useState } from 'react'
import { DataContext } from './DataContext'
import { ItemContext } from './ItemContext'
import { Mode, ModeContext } from './ModeContext'
import { ShowValidationProvider, useSetShowValidation, useShowValidation } from './ShowValidationProvider'
import { Step } from './Step'
import { useValid, ValidProvider } from './ValidProvider'

export function Wizard(props: { title: string; children: ReactNode }) {
    const [data, setData] = useState({})
    const update = useCallback(() => setData((data) => JSON.parse(JSON.stringify(data))), [])
    return (
        <DataContext.Provider value={{ update }}>
            <ModeContext.Provider value={Mode.Wizard}>
                <ItemContext.Provider value={data}>
                    <ValidProvider>
                        <WizardInternal>{props.children}</WizardInternal>
                    </ValidProvider>
                </ItemContext.Provider>
            </ModeContext.Provider>
        </DataContext.Provider>
    )
}

function WizardInternal(props: { children: ReactNode }) {
    const steps = Children.toArray(props.children).filter((child) => isValidElement(child) && child.type === Step) as ReactElement[]
    steps.push(<Step label="Review">{props.children}</Step>)

    const [activeIndex, setActiveIndex] = useState(0)
    const next = useCallback(() => setActiveIndex((activeIndex) => activeIndex + 1), [])
    const back = useCallback(() => setActiveIndex((activeIndex) => activeIndex - 1), [])
    const setActiveStep = (step: ReactElement) => setActiveIndex(steps.indexOf(step))

    let activeStep = steps[activeIndex]
    if (!activeStep) activeStep = steps[0]

    return (
        <div className="pf-c-wizard">
            {/* <button aria-label="Wizard Header Toggle" className="pf-c-wizard__toggle" aria-expanded="false">
                <span className="pf-c-wizard__toggle-list">
                    <span className="pf-c-wizard__toggle-list-item">
                        <span className="pf-c-wizard__toggle-num">2</span>
                        Configuration
                        <i className="fas fa-angle-right pf-c-wizard__toggle-separator" aria-hidden="true"></i>
                    </span>
                    <span className="pf-c-wizard__toggle-list-item">Substep B</span>
                </span>
                <span className="pf-c-wizard__toggle-icon">
                    <i className="fas fa-caret-down" aria-hidden="true"></i>
                </span>
            </button> */}
            {steps?.map((step) => {
                if (step !== activeStep)
                    return (
                        <ShowValidationProvider key={step.props.label}>
                            <ValidProvider>
                                <div style={{ display: 'none' }}>{step}</div>
                            </ValidProvider>
                        </ShowValidationProvider>
                    )
                return (
                    <ShowValidationProvider key={step.props.label}>
                        <ValidProvider>
                            <WizardActiveStep activeStep={activeStep} setActiveStep={setActiveStep} steps={steps} next={next} back={back} />
                        </ValidProvider>
                    </ShowValidationProvider>
                )
            })}
        </div>
    )
}

export function WizardActiveStep(props: {
    steps: ReactElement[]
    activeStep: ReactElement
    setActiveStep: (activeStep: ReactElement) => void
    next: () => void
    back: () => void
}) {
    const valid = useValid()
    const showValidation = useShowValidation()
    const setShowValidation = useSetShowValidation()
    return (
        <div className="pf-c-wizard__outer-wrap">
            <div className="pf-c-wizard__inner-wrap">
                <nav className="pf-c-wizard__nav" aria-label="Steps">
                    <ol className="pf-c-wizard__nav-list">
                        {props.steps?.map((step) => {
                            let classname = 'pf-c-wizard__nav-link'
                            if (props.activeStep === step) {
                                classname += ' pf-m-current'
                            }
                            return (
                                <li key={step.props.label} className="pf-c-wizard__nav-item">
                                    <button
                                        className={classname}
                                        onClick={() => {
                                            props.setActiveStep(step)
                                        }}
                                    >
                                        {step.props.label}
                                    </button>
                                </li>
                            )
                        })}
                    </ol>
                </nav>
                <main className="pf-c-wizard__main">
                    <div className="pf-c-wizard__main-body">
                        <form noValidate className="pf-c-form">
                            {props.activeStep}
                        </form>
                    </div>
                </main>
            </div>
            {!valid && showValidation && <Alert title="Please fix validation errors." isInline variant="danger" />}
            <footer className="pf-c-wizard__footer">
                <Button
                    variant="primary"
                    isDisabled={!valid && showValidation}
                    type="submit"
                    onClick={() => {
                        setShowValidation(true)
                        if (valid) {
                            props.next()
                        }
                    }}
                >
                    Next
                </Button>
                <Button variant="secondary" onClick={props.back} isDisabled={props.activeStep === props.steps?.[0]}>
                    Back
                </Button>
                <div className="pf-c-wizard__footer-cancel">
                    <Button variant="link">Cancel</Button>
                </div>
            </footer>
        </div>
    )
}
