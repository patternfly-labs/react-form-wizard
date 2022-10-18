import { Tooltip } from '@patternfly/react-core'
import { Button } from '@patternfly/react-core/dist/js/components/Button'
import TimesCircleIcon from '@patternfly/react-icons/dist/js/icons/times-circle-icon'
// import { useStringContext } from '../contexts/StringContext'

export function ClearInputButton(props: { onClick: () => void }) {
    const { onClick } = props
    // const { clearButtonTooltip } = useStringContext()
    return (
        <Tooltip content="Clear">
            {/* <Tooltip content={clearButtonTooltip}> */}
            <Button variant="control" onClick={onClick} tabIndex={-1}>
                <TimesCircleIcon />
            </Button>
        </Tooltip>
    )
}
