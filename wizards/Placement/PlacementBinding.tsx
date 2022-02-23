import { ArrayInput, ItemSelector, Select, TextInput } from '../../src'
import { IResource } from '../common/resource'

export const PlacementBindingApiVersion = 'policy.open-cluster-management.io/v1'
export const PlacementBindingKind = 'PlacementBinding'

export function PlacementBindings(props: {
    showPlacements: boolean
    showPlacementRules: boolean
    showPlacementBindings: boolean
    placementCount: number
    placementRuleCount: number
    placementBindingCount: number
    bindingSubjectKind: string
    bindingSubjectApiGroup?: string
    existingPlacements: IResource[]
    existingPlacementRules: IResource[]
}) {
    if (!props.showPlacements && props.placementBindingCount === 1) {
        return (
            <ItemSelector selectKey="kind" selectValue="PlacementBinding">
                <Select
                    path="placementRef.name"
                    label="Placement"
                    required
                    hidden={(binding) => binding.placementRef?.kind !== 'Placement'}
                    options={props.existingPlacements.map((placement) => placement.metadata?.name ?? '')}
                />
                <Select
                    path="placementRef.name"
                    label="Placement rule"
                    required
                    hidden={(binding) => binding.placementRef?.kind !== 'PlacementRule'}
                    options={props.existingPlacementRules.map((placement) => placement.metadata?.name ?? '')}
                />
            </ItemSelector>
        )
    }
    return (
        <ArrayInput
            id="placement-bindings"
            label="Placement bindings"
            helperText="To apply a resource to a cluster, the placement must be bound to the resource using a placement binding."
            path={null}
            filter={(resource) => resource.kind === 'PlacementBinding'}
            placeholder="Add placement binding"
            collapsedContent="metadata.name"
            collapsedPlaceholder="Expand to enter binding"
            defaultCollapsed
            isSection
            // hidden={() => {
            //     if (editMode === EditMode.Create) return true
            //     return !props.hasPlacement && !props.hasPlacementRules && !props.hasPlacementBindings
            // }}
            newValue={{
                apiVersion: 'policy.open-cluster-management.io/v1',
                kind: 'PlacementBinding',
                metadata: {},
                placementRef: { apiGroup: 'cluster.open-cluster-management.io', kind: 'Placement' },
                subjects: [{ apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind }],
            }}
            // dropdownItems={
            //     props.hasPlacementRules
            //         ? [
            //               {
            //                   label: 'Add placement binding',
            //                   action: () => ({
            //                       apiVersion: 'policy.open-cluster-management.io/v1',
            //                       kind: 'PlacementBinding',
            //                       metadata: {},
            //                       placementRef: { apiGroup: 'cluster.open-cluster-management.io', kind: 'Placement' },
            //                       subjects: [{ apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind }],
            //                   }),
            //               },
            //               {
            //                   label: 'Add placement rule binding',
            //                   action: () => ({
            //                       apiVersion: 'policy.open-cluster-management.io/v1',
            //                       kind: 'PlacementBinding',
            //                       metadata: {},
            //                       placementRef: { apiGroup: 'apps.open-cluster-management.io', kind: 'PlacementRule' },
            //                       subjects: [{ apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind }],
            //                   }),
            //               },
            //           ]
            //         : undefined
            // }
        >
            <TextInput path="metadata.name" label="Binding name" required />
            {/* <TextInput path="placementRef.name" label="Placement name" required readonly={true} /> */}
            <Select
                path="placementRef.kind"
                label="Placement kind"
                helperText="The placement rule used to select clusters for placement."
                required
                options={['Placement', 'PlacementRule']}
            />
            <Select
                path="placementRef.name"
                label="Placement"
                helperText="The placement used to select clusters."
                required
                hidden={(binding) => binding.placementRef?.kind !== 'Placement'}
                options={props.existingPlacements.map((placement) => placement.metadata?.name ?? '')}
            />
            <Select
                path="placementRef.name"
                label="Placement rule"
                helperText="The placement rule used to select clusters for placement."
                required
                hidden={(binding) => binding.placementRef?.kind !== 'PlacementRule'}
                options={props.existingPlacementRules.map((placement) => placement.metadata?.name ?? '')}
            />
            <ArrayInput
                path="subjects"
                label="Subjects"
                helperText="Placement bindings can have multiple subjects which the placement is applied to."
                placeholder="Add placement subject"
                collapsedContent="name"
                collapsedPlaceholder="Expand to enter subject"
                newValue={{ apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind }}
            >
                <Select path="kind" label="Subject kind" required options={['PolicySet', 'Policy']} />
                <TextInput path="name" label="Subject name" required />
            </ArrayInput>
        </ArrayInput>
    )
}
