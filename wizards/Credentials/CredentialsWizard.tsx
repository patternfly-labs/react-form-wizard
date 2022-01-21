import { AnsibleTowerIcon, ServerIcon } from '@patternfly/react-icons'
import {
    FormCancel,
    FormSubmit,
    FormWizardSelect,
    FormWizardTile,
    FormWizardTiles,
    Section,
    Step,
    TextArea,
    TextInput,
    WizardPage,
} from '../../src'
import { isValidKubernetesName } from '../components/validation'
import AWSIcon from './icons/AWSIcon'
import AzureIcon from './icons/AzureIcon'
import GCPIcon from './icons/GCPIcon'
import HybridIcon from './icons/HybridIcon'
import RedHatIcon from './icons/RedHatIcon'
import VMWareIcon from './icons/VMWareIcon'

export enum CredentialsType {
    redhatcloud = 'rhocm',
    ansible = 'ans',
    openstack = 'ost',
    aws = 'aws',
    gcp = 'gcp',
    azure = 'azr',
    vmware = 'vmw',
    ibm = 'ibm',
    ibmpower = 'ibmpower',
    ibmz = 'ibmz',
    baremetal = 'bmc',
    hybrid = 'hybrid',
    other = 'other',
}

export function CredentialsWizard(props: { onSubmit: FormSubmit; onCancel: FormCancel }) {
    return (
        <WizardPage
            title="Add credentials"
            defaultData={{
                apiVersion: 'v1',
                kind: 'Secret',
                type: 'Opaque',
                metadata: {
                    name: '',
                    namespace: '',
                    labels: { 'cluster.open-cluster-management.io/credentials': '' },
                },
            }}
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
        >
            <Step label="Credential type">
                <Section label="Credentials type">
                    <FormWizardTiles
                        id="cloudCredentials"
                        path="metadata.labels.cluster\.open-cluster-management\.io/type"
                        label="Cloud provider credentials"
                    >
                        <FormWizardTile
                            id={CredentialsType.aws}
                            icon={<AWSIcon />}
                            value={CredentialsType.aws}
                            label="Amazon Web Services"
                        />
                        <FormWizardTile
                            id={CredentialsType.azure}
                            icon={<AzureIcon />}
                            value={CredentialsType.azure}
                            label="Microsoft Azure"
                        />
                        <FormWizardTile
                            id={CredentialsType.gcp}
                            icon={<GCPIcon />}
                            value={CredentialsType.gcp}
                            label="Google Cloud Platform"
                        />
                    </FormWizardTiles>
                    <FormWizardTiles
                        id="datacenterCredentials"
                        path="metadata.labels.cluster\.open-cluster-management\.io/type"
                        label="Datacenter credentials"
                    >
                        <FormWizardTile
                            id={CredentialsType.openstack}
                            icon={<RedHatIcon />}
                            value={CredentialsType.openstack}
                            label="Red Hat OpenStack Platform"
                        />
                        <FormWizardTile
                            id={CredentialsType.vmware}
                            icon={<VMWareIcon />}
                            value={CredentialsType.vmware}
                            label="VMWare vSphere"
                        />
                        <FormWizardTile
                            id={CredentialsType.baremetal}
                            icon={<ServerIcon color="slategray" />}
                            value={CredentialsType.baremetal}
                            label="Bare metal"
                        />
                    </FormWizardTiles>
                    <FormWizardTiles
                        id="automationCredentials"
                        path="metadata.labels.cluster\.open-cluster-management\.io/type"
                        label="Automation & other credentials"
                    >
                        <FormWizardTile
                            id={CredentialsType.ansible}
                            icon={<AnsibleTowerIcon color="#EE0000" />}
                            value={CredentialsType.ansible}
                            label="Red Hat Ansible Automation Platform"
                        />
                        <FormWizardTile
                            id={CredentialsType.redhatcloud}
                            icon={<RedHatIcon />}
                            value={CredentialsType.redhatcloud}
                            label="Red Hat OpenShift Cluster Manager"
                        />
                    </FormWizardTiles>
                    <FormWizardTiles
                        id={'centrallyManagedCredentials'}
                        path="metadata.labels.cluster\.open-cluster-management\.io/type"
                        label="Centrally managed"
                    >
                        <FormWizardTile
                            id={CredentialsType.hybrid}
                            icon={<HybridIcon />}
                            value={CredentialsType.hybrid}
                            label="On premise"
                        />
                    </FormWizardTiles>
                </Section>
            </Step>

            <Step label="Basic Information">
                <Section label="Details" prompt="Enter the details for the credentials">
                    <TextInput id="name" path="metadata.name" label="Name" required validation={isValidKubernetesName} />
                    <FormWizardSelect
                        id="namespace"
                        path="metadata.namespace"
                        label="Namespace"
                        helperText="The namespace on the hub cluster where the resources will be created."
                        options={['default']}
                        required
                    />
                    <TextInput
                        id="base-domain"
                        path="stringData.baseDomain"
                        label="Base DNS domain"
                        placeholder="Enter the Base DNS domain"
                    />
                </Section>
            </Step>

            <Step
                label="Amazon Web Services"
                hidden={(item) => item.metadata?.labels?.['cluster.open-cluster-management.io/type'] !== CredentialsType.aws}
            >
                <Section label="Amazon Web Services" prompt="Enter the Amazon Web Services credentials">
                    <TextInput id="aws-key-id" path="stringData.aws_access_key_id" label="Access key ID" required />
                    <TextInput id="aws-access-key" path="stringData.aws_secret_access_key" label="Secret access key" required secret />
                </Section>
            </Step>
            <Step label="Proxy">
                <Section label="Proxy" prompt="">
                    <TextInput id="http-proxy" path="stringData.httpProxy" label="HTTP Proxy" placeholder="Enter the HTTP Proxy url" />
                    <TextInput id="https-proxy" path="stringData.httpsProxy" label="HTTPS Proxy" placeholder="Enter the HTTPS Proxy url" />
                    <TextInput
                        id="no-proxy"
                        path="stringData.noProxy"
                        label="No Proxy"
                        placeholder="Enter the comma deliminated list of urls that do not require a proxy"
                    />
                    <TextArea
                        id="trust-bundle"
                        path="stringData.additionalTrustBundle"
                        label="Additional Trust Bundle"
                        placeholder="Enter your additional trust bundle"
                    />
                </Section>
            </Step>
            <Step label="Pull secret and SSH">
                <Section label="Pull secret and SSH" prompt="Enter the pull secret and SSH keys">
                    <TextArea id="pull-secret" path="stringData.pullSecret" label="Pull secret" required secret />
                    <TextArea
                        id="ssh-private-key"
                        path="stringData.ssh-privatekey"
                        label="SSH private key"
                        placeholder="Enter the SSH private key"
                        required
                        secret
                    />
                    <TextArea
                        id="ssh-public-key"
                        path="stringData.ssh-publickey"
                        label="SSH public key"
                        placeholder="Enter the SSH public key"
                        required
                        secret
                    />
                </Section>
            </Step>
        </WizardPage>
    )
}
