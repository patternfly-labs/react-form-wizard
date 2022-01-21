import get from 'get-value'
import { Fragment, ReactNode, useContext } from 'react'
import { ItemContext } from '../contexts/ItemContext'

export function wizardSelectorItem(props: any, item: any[]) {
    return item.find((i) => get(i, props.selectKey) === props.selectValue)
}

export function ItemSelector(props: { selectKey: string; selectValue: string; children?: ReactNode }) {
    const item = useContext(ItemContext)
    if (!Array.isArray(item)) return <Fragment>Input must be an array!</Fragment>

    const newItem = wizardSelectorItem(props, item)
    if (!Array.isArray(item)) return <Fragment>Item not found!</Fragment>

    return <ItemContext.Provider value={newItem}>{props.children}</ItemContext.Provider>
}
