import { Button } from '@patternfly/react-core/dist/js/components/Button'
import TimesCircleIcon from '@patternfly/react-icons/dist/js/icons/times-circle-icon'

export function ClearInputButton(props: { onClick: () => void }) {
    const { onClick } = props
    return (
        <Button variant="control" onClick={onClick} tabIndex={-1}>
            <TimesCircleIcon />
        </Button>
    )
}
