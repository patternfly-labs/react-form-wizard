import { createContext, useContext } from 'react'

/** ItemContext is the item context that input components are editing. */
export const ItemContext = createContext<object>({})

export function useItem() {
    return useContext(ItemContext)
}
