import { Tooltip } from '@patternfly/react-core'
import { Button } from '@patternfly/react-core/dist/js/components/Button'
import EyeIcon from '@patternfly/react-icons/dist/js/icons/eye-icon'
import EyeSlashIcon from '@patternfly/react-icons/dist/js/icons/eye-slash-icon'
import { useStringContext } from '../contexts/StringContext'

export function ShowSecretsButton(props: { showSecrets: boolean; setShowSecrets: (value: boolean) => void }) {
    const { showSecrets, setShowSecrets } = props
    const { showSecretTooltip, hideSecretTooltip } = useStringContext()
    return (
        <Tooltip content={showSecrets ? hideSecretTooltip : showSecretTooltip}>
            <Button variant="control" onClick={() => setShowSecrets(!showSecrets)}>
                {showSecrets ? <EyeIcon /> : <EyeSlashIcon />}
            </Button>
        </Tooltip>
    )
}
