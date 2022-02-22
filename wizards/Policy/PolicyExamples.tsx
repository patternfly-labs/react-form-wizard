import { Split, SplitItem } from '@patternfly/react-core'
import { CheckIcon } from '@patternfly/react-icons'
import { ReactNode } from 'react'
import { useHistory } from 'react-router-dom'
import { EditMode } from '../../src'
import { YamlToObject } from '../../src/components/YamlEditor'
import { Catalog } from '../Catalog'
import { clusterSetBindings, namespaces, placementRules, placements, policies } from '../common/test-data'
import { onSubmit } from '../common/utils'
import { DashboardCard, DashboardPage } from '../Dashboard'
import { RouteE } from '../Routes'
import { PolicyWizard } from './PolicyWizard'
import editPolicyLimitClusterAdmin from './stable/AC-Access-Control/policy-limitclusteradmin.yaml'
import editPolicyRole from './stable/AC-Access-Control/policy-role.yaml'
import editPolicyRoleBinding from './stable/AC-Access-Control/policy-rolebinding.yaml'
import editPolicyComplianceOperatorInstall from './stable/CA-Security-Assessment-and-Authorization/policy-compliance-operator-install.yaml'
import editPolicyComplianceOperatorCisScan from './stable/CM-Configuration-Management/policy-compliance-operator-cis-scan.yaml'
import editPolicyComplianceOperatorE8Scan from './stable/CM-Configuration-Management/policy-compliance-operator-e8-scan.yaml'
import editPolicyGatekeeperOperatorDownstream from './stable/CM-Configuration-Management/policy-gatekeeper-operator-downstream.yaml'
import editPolicyNamespace from './stable/CM-Configuration-Management/policy-namespace.yaml'
import editPolicyPod from './stable/CM-Configuration-Management/policy-pod.yaml'
import editPolicyCertificate from './stable/SC-System-and-Communications-Protection/policy-certificate.yaml'
import editPolicyEtcdEncryption from './stable/SC-System-and-Communications-Protection/policy-etcdencryption.yaml'
import editPolicyLimitMemory from './stable/SC-System-and-Communications-Protection/policy-limitmemory.yaml'
import editPolicyPsp from './stable/SC-System-and-Communications-Protection/policy-psp.yaml'
import editPolicyScc from './stable/SC-System-and-Communications-Protection/policy-scc.yaml'
import editPolicyImageManifestVuln from './stable/SI-System-and-Information-Integrity/policy-imagemanifestvuln.yaml'

export function onCancel(history: { push: (location: string) => void }) {
    history.push(`./${RouteE.Policy}`)
}

function Checked(props: { children: ReactNode }) {
    return (
        <Split hasGutter>
            <SplitItem>
                <CheckIcon color="green" />
            </SplitItem>
            <SplitItem>{props.children}</SplitItem>
        </Split>
    )
}

export function PolicyExamples() {
    const history = useHistory()
    return (
        <Catalog
            title="Policy Wizard Examples"
            breadcrumbs={[{ label: 'Example Wizards', to: RouteE.Wizards }, { label: 'Policy Wizard Examples' }]}
            filterGroups={[
                {
                    id: 'security-groups',
                    label: 'Security Groups',
                    filters: [
                        { value: 'Access Control' },
                        { value: 'Security Assessment and Authorization' },
                        { value: 'Configuration Management' },
                        { value: 'System and Communications Protection' },
                        { value: 'System and Information Integrity' },
                    ],
                },
            ]}
            cards={[
                {
                    title: 'Create Policy',
                    descriptions: [
                        'A policy generates reports and validates cluster compliance based on specified security standards, categories, and controls',
                    ],
                    onClick: () => history.push(RouteE.CreatePolicy),
                },
                {
                    title: 'Edit Limit Cluster Admin Policy',
                    featureGroups: [{ title: 'Policies', features: ['Limit Cluster Admin'] }],
                    labels: ['Access Control'],
                    onClick: () => history.push(RouteE.EditPolicyLimitClusterAdmin),
                },
                {
                    title: 'Edit Role Policy',
                    featureGroups: [{ title: 'Policies', features: ['Role'] }],
                    labels: ['Access Control'],
                    onClick: () => history.push(RouteE.EditPolicyRole),
                },
                {
                    title: 'Edit Role Binding Policy',
                    featureGroups: [{ title: 'Policies', features: ['Role Binding'] }],
                    labels: ['Access Control'],
                    onClick: () => history.push(RouteE.EditPolicyRoleBinding),
                },
                {
                    title: 'Edit Compliance Operator Install Policy',
                    featureGroups: [{ title: 'Policies', features: ['Compliance Operator Install'] }],
                    labels: ['Security Assessment and Authorization'],
                    onClick: () => history.push(RouteE.EditPolicyComplianceOperatorInstall),
                },
                {
                    title: 'Edit Compliance Operator Cis Scan Policy',
                    featureGroups: [{ title: 'Policies', features: ['Compliance Operator Cis Scan'] }],
                    labels: ['Configuration Management'],
                    onClick: () => history.push(RouteE.EditPolicyComplianceOperatorCisScan),
                },
                {
                    title: 'Edit Compliance Operator E8 Scan Policy',
                    featureGroups: [{ title: 'Policies', features: ['Compliance Operator E8 Scan'] }],
                    labels: ['Configuration Management'],
                    onClick: () => history.push(RouteE.EditPolicyComplianceOperatorE8Scan),
                },
                {
                    title: 'Edit Gatekeeper Operator Downstream Policy',
                    featureGroups: [{ title: 'Policies', features: ['Gatekeeper Operator Downstream'] }],
                    labels: ['Configuration Management'],
                    onClick: () => history.push(RouteE.EditPolicyGatekeeperOperatorDownstream),
                },
                {
                    title: 'Edit Namespace Policy',
                    featureGroups: [{ title: 'Policies', features: ['Namespace'] }],
                    labels: ['Configuration Management'],
                    onClick: () => history.push(RouteE.EditPolicyNamespace),
                },
                {
                    title: 'Edit Pod Policy',
                    featureGroups: [{ title: 'Policies', features: ['Pod'] }],
                    labels: ['Configuration Management'],
                    onClick: () => history.push(RouteE.EditPolicyPod),
                },
                {
                    title: 'Edit Certificate Policy',
                    featureGroups: [{ title: 'Policies', features: ['Certificate'] }],
                    labels: ['System and Communications Protection'],
                    onClick: () => history.push(RouteE.EditPolicyCertificate),
                },
                {
                    title: 'Edit Etcd Encryption Policy',
                    featureGroups: [{ title: 'Policies', features: ['Etcd Encryption'] }],
                    labels: ['System and Communications Protection'],
                    onClick: () => history.push(RouteE.EditPolicyEtcdEncryption),
                },
                {
                    title: 'Edit Limit Memory Policy',
                    featureGroups: [{ title: 'Policies', features: ['Limit Memory'] }],
                    labels: ['System and Communications Protection'],
                    onClick: () => history.push(RouteE.EditPolicyLimitMemory),
                },
                {
                    title: 'Edit Psp Policy',
                    featureGroups: [{ title: 'Policies', features: ['Psp'] }],
                    labels: ['System and Communications Protection'],
                    onClick: () => history.push(RouteE.EditPolicyPsp),
                },
                {
                    title: 'Edit Security Context Constraints Policy',
                    featureGroups: [{ title: 'Policies', features: ['Security Context Constraints'] }],
                    labels: ['System and Communications Protection'],
                    onClick: () => history.push(RouteE.EditPolicyScc),
                },
                {
                    title: 'Edit Image Manifest Vuln Policy',
                    featureGroups: [{ title: 'Policies', features: ['Image Manifest Vuln'] }],
                    labels: ['System and Information Integrity'],
                    onClick: () => history.push(RouteE.EditPolicyImageManifestVuln),
                },
            ]}
        />
    )
}

export function PolicyExamples2() {
    return (
        <DashboardPage title="Policy examples">
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyImageManifestVuln}>
                <Checked>Image Manifest Vuln</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyPsp}>
                <Checked>Psp</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyScc}>
                <Checked>Security Context Constraints</Checked>
            </DashboardCard>
        </DashboardPage>
    )
}

export function CreatePolicy() {
    const history = useHistory()
    return (
        <PolicyWizard
            title="Create policy"
            namespaces={namespaces}
            policies={policies}
            placements={placements}
            placementRules={placementRules}
            clusterSetBindings={clusterSetBindings}
            onSubmit={onSubmit}
            onCancel={() => onCancel(history)}
        />
    )
}

export function EditPolicy(props: { yaml: string }) {
    const history = useHistory()
    return (
        <PolicyWizard
            namespaces={namespaces}
            policies={policies}
            clusterSetBindings={clusterSetBindings}
            placements={placements}
            placementRules={placementRules}
            title="Edit policy set"
            onSubmit={onSubmit}
            onCancel={() => onCancel(history)}
            editMode={EditMode.Edit}
            resources={YamlToObject(props.yaml)}
        />
    )
}

export function EditPolicyLimitClusterAdmin() {
    return <EditPolicy yaml={editPolicyLimitClusterAdmin} />
}

export function EditPolicyRole() {
    return <EditPolicy yaml={editPolicyRole} />
}

export function EditPolicyRoleBinding() {
    return <EditPolicy yaml={editPolicyRoleBinding} />
}

export function EditPolicyComplianceOperatorInstall() {
    return <EditPolicy yaml={editPolicyComplianceOperatorInstall} />
}

export function EditPolicyComplianceOperatorCisScan() {
    return <EditPolicy yaml={editPolicyComplianceOperatorCisScan} />
}

export function EditPolicyComplianceOperatorE8Scan() {
    return <EditPolicy yaml={editPolicyComplianceOperatorE8Scan} />
}

export function EditPolicyGatekeeperOperatorDownstream() {
    return <EditPolicy yaml={editPolicyGatekeeperOperatorDownstream} />
}

export function EditPolicyNamespace() {
    return <EditPolicy yaml={editPolicyNamespace} />
}

export function EditPolicyPod() {
    return <EditPolicy yaml={editPolicyPod} />
}

export function EditPolicyCertificate() {
    return <EditPolicy yaml={editPolicyCertificate} />
}

export function EditPolicyEtcdEncryption() {
    return <EditPolicy yaml={editPolicyEtcdEncryption} />
}

export function EditPolicyLimitMemory() {
    return <EditPolicy yaml={editPolicyLimitMemory} />
}

export function EditPolicyImageManifestVuln() {
    return <EditPolicy yaml={editPolicyImageManifestVuln} />
}

export function EditPolicyPsp() {
    return <EditPolicy yaml={editPolicyPsp} />
}

export function EditPolicyScc() {
    return <EditPolicy yaml={editPolicyScc} />
}
