import {
    Button,
    Chip,
    ChipGroup,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Divider,
    Split,
    TextInput,
} from '@patternfly/react-core'
import { PlusIcon, TrashIcon } from '@patternfly/react-icons'
import get from 'get-value'
import { Fragment, useContext } from 'react'
import set from 'set-value'
import { useData } from '../contexts/DataContext'
import { ItemContext } from '../contexts/ItemContext'
import { Mode, useMode } from '../contexts/ModeContext'

export function FormWizardStringArray(props: {
    id: string
    label: string
    path?: string
    map?: (value: any) => string[]
    unmap?: (values: string[]) => any
    placeholder?: string
}) {
    const id = props.id
    const path = props.path ?? id

    const { update } = useData()
    const mode = useMode()
    const item = useContext(ItemContext)

    let values: string[] = get(item, path)
    if (props.map) values = props.map(values)
    else if (!values) values = []

    const onKeyChange = (index: number, newKey: string) => {
        values[index] = newKey
        let newValue = values
        if (props.unmap) newValue = props.unmap(values)
        set(item, path, newValue, { preservePaths: false })
        update()
    }

    const onNewKey = () => {
        values.push('')
        let newValue = values
        if (props.unmap) newValue = props.unmap(values)
        set(item, path, newValue, { preservePaths: false })
        update()
    }

    const onDeleteKey = (index: number) => {
        values.splice(index, 1)
        let newValue = values
        if (props.unmap) newValue = props.unmap(values)
        set(item, path, newValue, { preservePaths: false })
        update()
    }

    if (mode === Mode.Details) {
        return (
            <DescriptionListGroup>
                <DescriptionListTerm>{props.label}</DescriptionListTerm>
                <DescriptionListDescription id={props.id}>
                    <ChipGroup numChips={999}>
                        {values.map((pair, index) => {
                            return <Fragment key={index}>{pair && <Chip isReadOnly>{pair}</Chip>}</Fragment>
                        })}
                    </ChipGroup>
                </DescriptionListDescription>
            </DescriptionListGroup>
        )
    }

    return (
        <div id={props.id} style={{ display: 'flex', flexDirection: 'column', rowGap: values.length ? 8 : 4 }}>
            <div className="pf-c-form__label pf-c-form__label-text">{props.label}</div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: 0,
                }}
            >
                {values.map((pair, index) => {
                    return (
                        <Split key={index}>
                            <TextInput id={`${props.id}-${index + 1}`} value={pair} onChange={(e) => onKeyChange(index, e)} />
                            <Button variant="plain" aria-label="Remove item" onClick={() => onDeleteKey(index)}>
                                <TrashIcon />
                            </Button>
                        </Split>
                    )
                })}
            </div>
            {!values.length && <Divider />}
            <div>
                <Button id="add-button" variant="link" isSmall aria-label="Action" onClick={onNewKey}>
                    <PlusIcon /> &nbsp; {props.placeholder ?? 'Add'}
                </Button>
            </div>
        </div>
    )
}
