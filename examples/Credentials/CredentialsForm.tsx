import { AmazonIcon, AzureIcon, GoogleIcon, OpenstackIcon } from '@patternfly/react-icons'
import {
    FormWizardPage,
    FormWizardSection,
    FormWizardSelect,
    FormWizardStep,
    FormWizardTextInput,
    FormWizardTile,
    FormWizardTiles,
} from '../../src'
// import YamlTemplate from './Credentials.hbs'

export function CredentialsForm() {
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
                    labels: {
                        'cluster.open-cluster-management.io/type': '',
                    },
                },
            }}
        >
            <FormWizardStep label="Credential type">
                <FormWizardTiles
                    id="cloudCredentials"
                    path="metadata.labels.cluster\.open-cluster-management\.io/credentials"
                    label="Cloud provider credentials"
                >
                    <FormWizardTile id="aws" icon={<AmazonIcon />} value="AWS" label="Amazon Web Services" />
                    <FormWizardTile id="azr" icon={<AzureIcon />} value="azr" label="Microsoft Azure" />
                    <FormWizardTile id="gcp" icon={<GoogleIcon />} value="gcp" label="Google Cloud Platform" />
                </FormWizardTiles>
                <FormWizardTiles
                    id="datacenterCredentials"
                    path="metadata.labels.cluster\.open-cluster-management\.io/credentials"
                    label="Datacenter credentials"
                >
                    <FormWizardTile id="ost" icon={<OpenstackIcon />} value="ost" label="Red Hat OpenStack Platform" />
                    <FormWizardTile id="vsp" value="vsp" label="VMWare vSphere" />
                    <FormWizardTile id="bare" value="bare" label="Bare metal" />
                </FormWizardTiles>
                <FormWizardTiles
                    id="automationCredentials"
                    path="metadata.labels.cluster\.open-cluster-management\.io/credentials"
                    label="Automation & other credentials"
                >
                    <FormWizardTile id="auto" value="auto" label="Automation & other credentials" />
                    <FormWizardTile id="ocm" value="ocm" label="Red Hat OpenShoft Cluster Manager" />
                </FormWizardTiles>
                <FormWizardTiles
                    id="centrallyManagedCredentials"
                    path="metadata.labels.cluster\.open-cluster-management\.io/credentials"
                    label="Centrally managed"
                >
                    <FormWizardTile id="onp" value="onp" label="On premise" />
                </FormWizardTiles>
            </FormWizardStep>

            <FormWizardStep label="Basic Information">
                <FormWizardSection label="Details" prompt="Enter the credentials details">
                    <FormWizardTextInput id="metadata.name" label="Name" required />
                    <FormWizardSelect
                        id="metadata.namespace"
                        label="Namespace"
                        helperText="The namespace on the hub cluster where the resources will be created."
                        options={['default']}
                        required
                    />
                    <FormWizardTextInput id="stringData.baseDomain" label="Base DNS domain" placeholder="Enter the Base DNS domain" />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Amazon Web Services" hidden={(item) => item.credentialsType !== 'AWS'}>
                <FormWizardSection label="Amazon Web Services" prompt="Enter the Amazon Web Services credentials">
                    <FormWizardTextInput id="stringData.accessKeyID" label="Access key ID" required />
                    <FormWizardTextInput id="stringData.secretAccessKey" label="Secret access key" required secret />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Pull secret and SSH">
                <FormWizardSection label="Pull secret and SSH" prompt="Enter the pull secret and SSH keys">
                    <FormWizardTextInput id="stringData.pullSecret" label="Pull secret" required secret />
                    <FormWizardTextInput
                        id="stringData.sshPrivateKey"
                        label="SSH private key"
                        placeholder="Enter the SSH private key"
                        required
                        secret
                    />
                    <FormWizardTextInput
                        id="stringData.sshPublicKey"
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
