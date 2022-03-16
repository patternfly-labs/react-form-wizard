import { Button } from '@patternfly/react-core/dist/js/components/Button'
import { SyncAltIcon } from '@patternfly/react-icons'

export function SyncButton(props: { onClick: () => void }) {
    return (
        <Button variant="control" onClick={props.onClick}>
            <SyncAltIcon />
        </Button>
    )
}
