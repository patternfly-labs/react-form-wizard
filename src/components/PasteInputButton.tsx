import { Button } from '@patternfly/react-core/dist/js/components/Button'
import PasteIcon from '@patternfly/react-icons/dist/js/icons/paste-icon'

export function PasteInputButton(props: { setValue: (value: string) => void; setShowSecrets?: (value: boolean) => void }) {
    const { setValue, setShowSecrets } = props
    return (
        <Button
            variant="control"
            onClick={() => {
                void navigator.clipboard.readText().then((value) => {
                    setValue(value)
                    if (value && setShowSecrets) setShowSecrets(false)
                })
            }}
            tabIndex={-1}
        >
            <PasteIcon />
        </Button>
    )
}
