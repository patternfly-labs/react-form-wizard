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
import YamlTemplate from './Credentials.hbs'

export function CredentialsForm() {
    return (
        <FormWizardPage title="Add credentials" template={YamlTemplate} breadcrumb={[{ label: 'Home', to: '..' }, { label: 'Automation' }]}>
            <FormWizardStep label="Credential type">
                <FormWizardTiles id="cloudCredentials" path="credentialsType" label="Cloud provider credentials">
                    <FormWizardTile id="aws" icon={<AmazonIcon />} value="AWS" label="Amazon Web Services" />
                    <FormWizardTile id="azr" icon={<AzureIcon />} value="azr" label="Microsoft Azure" />
                    <FormWizardTile id="gcp" icon={<GoogleIcon />} value="gcp" label="Google Cloud Platform" />
                </FormWizardTiles>
                <FormWizardTiles id="datacenterCredentials" path="credentialsType" label="Datacenter credentials">
                    <FormWizardTile id="ost" icon={<OpenstackIcon />} value="ost" label="Red Hat OpenStack Platform" />
                    <FormWizardTile id="vsp" value="vsp" label="VMWare vSphere" />
                    <FormWizardTile id="bare" value="bare" label="Bare metal" />
                </FormWizardTiles>
                <FormWizardTiles id="automationCredentials" path="credentialsType" label="Automation & other credentials">
                    <FormWizardTile id="auto" value="auto" label="Automation & other credentials" />
                    <FormWizardTile id="ocm" value="ocm" label="Red Hat OpenShoft Cluster Manager" />
                </FormWizardTiles>
                <FormWizardTiles id="centrallyManagedCredentials" path="credentialsType" label="Centrally managed">
                    <FormWizardTile id="onp" value="onp" label="On premise" />
                </FormWizardTiles>
            </FormWizardStep>

            <FormWizardStep label="Basic Information">
                <FormWizardSection label="Details" prompt="Enter the basic credentials information">
                    <FormWizardTextInput id="name" label="Name" required />
                    <FormWizardSelect
                        id="namespace"
                        label="Namespace"
                        helperText="The namespace on the hub cluster where the resources will be created."
                        options={['default']}
                        required
                    />
                    <FormWizardTextInput id="baseDomain" label="Base DNS domain" placeholder="Enter the Base DNS domain" />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Amazon Web Services" hidden={(item) => item.credentialsType !== 'AWS'}>
                <FormWizardSection label="Amazon Web Services" prompt="Enter the Amazon Web Services credentials">
                    <FormWizardTextInput id="accessKeyID" label="Access key ID" required />
                    <FormWizardTextInput id="secretAccessKey" label="Secret access key" required secret />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Pull secret and SSH">
                <FormWizardSection label="Pull secret and SSH" prompt="Enter the pull secret and SSH keys">
                    <FormWizardTextInput id="pullSecret" label="Pull secret" required secret />
                    <FormWizardTextInput
                        id="sshPrivateKey"
                        label="SSH private key"
                        placeholder="Enter the SSH private key"
                        required
                        secret
                    />
                    <FormWizardTextInput id="sshPublicKey" label="SSH public key" placeholder="Enter the SSH public key" required secret />
                </FormWizardSection>
            </FormWizardStep>
        </FormWizardPage>
    )
}
