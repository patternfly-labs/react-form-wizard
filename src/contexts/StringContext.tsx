import { createContext, useContext } from 'react'

export interface WizardStrings {
    reviewLabel: string
    unknownError: string
    errorString: string
    stepsAriaLabel: string
    contentAriaLabel: string
    actionAriaLabel: string
    detailsAriaLabel: string
    sortableMoveItemUpAriaLabel: string
    sortableMoveItemDownAriaLabel: string
    removeItemAriaLabel: string
    deselectAllAriaLabel: string
    selectAllAriaLabel: string
    clearButtonTooltip: string
    pasteButtonTooltip: string
    backButtonText: string
    cancelButtonText: string
    nextButtonText: string
    fixValidationErrorsMsg: string
    submitText: string
    submittingText: string
    internalFormFieldGroupError: string
    moreInfo: string
    hideSecretTooltip: string
    showSecretTooltip: string
    spinnerButtonTooltip: string
    syncButtonTooltip: string
    isRequired: string
    required: string
    getEnterPlaceholderString: string
    getSelectPlaceholderString: string
    getCollapsedPlaceholderString: string
    getAddPlaceholderString: string
    expandToFixValidationErrors: string
    keyPathRequired: string
    keyedValueError: string
}

export const defaultStrings: WizardStrings = {
    reviewLabel: 'Review',
    unknownError: 'Unknown Error',
    errorString: 'error',
    stepsAriaLabel: 'steps',
    contentAriaLabel: 'content',
    actionAriaLabel: 'Action',
    detailsAriaLabel: 'Details',
    sortableMoveItemUpAriaLabel: 'Move item up',
    sortableMoveItemDownAriaLabel: 'Move item down',
    removeItemAriaLabel: 'Remove item',
    deselectAllAriaLabel: 'Deselect all',
    selectAllAriaLabel: 'Select all',
    clearButtonTooltip: 'Clear',
    pasteButtonTooltip: 'Paste',
    backButtonText: 'Back',
    cancelButtonText: 'Cancel',
    nextButtonText: 'Next',
    fixValidationErrorsMsg: 'Please fix validation errors',
    submitText: 'Submit',
    submittingText: 'Submitting',
    internalFormFieldGroupError:
        'toggleAriaLabel or the titleText prop FormfieldGroupHeader is required to make the toggle button accessible',
    moreInfo: 'More info',
    hideSecretTooltip: 'Hide secret',
    showSecretTooltip: 'Show secret',
    spinnerButtonTooltip: 'Loading',
    syncButtonTooltip: 'Refresh',
    isRequired: 'is required',
    required: 'Required',
    getEnterPlaceholderString: 'Enter the',
    getSelectPlaceholderString: 'Select the',
    getCollapsedPlaceholderString: 'Expand to edit',
    getAddPlaceholderString: 'Add',
    expandToFixValidationErrors: 'Expand to fix validation errors',
    keyPathRequired: 'keyPath is required',
    keyedValueError: 'keyedValue is not a string or number',
}

export const StringContext = createContext<WizardStrings>(defaultStrings)

export function useStringContext() {
    return useContext(StringContext)
}
