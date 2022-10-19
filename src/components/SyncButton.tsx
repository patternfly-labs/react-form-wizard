import { Tooltip } from '@patternfly/react-core'
import { Button } from '@patternfly/react-core/dist/js/components/Button'
import { SyncAltIcon } from '@patternfly/react-icons'
import { useStringContext } from '../contexts/StringContext'

export function SyncButton(props: { onClick: () => void }) {
    const { syncButtonTooltip } = useStringContext()
    return (
        <Tooltip content={syncButtonTooltip}>
            <Button variant="control" onClick={props.onClick}>
                <SyncAltIcon />
            </Button>
        </Tooltip>
    )
}
