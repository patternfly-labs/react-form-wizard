import { Alert, AlertVariant, Button, ButtonVariant } from '@patternfly/react-core'
import { ExternalLinkAltIcon } from '@patternfly/react-icons'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Checkbox, DetailsHidden, EditMode, KeyValue, Section, Select, Step, WizardCancel, WizardPage, WizardSubmit } from '../../src'
import { IResource } from '../common/resource'
import { ConfigMap } from '../common/resources/IConfigMap'
import { ICredential } from '../common/resources/ICredential'
import { IPolicyAutomation, PolicyAutomationType } from '../common/resources/IPolicyAutomation'

export function PolicyAutomationWizard(props: {
    title: string
    breadcrumb?: { label: string; to?: string }[]
    policy: IResource
    credentials: IResource[]
    configMaps?: ConfigMap[]
    createCredentialsCallback: () => void
    editMode?: EditMode
    yamlEditor?: () => ReactNode
    resource: IPolicyAutomation
    onSubmit: WizardSubmit
    onCancel: WizardCancel
    getAnsibleJobsCallback: (credential: ICredential) => Promise<string[]>
    isAnsibleOperatorInstalled: boolean
}) {
    const ansibleCredentials = useMemo(
        () => props.credentials.filter((credential) => credential.metadata?.labels?.['cluster.open-cluster-management.io/type'] === 'ans'),
        [props.credentials]
    )
    const ansibleCredentialNames = useMemo(
        () => ansibleCredentials.map((credential) => credential.metadata?.name ?? ''),
        [ansibleCredentials]
    )
    const [jobNames, setJobNames] = useState<string[]>()
    const [alert, setAlert] = useState<{ title: string; message: string }>()

    function getOperatorError() {
        const openShiftConsoleConfig = props.configMaps?.find((configmap) => configmap.metadata?.name === 'console-public')
        const openShiftConsoleUrl = openShiftConsoleConfig?.data?.consoleURL
        return (
            <div>
                {'The Ansible Automation Platform Resource Operator is required to create an Ansible job. '}
                {openShiftConsoleUrl && openShiftConsoleUrl !== '' ? (
                    <div>
                        {'Install the Operator through the following link: '}
                        <Button
                            isInline
                            variant={ButtonVariant.link}
                            onClick={() =>
                                window.open(openShiftConsoleUrl + '/operatorhub/all-namespaces?keyword=ansible+automation+platform')
                            }
                        >
                            {'Operator'}
                            <ExternalLinkAltIcon style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                        </Button>
                    </div>
                ) : (
                    'Install the Operator through operator hub.'
                )}
            </div>
        )
    }

    useEffect(() => {
        if (props.editMode === EditMode.Edit) {
            const credential = ansibleCredentials.find(
                (credential) => credential.metadata?.name === props.resource.spec?.automationDef?.secret
            )
            props
                .getAnsibleJobsCallback(credential ?? {})
                .then((jobNames) => setJobNames(jobNames))
                .catch((err) => {
                    if (err instanceof Error) {
                        setAlert({ title: 'Failed to get job names from ansible', message: err.message })
                    } else {
                        setAlert({ title: 'Failed to get job names from ansible', message: 'Unknown error' })
                    }
                })
        }
    }, [ansibleCredentials, props])

    return (
        <WizardPage
            title={props.title}
            breadcrumb={props.breadcrumb}
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
            editMode={props.editMode}
            yamlEditor={props.yamlEditor}
            defaultData={
                props.resource ?? {
                    ...PolicyAutomationType,
                    metadata: {
                        name: `${props.policy.metadata?.name ?? ''}-policy-automation`,
                        namespace: props.policy.metadata?.namespace,
                    },
                    spec: {
                        policyRef: props.policy.metadata?.name,
                        mode: 'once',
                        automationDef: { name: '', secret: '', type: 'AnsibleJob' },
                    },
                }
            }
        >
            <Step label="Automation" id="automation-step">
                {!props.isAnsibleOperatorInstalled && <Alert isInline title={getOperatorError()} variant={AlertVariant.danger} />}
                <Section label="Policy automation">
                    {alert && (
                        <DetailsHidden>
                            <Alert title={alert.title} isInline variant="danger">
                                {alert.message}
                            </Alert>
                        </DetailsHidden>
                    )}
                    <Select
                        id="secret"
                        label="Ansible credential"
                        path="spec.automationDef.secret"
                        options={ansibleCredentialNames}
                        onValueChange={(value, item) => {
                            if ((item as IPolicyAutomation).spec?.automationDef?.name) {
                                ;(item as IPolicyAutomation).spec.automationDef.name = ''
                            }
                            const credential = ansibleCredentials.find((credential) => credential.metadata?.name === value)
                            if (credential) {
                                setAlert(undefined)
                                setJobNames(undefined)
                                props
                                    .getAnsibleJobsCallback(credential)
                                    .then((jobNames) => setJobNames(jobNames))
                                    .catch((err) => {
                                        if (err instanceof Error) {
                                            setAlert({ title: 'Failed to get job names from ansible', message: err.message })
                                        } else {
                                            setAlert({ title: 'Failed to get job names from ansible', message: 'Unknown error' })
                                        }
                                    })
                            }
                        }}
                        footer={
                            <>
                                <Button
                                    id={'create-credential'}
                                    isInline
                                    variant={ButtonVariant.link}
                                    onClick={props.createCredentialsCallback}
                                >
                                    {'Create credential'}
                                </Button>
                            </>
                        }
                        required
                    />
                    <Select
                        id="job"
                        label="Ansible job"
                        path="spec.automationDef.name"
                        options={jobNames}
                        hidden={(item) => !item.spec?.automationDef?.secret}
                        required
                    />
                    <KeyValue
                        id="extra_vars"
                        path="spec.automationDef.extra_vars"
                        label="Extra variables"
                        placeholder="Add variable"
                        hidden={(item) => !item.spec?.automationDef?.name}
                    />
                    <Select
                        id="mode"
                        label="Schedule"
                        path="spec.mode"
                        options={[
                            { label: 'Once', value: 'once' },
                            { label: 'Disabled', value: 'disabled' },
                        ]}
                        hidden={(item) => !item.spec?.automationDef?.name}
                        required
                        onValueChange={(value, item) => {
                            if (
                                value !== 'disabled' &&
                                item.metadata?.annotations?.['policy.open-cluster-management.io/rerun'] === 'true'
                            ) {
                                item.metadata.annotations['policy.open-cluster-management.io/rerun'] = 'false'
                            }
                        }}
                    />
                    <Checkbox
                        hidden={(item) => item.spec?.mode !== 'disabled'}
                        path="metadata.annotations.policy\.open-cluster-management\.io/rerun"
                        label="Manual run: Set this automation to run once. After the automation runs, it is set to disabled."
                        inputValueToPathValue={(inputValue) => {
                            // inputValue is either true or false - this fn returns the string of the current boolean.
                            if (inputValue) {
                                return 'true'
                            } else {
                                return 'false'
                            }
                        }}
                    />
                </Section>
            </Step>
        </WizardPage>
    )
}
