import { Button, Split, SplitItem } from '@patternfly/react-core'
import { ExternalLinkAltIcon } from '@patternfly/react-icons'
import { ReactNode } from 'react'

export type HelperTextPromptProps = {
    helperText?: ReactNode
    prompt?: { label?: string; href?: string; isDisabled?: boolean }
}

export function HelperTextPrompt(props: HelperTextPromptProps) {
    const { helperText, prompt } = props
    return (
        <Split>
            <SplitItem isFilled>
                <span className="pf-v5-c-form__helper-text">{helperText}</span>
            </SplitItem>
            <SplitItem>
                {prompt?.label && prompt?.href && (
                    <Button
                        variant="link"
                        style={{ paddingRight: '0px' }}
                        onClick={() => window.open(prompt?.href)}
                        isDisabled={prompt?.isDisabled}
                        icon={<ExternalLinkAltIcon />}
                        iconPosition="right"
                    >
                        {prompt?.label}
                    </Button>
                )}
            </SplitItem>
        </Split>
    )
}
