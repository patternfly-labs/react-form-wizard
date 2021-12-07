import get from 'get-value'
import { Fragment, ReactNode, useContext } from 'react'
import { FormWizardItemContext } from '../contexts/FormWizardItemContext'

export function FormWizardSelector(props: { selectKey: string; selectValue: string; defaultValue?: object; children?: ReactNode }) {
    const item = useContext(FormWizardItemContext)
    if (!Array.isArray(item)) return <Fragment>Input must be an array!</Fragment>

    const newItem = item.find((i) => get(i, props.selectKey) === props.selectValue)
    if (!Array.isArray(item)) return <Fragment>Item not found!</Fragment>

    return <FormWizardItemContext.Provider value={newItem}>{props.children}</FormWizardItemContext.Provider>
}
