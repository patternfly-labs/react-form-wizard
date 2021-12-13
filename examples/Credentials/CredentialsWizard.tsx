import { AnsibleTowerIcon, ServerIcon } from '@patternfly/react-icons'
import {
    FormWizardPage,
    FormWizardSection,
    FormWizardSelect,
    FormWizardStep,
    FormWizardTextInput,
    FormWizardTile,
    FormWizardTiles,
} from '../../src'
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

export function CredentialsWizard() {
    return (
        <FormWizardPage
            title="Add credentials"
            breadcrumb={[{ label: 'Home', to: '.' }, { label: 'Automation' }]}
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
        >
            <FormWizardStep label="Credential type">
                <FormWizardTiles
                    id="cloudCredentials"
                    path="metadata.labels.cluster\.open-cluster-management\.io/type"
                    label="Cloud provider credentials"
                >
                    <FormWizardTile id={CredentialsType.aws} icon={<AWSIcon />} value={CredentialsType.aws} label="Amazon Web Services" />
                    <FormWizardTile id={CredentialsType.azure} icon={<AzureIcon />} value={CredentialsType.azure} label="Microsoft Azure" />
                    <FormWizardTile id={CredentialsType.gcp} icon={<GCPIcon />} value={CredentialsType.gcp} label="Google Cloud Platform" />
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
                    <FormWizardTile id={CredentialsType.hybrid} icon={<HybridIcon />} value={CredentialsType.hybrid} label="On premise" />
                </FormWizardTiles>
            </FormWizardStep>

            <FormWizardStep label="Basic Information">
                <FormWizardSection label="Details" prompt="Enter the credentials details">
                    <FormWizardTextInput id="name" path="metadata.name" label="Name" required />
                    <FormWizardSelect
                        id="namespace"
                        path="metadata.namespace"
                        label="Namespace"
                        helperText="The namespace on the hub cluster where the resources will be created."
                        options={['default']}
                        required
                    />
                    <FormWizardTextInput
                        id="base-domain"
                        path="stringData.baseDomain"
                        label="Base DNS domain"
                        placeholder="Enter the Base DNS domain"
                    />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep
                label="Amazon Web Services"
                hidden={(item) => item.metadata?.labels?.['cluster.open-cluster-management.io/type'] !== CredentialsType.aws}
            >
                <FormWizardSection label="Amazon Web Services" prompt="Enter the Amazon Web Services credentials">
                    <FormWizardTextInput id="aws-key-id" path="stringData.aws_access_key_id" label="Access key ID" required />
                    <FormWizardTextInput
                        id="aws-access-key"
                        path="stringData.aws_secret_access_key"
                        label="Secret access key"
                        required
                        secret
                    />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Pull secret and SSH">
                <FormWizardSection label="Pull secret and SSH" prompt="Enter the pull secret and SSH keys">
                    <FormWizardTextInput id="pull-secret" path="stringData.pullSecret" label="Pull secret" required secret />
                    <FormWizardTextInput
                        id="ssh-private-key"
                        path="stringData.ssh-privatekey"
                        label="SSH private key"
                        placeholder="Enter the SSH private key"
                        required
                        secret
                    />
                    <FormWizardTextInput
                        id="ssh-public-key"
                        path="stringData.ssh-publickey"
                        label="SSH public key"
                        placeholder="Enter the SSH public key"
                        required
                        secret
                    />
                </FormWizardSection>
            </FormWizardStep>
        </FormWizardPage>
    )
}
