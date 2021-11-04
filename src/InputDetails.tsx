import { DescriptionList } from '@patternfly/react-core'
import { ReactNode, useContext } from 'react'
import { InputContext, InputMode } from './contexts/InputContext'

export function InputDetails(props: { children: ReactNode }) {
    let inputContext = useContext(InputContext)
    return (
        <InputContext.Provider value={{ ...inputContext, ...{ mode: InputMode.Details } }}>
            <DescriptionList isHorizontal>{props.children}</DescriptionList>
        </InputContext.Provider>
    )
}
