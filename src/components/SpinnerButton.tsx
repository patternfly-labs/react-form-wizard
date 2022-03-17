import { Spinner } from '@patternfly/react-core'
import { Button } from '@patternfly/react-core/dist/js/components/Button'

export function SpinnerButton() {
    return (
        <Button variant="control" isDisabled>
            <Spinner size="md" style={{ margin: -1, marginBottom: -3 }} />
        </Button>
    )
}
