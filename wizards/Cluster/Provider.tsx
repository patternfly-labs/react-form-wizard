import { useHistory } from 'react-router-dom'
import { ArrayInput, Checkbox, KeyValue, Section, Select, SingleSelect, Step, TextArea, TextDetail, TextInput, WizardPage } from '../../src'
import { Catalog } from '../Catalog'
import { RouteE } from '../Routes'

export function ProviderCatalog() {
    const history = useHistory()
    return (
        <Catalog
            title="Provider"
            breadcrumbs={[{ label: 'Cluster' }, { label: 'Provider' }]}
            cards={[
                {
                    title: 'ALIBABA',
                    descriptions: ['Create and manage your clusters through ALIBABA cloud.'],
                    featureGroups: [
                        { title: 'Available Control Planes', features: ['Standalone'] },
                        { title: 'Comin Soon', features: ['Hosted'] },
                    ],
                    onClick: () => history.push(RouteE.ControlPlane),
                },
                {
                    title: 'Amazon Web Services',
                    descriptions: ['Create and manage your clusters through Amazon cloud.'],
                    featureGroups: [{ title: 'Available Control Planes', features: ['Hosted', 'Standalone', 'Managed'] }],
                    onClick: () => history.push(RouteE.ControlPlane),
                },
                {
                    title: 'Bare Metal',
                    descriptions: ['Create and manage your clusters on your bare metal machines.'],
                    featureGroups: [
                        { title: 'Available Control Planes', features: ['Hosted', 'Standalone'] },
                        { title: 'Comin Soon', features: ['Hosted'] },
                    ],
                    onClick: () => history.push(RouteE.ControlPlane),
                },
                {
                    title: 'Google Cloud',
                    descriptions: ['Create and manage your clusters through Google cloud.'],
                    featureGroups: [
                        { title: 'Available Control Planes', features: ['Standalone'] },
                        { title: 'Comin Soon', features: ['Hosted'] },
                    ],
                    onClick: () => history.push(RouteE.ControlPlane),
                },
                {
                    title: 'Microsoft Azure',
                    descriptions: ['Create and manage your clusters through Azure cloud.'],
                    featureGroups: [
                        { title: 'Available Control Planes', features: ['Standalone', 'Managed'] },
                        { title: 'Comin Soon', features: ['Hosted'] },
                    ],
                    onClick: () => history.push(RouteE.ControlPlane),
                },
                {
                    title: 'VIRT',
                    descriptions: ['Create and manage your clusters on virtual machines.'],
                    featureGroups: [{ title: 'Available Control Planes', features: ['VSphere', 'RHV', 'OpenStack'] }],
                    onClick: () => history.push(RouteE.ControlPlane),
                },
            ]}
        />
    )
}

export function ControlPlaneCatalog() {
    const history = useHistory()
    return (
        <Catalog
            title="Control Plane Type"
            breadcrumbs={[{ label: 'Cluster' }, { label: 'Provider' }, { label: 'Control plane' }]}
            cards={[
                {
                    title: 'Hosted',
                    descriptions: [
                        'Run OpenShift in a hyperscale manner with many control planes hosted on a central hosting service cluster.',
                    ],
                    featureGroups: [
                        {
                            title: 'Features',
                            features: [
                                'Lower cost clusters',
                                'Network and trust segment between control planes and workers',
                                'Rapid cluster creation',
                            ],
                        },
                        {
                            title: 'Available cluster types',
                            features: ['Hosted cluster'],
                        },
                    ],
                    onClick: () => history.push(RouteE.CreateCluster),
                },
                {
                    title: 'Standalone',
                    descriptions: ['Run an OpenShift cluster with dedicated control plane nodes.'],
                    featureGroups: [
                        {
                            title: 'Features',
                            features: [
                                'Increase resiliency with mulitple masters',
                                'Isolateion of workload creates secure profile',
                                'Dedicated control plane nodes',
                            ],
                        },
                        {
                            title: 'Available cluster types',
                            features: ['ACM Hub', 'Hosting service cluster'],
                        },
                    ],
                },
            ]}
            onBack={() => history.push(RouteE.Provider)}
        />
    )
}

export function HostsCatalog() {
    const history = useHistory()
    return (
        <Catalog
            title="Hosts"
            breadcrumbs={[{ label: 'Cluster' }, { label: 'Provider' }, { label: 'Control plane' }]}
            cards={[
                {
                    title: 'Use existing hosts',
                    descriptions: [
                        'Create a cluster from hosts that have been discoverred and made available via infrstructure environments.',
                    ],
                },
                {
                    title: 'Discover new hosts',
                    descriptions: [
                        'Discover new hosts when creating the cluster without prior need to create on infrstructure environment.',
                    ],
                },
                {
                    title: 'IPI existing?',
                },
            ]}
            onBack={() => history.push(RouteE.Provider)}
        />
    )
}

export function CreateCluster() {
    const history = useHistory()
    return (
        <WizardPage
            title="Create cluster"
            breadcrumb={[{ label: 'Cluster' }, { label: 'Provider' }, { label: 'Control plane' }, { label: 'Create cluster' }]}
            onSubmit={() => Promise.resolve(undefined)}
            onCancel={() => history.push(RouteE.ControlPlane)}
        >
            <Step label="Cluster details" id="cluster-details-step">
                <Section label="Cluster Details">
                    <TextInput label="Name" path="name" required />
                    <SingleSelect label="Cluster set" path="clusterSet" options={['cluster-set-1']} />
                    <TextInput label="Base domain" path="baseDomain" required />
                    <SingleSelect label="OpenShift version" path="openShiftVersion" options={['OpenShift 4.9.7']} required />
                    <Checkbox
                        label="Install single node OpenShift (SNO)"
                        path="sno"
                        helperText="SNO enabled you to install OpenShift using only one host."
                    />
                    <KeyValue label="Additional labels" path="additionalLabels" />
                    <TextArea label="Pull secret" path="pullSecret" required />
                </Section>
            </Step>

            <Step label="Automation" id="automation-step">
                <Section
                    label="Automation"
                    description="Choose an automation job template to automatically run Ansible jobs at differrent stages of a clusters's life sysle. To use this dfeture the Ansible Automation Platform Resource Operator must be installed."
                >
                    <Select label="Ansible Automation Template" path="ansibleAutomationtemplate" options={['ansible-template-1']} />
                </Section>
            </Step>

            <Step label="Networking" id="networking">
                <Section
                    label="Networking"
                    prompt="Enter networking options"
                    description="Configure network access for your cluster. One network is created by default."
                >
                    <Select path="networkType" label="Network type" options={['default']} required />

                    <ArrayInput
                        path="networks"
                        label="Networks"
                        placeholder="Add network"
                        collapsedContent={<TextDetail path="clusterCidr" placeholder="Expand to edit the network" />}
                    >
                        <TextInput path="clusterCidr" label="Cluster network CIDR" />
                        <TextInput path="hostPrefix" label="Network host prefix" />
                        <TextInput path="serviceCidr" label="Service network Cidr" />
                        <TextInput path="machienCidr" label="Machine CIDR" />
                    </ArrayInput>
                </Section>
            </Step>

            <Step label="Proxy" id="proxy">
                <Section
                    label="Proxy"
                    prompt="Configure a proxy"
                    description="Production environments can deny direct access to the Internet and instead have an HTTP or HTTPS proxy available. You can configure a new OpenShift Container Platform cluster to use a proxy by configuring the proxy settings."
                >
                    <Checkbox path="useProxy" label="Use proxy" />
                    <TextInput
                        path="httpProxy"
                        label="Http Proxy "
                        helperText="Requires this format: http://<username>:<pswd>@<ip>:<port>"
                        required
                        hidden={(item) => !item.useProxy}
                    />
                    <TextInput
                        path="httpsProxy"
                        label="Https Proxy"
                        helperText="Requires this format: https://<username>:<pswd>@<ip>:<port>"
                        required
                        hidden={(item) => !item.useProxy}
                    />
                    <TextInput
                        path="noProxy"
                        label="No Proxy"
                        helperText="By default, all cluster egress traffic is proxied, including calls to hosting cloud provider APIs. Add sites to No Proxy to bypass the proxy if necessary."
                        hidden={(item) => !item.useProxy}
                    />
                    <TextInput path="additionalTrustBundle" label="Additional Trust Bundle" hidden={(item) => !item.useProxy} />
                </Section>
            </Step>
        </WizardPage>
    )
}
