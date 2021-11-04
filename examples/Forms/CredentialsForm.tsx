import { AmazonIcon, AzureIcon, GoogleIcon, OpenstackIcon } from '@patternfly/react-icons'
import { InputPage, InputSection, InputSelect, InputStep, InputText, InputTile, InputTiles } from '../../src'
import YamlTemplate from './Credentials.hbs'

export function CredentialsForm() {
    return (
        <InputPage title="Add credentials" template={YamlTemplate} breadcrumb={[{ label: 'Home', to: '..' }, { label: 'Automation' }]}>
            <InputStep label="Credential type">
                <InputTiles id="cloudCredentials" path="credentialsType" label="Cloud provider credentials">
                    <InputTile id="aws" icon={<AmazonIcon />} value="AWS" label="Amazon Web Services" />
                    <InputTile id="azr" icon={<AzureIcon />} value="azr" label="Microsoft Azure" />
                    <InputTile id="gcp" icon={<GoogleIcon />} value="gcp" label="Google Cloud Platform" />
                </InputTiles>
                <InputTiles id="datacenterCredentials" path="credentialsType" label="Datacenter credentials">
                    <InputTile id="ost" icon={<OpenstackIcon />} value="ost" label="Red Hat OpenStack Platform" />
                    <InputTile id="vsp" value="vsp" label="VMWare vSphere" />
                    <InputTile id="bare" value="bare" label="Bare metal" />
                </InputTiles>
                <InputTiles id="automationCredentials" path="credentialsType" label="Automation & other credentials">
                    <InputTile id="auto" value="auto" label="Automation & other credentials" />
                    <InputTile id="ocm" value="ocm" label="Red Hat OpenShoft Cluster Manager" />
                </InputTiles>
                <InputTiles id="centrallyManagedCredentials" path="credentialsType" label="Centrally managed">
                    <InputTile id="onp" value="onp" label="On premise" />
                </InputTiles>
            </InputStep>

            <InputStep label="Basic Information">
                <InputSection label="Details" prompt="Enter the basic credentials information">
                    <InputText id="name" label="Name" required />
                    <InputSelect
                        id="namespace"
                        label="Namespace"
                        helperText="The namespace on the hub cluster where the resources will be created."
                        options={['default']}
                        required
                    />
                    <InputText id="baseDomain" label="Base DNS domain" placeholder="Enter the Base DNS domain" />
                </InputSection>
            </InputStep>

            <InputStep label="Amazon Web Services" hidden={(item) => item.credentialsType !== 'AWS'}>
                <InputSection label="Amazon Web Services" prompt="Enter the Amazon Web Services credentials">
                    <InputText id="accessKeyID" label="Access key ID" required />
                    <InputText id="secretAccessKey" label="Secret access key" required secret />
                </InputSection>
            </InputStep>

            <InputStep label="Pull secret and SSH">
                <InputSection label="Pull secret and SSH" prompt="Enter the pull secret and SSH keys">
                    <InputText id="pullSecret" label="Pull secret" required secret />
                    <InputText id="sshPrivateKey" label="SSH private key" placeholder="Enter the SSH private key" required secret />
                    <InputText id="sshPublicKey" label="SSH public key" placeholder="Enter the SSH public key" required secret />
                </InputSection>
            </InputStep>
        </InputPage>
    )
}
