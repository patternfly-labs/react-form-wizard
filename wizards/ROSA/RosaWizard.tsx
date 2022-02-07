import {
    Checkbox,
    KeyValue,
    Radio,
    RadioGroup,
    Section,
    Select,
    Step,
    TextInput,
    Tile,
    Tiles,
    TimeRange,
    WizardCancel,
    WizardPage,
    WizardSubmit,
} from '../../src'

export function RosaWizard(props: { onSubmit: WizardSubmit; onCancel: WizardCancel }) {
    return (
        <WizardPage title="Create ROSA cluster" defaultData={{}} onSubmit={props.onSubmit} onCancel={props.onCancel}>
            <Step label="Account and roles" id="account">
                <Section
                    label="Account and roles"
                    prompt="Welcome to the Red Hat OpenShift service on AWS (ROSA)"
                    description="Red Hat OpenShift Service on AWS provides a model that allows Red Hat to deploy clusters into a customer's existing Amazon Web Service (AWS) account."
                >
                    <Select id="account" path="account" label="Associated AWS account" options={['TODO']} />
                    <Select id="role" path="role" label="OpenShift Cluster Manager role (ocm-role)" options={['TODO']} />
                </Section>
                <Section
                    label="Account roles ARNs"
                    description="The following roles were detected according to the associated account. The ARNs can be edited according to your preferences."
                >
                    <TextInput id="installer-role" path="installerRole" label="Installer role" required />
                    <TextInput id="support-role" path="supportRole" label="Support role" required />
                    <TextInput id="worker-role" path="workerRole" label="Worker role" required />
                    <TextInput id="control-plane-role" path="controlPlaneRole" label="Control plane role" required />
                </Section>
            </Step>

            <Step label="Cluster settings" id="cluster-settings">
                <Step label="Details" id="details">
                    <Section label="Cluster details" prompt="Enter the cluster details">
                        <TextInput id="cluster-name-role" path="clusterName" label="Cluster name" required />
                        <Checkbox id="use-roles-prefix" path="useRolesPrefix" label="Use operator roles prefix">
                            <TextInput
                                id="roles-prefix"
                                path="rolesPrefix"
                                label="Operator roles prefix"
                                required
                                helperText="Maximum 32 characters."
                            />
                        </Checkbox>
                        <Select id="version" path="version" label="Version" options={['TODO']} required />
                        <Select id="region" path="region" label="Region" options={['TODO']} required />
                        <RadioGroup id="availability" path="availability" label="Availability">
                            <Radio id="single-zone" value="single-zone" label="Single zone" />
                            <Radio id="multi-zone" value="multi-zone" label="Multi zone" />
                        </RadioGroup>
                        {/* </Section> */}

                        {/* <Section label="Monitoring"> */}
                        <Checkbox
                            id="monitoring"
                            path="monitoring"
                            title="Monitoring"
                            label="Enable use workload monitoring"
                            helperText="Monitor you own projects in isolation from Red Hat Site reliability (SRE) platform metrics."
                        />
                    </Section>

                    <Section
                        label="Encryption"
                        description="Add additional encryption to your cluster. Note that cloud storage already encrypts storage as rest."
                    >
                        <Checkbox
                            id="etcd-encryption"
                            path="etcdEncryption"
                            label="Enable etcd encryption"
                            helperText="Add another layer of data security to your cluster."
                        />
                        <Checkbox
                            id="ebs-encryption"
                            path="ebsEncryption"
                            label="Encrypt EBS with customer keys"
                            helperText="Use your own AWS KMS keys to enable encryption of AWS EBS volumes for the cluster."
                        />
                    </Section>
                </Step>

                <Step label="Machine pool" id="machine-pool">
                    <Section
                        label="Default machine pool"
                        description="Select a compute node instance type and count your default machine pool."
                    >
                        <Select id="instance-type" path="instanceType" label="Compute node instance type" options={['TODO']} required />
                        <Select id="availability-zones" path="availabilityZones" label="Availability zones" options={['TODO']} required />

                        <Checkbox
                            id="autoscaling"
                            path="autoscaling"
                            title="Autoscaling"
                            label="Enable autoscaling"
                            helperText="Autoscaling automatically adds and removes worker (compute) nodes from the cluster based on resource requirments."
                        >
                            <TextInput id="minimum-nodes" path="minimumNodes" label="Minimum nodes per zone" required />
                            <TextInput id="maximim-nodes" path="maximumNodes" label="Maximum nodes per zone" required />
                        </Checkbox>

                        <KeyValue id="node-labels" path="nodeLabels" label="Extra node labels" />
                    </Section>
                </Step>
            </Step>

            <Step label="Networking" id="networking">
                <Step label="Configuration" id="configuration">
                    <Section label="Networking configuration" description="Configure network access for your cluster.">
                        <Checkbox
                            id="vpc"
                            path="vpc"
                            title="Virtual Private Cloud (VPC) subnets"
                            label="Install into an existing Virtual Private Cloud (VPC)."
                        >
                            <TextInput id="existing-vpc-id" path="existingVpcId" label="Existing VPC ID" required />
                            <Checkbox
                                id="private-link"
                                path="privateLink"
                                label="Use a PrivateLink"
                                helperText="To provide support, Red Hat Site Reliability Engineer (SRE) would connect to the cluster using only AWS PrivateLink endpoints instead of public endpoints. This option cannot be changed after a cluster is created."
                            ></Checkbox>
                        </Checkbox>
                        <RadioGroup
                            id="cluster-privacy"
                            path="clusterPrivacy"
                            label="Cluster privacy"
                            // description="Install your cluster with all public or all private API endpoint and aplication routes. You can customize therre options after installation."
                        >
                            <Radio
                                id="public"
                                value="public"
                                label="Public"
                                description="Access master API endpoint and application routes from the internet."
                            />
                            <Radio
                                id="private"
                                value="private"
                                label="Private"
                                description="Access master API endpoint and application routes from durect private connections only."
                            />
                        </RadioGroup>
                    </Section>
                </Step>

                <Step label="VPC settings" id="vpc-settings">
                    <Section
                        label="Virtual Private Cloud (VPC) subnets"
                        description="the subnet list is based on the provided VPC ID. You must select at least 1 subnet from each availability zone."
                    >
                        <Select id="subnets" path="subnets" label="Subnets" options={['TODO']} required />
                    </Section>
                </Step>

                <Step label="CIDR ranges" id="cidr-ranges">
                    <Section label="CIDR ranges">
                        <TextInput
                            id="machine-cidr"
                            path="machineCIDR"
                            label="Machine CIDR"
                            required
                            helperText="Range must be private. Maximum subnet mask is /23."
                        />
                        <TextInput
                            id="service-cidr"
                            path="serviceCIDR"
                            label="Service CIDR"
                            required
                            helperText="Range must be private. Maximum subnet mask is /24."
                        />
                        <TextInput
                            id="pod-cidr"
                            path="podCIDR"
                            label="Pod CIDR"
                            required
                            helperText="Range must be private. Maximum subnet mask ust allow at lease 32 nodes."
                        />
                        <TextInput
                            id="host-prefix"
                            path="hostPrefix"
                            label="Host prefix"
                            required
                            helperText="Must be between /23 and /26."
                        />
                    </Section>
                </Step>
            </Step>

            <Step label="Updates" id="updates">
                <Section
                    label="Cluster updates"
                    description="High and critical security concerns (CVEs) will be patched automatically within 48 hours regardless of your chosen update strategy."
                >
                    <RadioGroup id="cluster-update" path="clusterUpdate">
                        <Radio
                            id="manual"
                            value="manual"
                            label="Manual"
                            description="Manually schedule the update. If it falls too far behind, it will update automatically beased on version support."
                        />
                        <Radio
                            id="automatic"
                            value="automatic"
                            label="Automatic"
                            description="Clusters will be automatically updared beased on your defined day and start time when new versions are available."
                        >
                            <Select
                                id="day"
                                path="day"
                                label="Day"
                                options={['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Firday', 'Saturday']}
                                required
                            />
                            <TimeRange id="time" path="time" label="Start time" />
                        </Radio>
                    </RadioGroup>
                </Section>

                <Section
                    label="Node draining"
                    description="You may set a grace period for how long Pod Disruption Budget-protected workloads will be respected during upgrades. After this grace period, any workloads protected by Pod Disruption Budgets that have not been successfully drained from a node will be forcibly evicted."
                >
                    <Select id="grace-period" path="gracePeriod" label="Grace period" options={['Every hour', 'Every day']} required />
                </Section>
            </Step>

            <Step label="Provisioning mode" id="provisioning-mode">
                <Section
                    label="Provisioning mode"
                    prompt="Select role creation mode"
                    description="Choose the prefered mode for creating operator roles and OIDC provider."
                >
                    <Tiles id="creation-mode" path="creationMode">
                        <Tile
                            id="manual"
                            value="manual"
                            label="Manual"
                            description="Manually schedule the update. If it falls too far behind, it will update automatically beased on version support."
                        />
                        <Tile
                            id="automatic"
                            value="automatic"
                            label="Automatic"
                            description="Clusters will be automatically updared beased on your defined day and start time when new versions are available."
                        />
                    </Tiles>
                </Section>
            </Step>
        </WizardPage>
    )
}
