import get from 'get-value'
import { Children, isValidElement, ReactNode, useContext } from 'react'
import set from 'set-value'
import { FormWizardContext, IFormWizardContext } from '../contexts/FormWizardContext'
import { FormWizardItemContext } from '../contexts/FormWizardItemContext'

export type InputCommonProps<ValueT = any> = {
    id: string
    path?: string
    hidden?: (item: unknown) => boolean
    validation?: (value: ValueT) => string | undefined
    required?: boolean
    readonly?: boolean
    disabled?: boolean

    label: string
    labelHelp?: string
    labelHelpTitle?: string
    helperText?: string
}

export function useInputValue(props: InputCommonProps): [value: any, setValue: (value: any) => void] {
    const item = useContext(FormWizardItemContext)
    const formWizardContext = useContext(FormWizardContext)
    const path = props.path ?? props.id
    const value = get(item, path) ?? null
    const setValue = (value: any) => {
        inputSetValue(props, item, value, formWizardContext)
    }
    return [value, setValue]
}

export function inputGetValue(props: InputCommonProps, item: object) {
    const path = props.path ?? props.id
    const value = get(item, path) ?? null
    return value
}

export function inputSetValue<T = any>(props: InputCommonProps, item: object, value: T, formWizardContext: IFormWizardContext) {
    const path = props.path ?? props.id
    set(item, path, value)
    formWizardContext.updateContext()
}

export function useInputValidation(props: InputCommonProps) {
    const item = useContext(FormWizardItemContext)
    const formWizardContext = useContext(FormWizardContext)

    const value = inputGetValue(props, item)
    let error: string | undefined = undefined
    let validated: 'error' | undefined = undefined
    if (formWizardContext.showValidation) {
        if (props.required && !value) {
            error = `${props.label} is required`
        } else if (props.validation) {
            error = props.validation(value)
        }
        validated = error ? 'error' : undefined
    }
    return { validated, error }
}

export function useInputHidden(props: { hidden?: (item: any) => boolean }) {
    const item = useContext(FormWizardItemContext)
    const hidden = props.hidden ? props.hidden(item) : false
    return hidden
}

export function isFormWizardHiddenProps(props: unknown, item: unknown) {
    const hidden = (props as InputCommonProps).hidden
    if (typeof hidden === 'boolean') return hidden
    if (typeof hidden === 'function') {
        try {
            const result = hidden(item)
            if (typeof result === 'boolean') return result
        } catch {
            // Do nothing
        }
    }

    const children = (props as { children?: ReactNode }).children
    if (children) {
        let allChildrenHidden = true
        Children.forEach(children, (child) => {
            if (!allChildrenHidden) return
            if (!isValidElement(child)) return
            if (!isFormWizardHiddenProps(child.props, item)) {
                allChildrenHidden = false
            }
        })
        return allChildrenHidden
    }
    return false
}

export function hasValidationErrorsProps(props: InputCommonProps, item: unknown): boolean {
    if (!props) return false
    if (isFormWizardHiddenProps(props, item)) return false

    const id = props.id
    const path = props.path ?? id

    if (path) {
        if (item && typeof item === 'object') {
            const value = get(item, path) as unknown

            const required = props.required
            if (required && !value) {
                return true
            }

            const validation = props.validation
            if (typeof validation === 'function') {
                try {
                    const result = validation(value)
                    if (typeof result === 'string') return true
                } catch {
                    // Do nothing
                }
            }
        }
    }

    const children = (props as { children?: ReactNode }).children
    if (children) {
        let anyChildrenHasValidationErrors = false
        Children.forEach(children, (child) => {
            if (anyChildrenHasValidationErrors) return
            if (!isValidElement(child)) return
            if (isFormWizardHiddenProps(child.props, item)) return
            if (hasValidationErrorsProps(child.props as InputCommonProps, item)) {
                anyChildrenHasValidationErrors = true
            }
        })
        return anyChildrenHasValidationErrors
    }

    return false
}

export function inputHasValue(props: unknown, item: unknown) {
    const id = (props as InputCommonProps).id
    const path = (props as InputCommonProps).path ?? id
    if (path) {
        const value = get(item as object, path)
        if (value === undefined) return false
        if (typeof value === 'string') {
            return value !== '' && value !== undefined
        }
        if (typeof value === 'number') {
            return value !== 0
        }
        if (typeof value === 'boolean') {
            return true
        }
        if (Array.isArray(value)) {
            return value.length > 0
        }
    }

    const children = (props as { children?: ReactNode }).children
    if (children) {
        let anyChildHasValue = false
        Children.forEach(children, (child) => {
            if (anyChildHasValue) return
            if (!isValidElement(child)) return
            if (isFormWizardHiddenProps(child.props, item)) return
            if (inputHasValue(child.props, item)) {
                anyChildHasValue = true
            }
        })
        return anyChildHasValue
    }
    return false
}

export function lowercaseFirst(label: string) {
    if (label) {
        label = label[0].toLowerCase() + label.substr(1)
    }
    return label
}
