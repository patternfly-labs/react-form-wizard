import get from 'get-value'
import { Children, isValidElement, useContext } from 'react'
import { InputItemContext } from '../contexts/InputItemContext'

export interface InputCommonProps {
    id: string
    path: string
    hidden?: (item: any) => boolean
    validation?: (value: string) => string | undefined
}

export function isInputHiddenProps(props: any) {
    let item = useContext(InputItemContext)
    const hidden = props.hidden
    if (typeof hidden === 'boolean') return hidden
    if (typeof hidden === 'function') {
        try {
            const result = hidden(item)
            if (typeof result === 'boolean') return result
        } catch {}
    }
    if (props.children) {
        let allChildrenHidden = true
        Children.forEach(props.children, (child) => {
            if (!allChildrenHidden) return
            if (!isValidElement(child)) return
            if (!isInputHiddenProps(child.props)) {
                allChildrenHidden = false
            }
        })
        return allChildrenHidden
    }
    return false
}

export function hasValidationErrorsProps(props: any): boolean {
    if (!props) return false
    if (isInputHiddenProps(props)) return false

    let item = useContext(InputItemContext)
    const path = props.path ?? props.id
    if (path) {
        const value = get(item, path)

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

    if (props.children) {
        let anyChildrenHasValidationErrors = false
        Children.forEach(props.children, (child) => {
            if (anyChildrenHasValidationErrors) return
            if (!isValidElement(child)) return
            if (isInputHiddenProps(child.props)) return
            if (hasValidationErrorsProps(child.props)) {
                anyChildrenHasValidationErrors = true
            }
        })
        return anyChildrenHasValidationErrors
    }

    return false
}

export function inputHasValue(props: any) {
    let item = useContext(InputItemContext)
    const path = props.path ?? props.id
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
    if (props.children) {
        let anyChildHasValue = false
        Children.forEach(props.children, (child) => {
            if (anyChildHasValue) return
            if (!isValidElement(child)) return
            if (isInputHiddenProps(child.props)) return
            if (inputHasValue(child.props)) {
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
