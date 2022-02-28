import { Flex, FlexItem } from '@patternfly/react-core'
import { Fragment } from 'react'
import { Select, StringsInput, TextInput } from '../../src'
import { DisplayMode, useDisplayMode } from '../../src/contexts/DisplayModeContext'
import { useItem } from '../../src/contexts/ItemContext'
import { IExpression } from '../common/resources/IMatchExpression'

export function MatchExpression() {
    return (
        <Flex style={{ rowGap: 16 }}>
            <TextInput label="Label" path="key" required disablePaste />
            <Select
                label="Operator"
                path="operator"
                options={[
                    { label: 'equals any of', value: 'In' },
                    { label: 'does not equal any of', value: 'NotIn' },
                    { label: 'exists', value: 'Exists' },
                    { label: 'does not exist', value: 'DoesNotExist' },
                ]}
                required
            />
            <FlexItem>
                <StringsInput
                    label="Values"
                    path="values"
                    hidden={(labelSelector) => !['In', 'NotIn'].includes(labelSelector.operator)}
                    placeholder="Add value"
                    required
                />
            </FlexItem>
        </Flex>
    )
}

export function MatchExpressionCollapsed() {
    const expression = useItem() as IExpression
    return <MatchExpressionSummary expression={expression} />
}

export function MatchExpressionSummary(props: { expression: IExpression }) {
    const { expression } = props

    let operator = 'unknown'
    switch (expression.operator) {
        case 'In':
            if (expression.values && expression.values.length > 1) {
                operator = 'equals any of'
            } else {
                operator = 'equals'
            }
            break
        case 'NotIn':
            if (expression.values && expression.values.length > 1) {
                operator = 'does not equal any of'
            } else {
                operator = 'does not equal'
            }
            break
        case 'Exists':
            operator = 'exists'
            break
        case 'DoesNotExist':
            operator = 'does not exist'
            break
    }

    const displayMode = useDisplayMode()

    if (!expression.key) {
        if (displayMode === DisplayMode.Details) return <Fragment />
        return <div>Expand to enter expression</div>
    }

    return (
        <div>
            {expression.key} {operator} {expression.values?.map((value) => value).join(', ')}
        </div>
    )
}
