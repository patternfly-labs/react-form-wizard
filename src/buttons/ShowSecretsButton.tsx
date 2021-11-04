import { Button } from '@patternfly/react-core/dist/js/components/Button'
import EyeIcon from '@patternfly/react-icons/dist/js/icons/eye-icon'
import EyeSlashIcon from '@patternfly/react-icons/dist/js/icons/eye-slash-icon'

export function ShowSecretsButton(props: { showSecrets: boolean; setShowSecrets: (value: boolean) => void }) {
    const { showSecrets, setShowSecrets } = props
    return (
        <Button variant="control" onClick={() => setShowSecrets(!showSecrets)}>
            {showSecrets ? <EyeIcon /> : <EyeSlashIcon />}
        </Button>
    )
}
