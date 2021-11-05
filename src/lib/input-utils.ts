import get from 'get-value'
import { Children, isValidElement, ReactNode } from 'react'

export interface InputCommonProps {
    id: string
    path: string
    hidden?: (item: unknown) => boolean
    validation?: (value: string) => string | undefined
    required?: boolean
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
                } catch {}
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
        const value = get(item, path)
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
