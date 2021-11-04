import { FormFieldGroupExpandableProps } from '@patternfly/react-core'
import { InternalFormFieldGroup } from '@patternfly/react-core/dist/js/components/Form/InternalFormFieldGroup'
import './InputFieldGroup.css'

export type InputFieldGroupProps = FormFieldGroupExpandableProps & { setIsExpanded: (expanded: boolean) => void }
export function InputFieldGroup(props: InputFieldGroupProps) {
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
