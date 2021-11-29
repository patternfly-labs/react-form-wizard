import {
    FormWizardArrayInput,
    FormWizardLabels,
    FormWizardPage,
    FormWizardSection,
    FormWizardSelect,
    FormWizardStep,
    FormWizardTextDetail,
    FormWizardTextInput,
} from '../../src'
import DeploymentTemplate from './Deployment.hbs'

export function DeploymentForm() {
    return (
        <FormWizardPage
            title="Create deployment"
            description="A deployment provides declarative updates for pods and replica sets."
            template={DeploymentTemplate}
            breadcrumb={[{ label: 'Home', to: '.' }, { label: 'Kubernetes' }]}
        >
            <FormWizardStep label="Metadata">
                <FormWizardSection label="Metadata" prompt="Enter the details of the deployment">
                    <FormWizardTextInput
                        id="name"
                        label="Name"
                        placeholder="Enter name"
                        required
                        helperText="The name of the deployment must be unique in the namespace."
                    />
                    <FormWizardSelect
                        id="namespace"
                        label="Namespace"
                        helperText="The namespace on the hub cluster where the resources will be created."
                        options={['default']}
                        placeholder="Select namespace"
                        required
                    />
                    <FormWizardLabels
                        id="labels"
                        label="Labels"
                        placeholder="Enter labels"
                        helperText="Labels are key/value pairs that are attached to objects, such as pods. Labels are intended to be used to specify identifying attributes of objects that are meaningful and relevant to users, but do not directly imply semantics to the core system. Labels can be used to organize and to select subsets of objects."
                    />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Replicas">
                <FormWizardSection
                    label="Replicas"
                    prompt="Enter the replica count"
                    description="A deployment creates a replica set which scales the number of pods for the deployment."
                >
                    <FormWizardTextInput
                        id="replicas"
                        label="Replicas"
                        placeholder="Enter replica count"
                        helperText="The replica count indicates how many pod replicas to create as part of the deployment."
                        required
                    />
                </FormWizardSection>
            </FormWizardStep>

            {/* <FormWizardStep label="Update strategy">
                <FormWizardSection label="Update strategy" prompt="Configure the strategy for deployment updates">
                    <FormWizardSelect id="strategy" label="Strategy" options={['rollingUpdate']} placeholder="Select strategy" />
                    <FormWizardText id="strategy.maxSurge" label="Max surge" placeholder="Enter name" />
                    <FormWizardText id="strategy.maxUnavailable" label="Max unavailable" placeholder="Enter name" />
                </FormWizardSection>
            </InputStep> */}

            {/* <FormWizardStep label="Resources">
                <FormWizardSection
                    label="Resources requests"
                    prompt="Enter the resource requests"
                    description="Resource requests are used by Kubernetes to determine the node placement of pods based on calculated available resources on those nodes."
                >
                    <FormWizardText id="requests.cpu" label="CPU request" placeholder="Enter cpu request" />
                    <FormWizardText id="requests.memory" label="Memory request" placeholder="Enter memory request" />
                </FormWizardSection>
                <FormWizardSection
                    label="Resources limits"
                    prompt="Enter the resource limits"
                    description="Resource limits are used by Kubernetes to limit the amount of CPU and memory pods can use."
                >
                    <FormWizardText id="requests.cpu" label="CPU limit" placeholder="Enter cpu limit" />
                    <FormWizardText id="requests.memory" label="Memory limit" placeholder="Enter memory limit" />
                </FormWizardSection>
            </InputStep> */}

            <FormWizardStep label="Containers">
                <FormWizardSection label="Containers" description="Each deployment pod can be made up of multiple containers.">
                    <FormWizardArrayInput
                        id="containers"
                        placeholder="Add container"
                        collapsedText={<FormWizardTextDetail id="name" placeholder="Expand to enter the container details" />}
                    >
                        <FormWizardTextInput id="name" label="Name" />
                        <FormWizardTextInput id="image" label="Image" />
                        <FormWizardArrayInput
                            id="ports"
                            label="Ports"
                            placeholder="Add port"
                            collapsedText={<FormWizardTextDetail id="containerPort" placeholder="Expand to enter the port" />}
                            sortable
                        >
                            <FormWizardTextInput id="containerPort" label="Port" required />
                        </FormWizardArrayInput>
                    </FormWizardArrayInput>
                </FormWizardSection>
            </FormWizardStep>
        </FormWizardPage>
    )
}
