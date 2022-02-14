import { Split, SplitItem } from '@patternfly/react-core'
import { CheckIcon } from '@patternfly/react-icons'
import { ReactNode } from 'react'
import { useHistory } from 'react-router-dom'
import { EditMode } from '../../src'
import { YamlToObject } from '../../src/components/YamlEditor'
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
    return (
        <DashboardPage title="Policy examples">
            <DashboardCard title="Create policy" route={RouteE.CreatePolicy}>
                <Checked>Create a new policy.</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyLimitClusterAdmin}>
                <Checked>Limit Cluster Admin</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyRole}>
                <Checked>Role</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyRoleBinding}>
                <Checked>Role Binding</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyComplianceOperatorInstall}>
                <Checked>Compliance Operator Install</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyComplianceOperatorCisScan}>
                <Checked>Compliance Operator Cis Scan</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyComplianceOperatorE8Scan}>
                <Checked>Compliance Operator E8 Scan</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyGatekeeperOperatorDownstream}>
                <Checked>Gatekeeper Operator Downstream</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyNamespace}>
                <Checked>Namespace</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyPod}>
                <Checked>Pod</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyCertificate}>
                <Checked>Certificate</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyEtcdEncryption}>
                <Checked>Etcd Encryption</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyLimitMemory}>
                <Checked>Limit Memory</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyImageManifestVuln}>
                <Checked>Image Manifest Vuln</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyPsp}>
                <Checked>Psp</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy" route={RouteE.EditPolicyScc}>
                <Checked>Scc</Checked>
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
