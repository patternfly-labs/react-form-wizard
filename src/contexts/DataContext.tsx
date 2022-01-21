import { createContext, useContext } from 'react'

export interface IDataContext {
    update: (data?: any) => void
}

export const DataContext = createContext<IDataContext>({ update: () => null })

export function useData() {
    return useContext(DataContext)
}
