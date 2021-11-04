import specCertmgmtexp from './spec-certmgmtexp.yaml'
import specClusteradminrole from './spec-clusteradminrole.yaml'
import specCompOperator from './spec-comp-operator.yaml'
import specContainerMemLimit from './spec-container-mem-limit.yaml'
import specEtcdEncryption from './spec-etcd-encryption.yaml'
import specGatekeeper from './spec-gatekeeper.yaml'
import specImagemanifestvuln from './spec-imagemanifestvuln.yaml'
import specNamespace from './spec-namespace.yaml'
import specPodExists from './spec-pod-exists.yaml'
import specPodSecurity from './spec-pod-security.yaml'
import specRolebinding from './spec-rolebinding.yaml'
import specRoles from './spec-roles.yaml'
import specScc from './spec-scc.yaml'
import YAML from 'yaml'

export const Specifications = [
    specCertmgmtexp,
    specClusteradminrole,
    specCompOperator,
    specContainerMemLimit,
    specEtcdEncryption,
    specGatekeeper,
    specImagemanifestvuln,
    specNamespace,
    specPodExists,
    specPodSecurity,
    specRolebinding,
    specRoles,
    specScc,
].map((specification) => YAML.parse(specification))
