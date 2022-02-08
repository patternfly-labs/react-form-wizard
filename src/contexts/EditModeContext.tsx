import { createContext, useContext } from 'react'
import { EditMode } from './EditMode'

export const EditModeContext = createContext<EditMode>(EditMode.Create)

export function useEditMode() {
    return useContext(EditModeContext)
}
