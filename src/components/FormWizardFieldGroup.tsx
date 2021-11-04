import { FormFieldGroupExpandableProps } from '@patternfly/react-core'
import { InternalFormFieldGroup } from '@patternfly/react-core/dist/js/components/Form/InternalFormFieldGroup'
import './FormWizardFieldGroup.css'

export type FormWizardFieldGroupProps = FormFieldGroupExpandableProps & { setIsExpanded: (expanded: boolean) => void }
export function FormWizardFieldGroup(props: FormWizardFieldGroupProps) {
    const { children, className, header, isExpanded, setIsExpanded, toggleAriaLabel, ...extraProps } = props
    return (
        <InternalFormFieldGroup
            className="input-field-group"
            header={!isExpanded && header}
            isExpandable
            isExpanded={props.isExpanded}
            toggleAriaLabel={toggleAriaLabel}
            onToggle={() => setIsExpanded(!props.isExpanded)}
            {...extraProps}
        >
            {children}
        </InternalFormFieldGroup>
    )
}
