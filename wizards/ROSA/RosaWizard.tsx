import {
    FormWizardCheckbox,
    FormWizardLabels,
    FormWizardPage,
    FormWizardRadio,
    FormWizardRadioGroup,
    FormWizardSection,
    FormWizardSelect,
    FormWizardStep,
    FormWizardTextInput,
    FormWizardTile,
    FormWizardTiles,
    FormWizardTimeRange,
} from '../../src'

export function RosaWizard() {
    return (
        <FormWizardPage title="Create ROSA cluster" defaultData={{}}>
            <FormWizardStep label="Account and roles">
                <FormWizardSection
                    label="Account and roles"
                    prompt="Welcome to the Red Hat OpenShift service on AWS (ROSA)"
                    description="Red Hat OpenShift Service on AWS provides a model that allows Red Hat to deploy clusters into a customer's existing Amazon Web Service (AWS) account."
                >
                    <FormWizardSelect id="account" path="account" label="Associated AWS account" options={['TODO']} />
                    <FormWizardSelect id="role" path="role" label="OpenShift Cluster Manager role (ocm-role)" options={['TODO']} />
                </FormWizardSection>
                <FormWizardSection
                    label="Account roles ARNs"
                    description="The following roles were detected according to the associated account. The ARNs can be edited according to your preferences."
                >
                    <FormWizardTextInput id="installer-role" path="installerRole" label="Installer role" required />
                    <FormWizardTextInput id="support-role" path="supportRole" label="Support role" required />
                    <FormWizardTextInput id="worker-role" path="workerRole" label="Worker role" required />
                    <FormWizardTextInput id="control-plane-role" path="controlPlaneRole" label="Control plane role" required />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Cluster settings">
                <FormWizardStep label="Details">
                    <FormWizardSection label="Cluster details">
                        <FormWizardTextInput id="cluster-name-role" path="clusterName" label="Cluster name" required />
                        <FormWizardCheckbox id="use-roles-prefix" path="useRolesPrefix" label="Use operator roles prefix">
                            <FormWizardTextInput
                                id="roles-prefix"
                                path="rolesPrefix"
                                label="Operator roles prefix"
                                required
                                helperText="Maximum 32 characters."
                            />
                        </FormWizardCheckbox>
                        <FormWizardSelect id="version" path="version" label="Version" options={['TODO']} required />
                        <FormWizardSelect id="region" path="region" label="Region" options={['TODO']} required />
                        <FormWizardRadioGroup id="availability" path="availability" label="Availability">
                            <FormWizardRadio id="single-zone" value="single-zone" label="Single zone" />
                            <FormWizardRadio id="multi-zone" value="multi-zone" label="Multi zone" />
                        </FormWizardRadioGroup>
                        {/* </FormWizardSection> */}

                        {/* <FormWizardSection label="Monitoring"> */}
                        <FormWizardCheckbox
                            id="monitoring"
                            path="monitoring"
                            label="Enable use workload monitoring"
                            description="Monitor you own projects in isolation from Red Hat Site reliability (SRE) platform metrics."
                        />
                        {/* </FormWizardSection> */}

                        {/* <FormWizardSection label="Encryption"> */}
                        <FormWizardCheckbox
                            id="etcd-encryption"
                            path="etcdEncryption"
                            label="Enable etcd encryption"
                            description="Add another layer of data security to your cluster."
                        />
                        <FormWizardCheckbox
                            id="ebs-encryption"
                            path="ebsEncryption"
                            label="Encrypt EBS with customer keys"
                            description="Use your own AWS KMS keys to enable encryption of AWS EBS volumes for the cluster."
                        />
                    </FormWizardSection>
                </FormWizardStep>

                <FormWizardStep label="Machine pool">
                    <FormWizardSection
                        label="Default machine pool"
                        description="Select a compute node instance type and count your default machine pool."
                    >
                        <FormWizardSelect
                            id="instance-type"
                            path="instanceType"
                            label="Compute node instance type"
                            options={['TODO']}
                            required
                        />
                        <FormWizardSelect
                            id="availability-zones"
                            path="availabilityZones"
                            label="Availability zones"
                            options={['TODO']}
                            required
                        />

                        <FormWizardCheckbox
                            id="autoscaling"
                            path="autoscaling"
                            label="Enable autoscaling"
                            description="Autoscaling automatically adds and removes worker (compute) nodes from the cluster based on resource requirments."
                        >
                            <FormWizardTextInput id="minimum-nodes" path="minimumNodes" label="Minimum nodes per zone" required />
                            <FormWizardTextInput id="maximim-nodes" path="maximumNodes" label="Maximum nodes per zone" required />
                        </FormWizardCheckbox>

                        <FormWizardLabels id="node-labels" path="nodeLabels" label="Extra node labels" />
                    </FormWizardSection>
                </FormWizardStep>
            </FormWizardStep>

            <FormWizardStep label="Networking">
                <FormWizardStep label="Configuration">
                    <FormWizardSection label="Networking configuration" description="Configure network access for your cluster." />
                    <FormWizardSection label="Virtual Private Cloud (VPC)">
                        <FormWizardCheckbox id="vpc" path="vpc" label="Install into an existing Virtual Private Cloud (VPC).">
                            <FormWizardTextInput id="existing-vpc-id" path="existingVpcId" label="Existing VPC ID" required />
                            <FormWizardCheckbox
                                id="private-link"
                                path="privateLink"
                                label="Use a PrivateLink"
                                description="To provide support, Red Hat Site Reliability Engineer (SRE) would connect to the cluster using only AWS PrivateLink endpoints instead of public endpoints. This option cannot be changed after a cluster is created."
                            ></FormWizardCheckbox>
                        </FormWizardCheckbox>
                    </FormWizardSection>
                    <FormWizardRadioGroup
                        id="cluster-privacy"
                        path="clusterPrivacy"
                        label="Cluster privacy"
                        // description="Install your cluster with all public or all private API endpoint and aplication routes. You can customize therre options after installation."
                    >
                        <FormWizardRadio
                            id="public"
                            value="public"
                            label="Public"
                            description="Access master API endpoint and application routes from the internet."
                        />
                        <FormWizardRadio
                            id="private"
                            value="private"
                            label="Private"
                            description="Access master API endpoint and application routes from durect private connections only."
                        />
                    </FormWizardRadioGroup>
                </FormWizardStep>

                <FormWizardStep label="VPC settings">
                    <FormWizardSection
                        label="Virtual Private Cloud (VPC) subnets"
                        description="the subnet list is based on the provided VPC ID. You must select at least 1 subnet from each availability zone."
                    >
                        <FormWizardSelect id="subnets" path="subnets" label="Subnets" options={['TODO']} required />
                    </FormWizardSection>
                </FormWizardStep>

                <FormWizardStep label="CIDR ranges">
                    <FormWizardSection label="CIDR ranges">
                        <FormWizardTextInput
                            id="machine-cidr"
                            path="machineCIDR"
                            label="Machine CIDR"
                            required
                            helperText="Range must be private. Maximum subnet mask is /23."
                        />
                        <FormWizardTextInput
                            id="service-cidr"
                            path="serviceCIDR"
                            label="Service CIDR"
                            required
                            helperText="Range must be private. Maximum subnet mask is /24."
                        />
                        <FormWizardTextInput
                            id="pod-cidr"
                            path="podCIDR"
                            label="Pod CIDR"
                            required
                            helperText="Range must be private. Maximum subnet mask ust allow at lease 32 nodes."
                        />
                        <FormWizardTextInput
                            id="host-prefix"
                            path="hostPrefix"
                            label="Host prefix"
                            required
                            helperText="Must be between /23 and /26."
                        />
                    </FormWizardSection>
                </FormWizardStep>
            </FormWizardStep>

            <FormWizardStep label="Updates">
                <FormWizardSection
                    label="Cluster updates"
                    description="High and critical security concerns (CVEs) will be patched automatically within 48 hours regardless of your chosen update strategy."
                >
                    <FormWizardRadioGroup id="cluster-update" path="clusterUpdate">
                        <FormWizardRadio
                            id="manual"
                            value="manual"
                            label="Manual"
                            description="Manually schedule the update. If it falls too far behind, it will update automatically beased on version support."
                        />
                        <FormWizardRadio
                            id="automatic"
                            value="automatic"
                            label="Automatic"
                            description="Clusters will be automatically updared beased on your defined day and start time when new versions are available."
                        >
                            <FormWizardTimeRange id="time" path="time" label="Select a day and start time" />
                        </FormWizardRadio>
                    </FormWizardRadioGroup>
                </FormWizardSection>

                <FormWizardSection
                    label="Node draining"
                    description="You may set a grace period for how long Pod Disruption Budget-protected workloads will be respected during upgrades. After this grace period, any workloads protected by Pod Disruption Budgets that have not been successfully drained from a node will be forcibly evicted."
                >
                    <FormWizardSelect id="grace-period" path="gracePeriod" label="Grace period" options={['TODO']} required />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Provisioning mode">
                <FormWizardSection
                    label="Provisioning mode"
                    prompt="Select role creation mode"
                    description="Choose the prefered mode for creating operator roles and OIDC provider."
                >
                    <FormWizardTiles id="creation-mode" path="creationMode">
                        <FormWizardTile
                            id="manual"
                            value="manual"
                            label="Manual"
                            description="Manually schedule the update. If it falls too far behind, it will update automatically beased on version support."
                        />
                        <FormWizardTile
                            id="automatic"
                            value="automatic"
                            label="Automatic"
                            description="Clusters will be automatically updared beased on your defined day and start time when new versions are available."
                        />
                    </FormWizardTiles>
                </FormWizardSection>

                <FormWizardSection
                    label="Node draining"
                    description="You may set a grace period for how long Pod Disruption Budget-protected workloads will be respected during upgrades. After this grace period, any workloads protected by Pod Disruption Budgets that have not been successfully drained from a node will be forcibly evicted."
                >
                    <FormWizardSelect id="grace-period" path="gracePeriod" label="Grace period" options={['TODO']} required />
                </FormWizardSection>
            </FormWizardStep>
        </FormWizardPage>
    )
}
