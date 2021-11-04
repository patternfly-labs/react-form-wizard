import { InputArray, InputLabels, InputPage, InputSection, InputSelect, InputStep, InputText, InputTextDetail } from '../../src'
import DeploymentTemplate from './Deployment.hbs'

export function DeploymentForm() {
    return (
        <InputPage
            title="Create deployment"
            description="A deployment provides declarative updates for pods and replica sets."
            template={DeploymentTemplate}
            breadcrumb={[{ label: 'Home', to: '..' }, { label: 'Kubernetes' }]}
        >
            <InputStep label="Metadata">
                <InputSection label="Metadata" prompt="Enter the details of the deployment">
                    <InputText
                        id="name"
                        label="Name"
                        placeholder="Enter name"
                        required
                        helperText="The name of the deployment must be unique in the namespace."
                    />
                    <InputSelect
                        id="namespace"
                        label="Namespace"
                        helperText="The namespace on the hub cluster where the resources will be created."
                        options={['default']}
                        placeholder="Select namespace"
                        required
                    />
                    <InputLabels
                        id="labels"
                        label="Labels"
                        placeholder="Enter labels"
                        helperText="Labels are key/value pairs that are attached to objects, such as pods. Labels are intended to be used to specify identifying attributes of objects that are meaningful and relevant to users, but do not directly imply semantics to the core system. Labels can be used to organize and to select subsets of objects."
                    />
                </InputSection>
            </InputStep>

            <InputStep label="Replicas">
                <InputSection
                    label="Replicas"
                    prompt="Enter the replica count"
                    description="A deployment creates a replica set which scales the number of pods for the deployment."
                >
                    <InputText
                        id="replicas"
                        label="Replicas"
                        placeholder="Enter replica count"
                        helperText="The replica count indicates how many pod replicas to create as part of the deployment."
                        required
                    />
                </InputSection>
            </InputStep>

            {/* <InputStep label="Update strategy">
                <InputSection label="Update strategy" prompt="Configure the strategy for deployment updates">
                    <InputSelect id="strategy" label="Strategy" options={['rollingUpdate']} placeholder="Select strategy" />
                    <InputText id="strategy.maxSurge" label="Max surge" placeholder="Enter name" />
                    <InputText id="strategy.maxUnavailable" label="Max unavailable" placeholder="Enter name" />
                </InputSection>
            </InputStep> */}

            {/* <InputStep label="Resources">
                <InputSection
                    label="Resources requests"
                    prompt="Enter the resource requests"
                    description="Resource requests are used by Kubernetes to determine the node placement of pods based on calculated available resources on those nodes."
                >
                    <InputText id="requests.cpu" label="CPU request" placeholder="Enter cpu request" />
                    <InputText id="requests.memory" label="Memory request" placeholder="Enter memory request" />
                </InputSection>
                <InputSection
                    label="Resources limits"
                    prompt="Enter the resource limits"
                    description="Resource limits are used by Kubernetes to limit the amount of CPU and memory pods can use."
                >
                    <InputText id="requests.cpu" label="CPU limit" placeholder="Enter cpu limit" />
                    <InputText id="requests.memory" label="Memory limit" placeholder="Enter memory limit" />
                </InputSection>
            </InputStep> */}

            <InputStep label="Containers">
                <InputSection label="Containers" description="Each deployment pod can be made up of multiple containers.">
                    <InputArray
                        id="containers"
                        placeholder="Add container"
                        collapsedText={<InputTextDetail id="name" placeholder="Expand to enter the container details" />}
                    >
                        <InputText id="name" label="Name" />
                        <InputText id="image" label="Image" />
                        <InputArray
                            id="ports"
                            label="Ports"
                            placeholder="Add port"
                            collapsedText={<InputTextDetail id="containerPort" placeholder="Expand to enter the port" />}
                            sortable
                        >
                            <InputText id="containerPort" label="Port" required />
                        </InputArray>
                    </InputArray>
                </InputSection>
            </InputStep>
        </InputPage>
    )
}
