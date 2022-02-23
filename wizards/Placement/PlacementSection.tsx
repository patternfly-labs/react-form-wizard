import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core'
import { useEffect, useState } from 'react'
import { DetailsHidden, EditMode, Section } from '../../src'
import { useData } from '../../src/contexts/DataContext'
import { useEditMode } from '../../src/contexts/EditModeContext'
import { useSetHasInputs } from '../../src/contexts/HasInputsProvider'
import { useItem } from '../../src/contexts/ItemContext'
import { IResource } from '../common/resource'
import { IClusterSetBinding } from './ClusterSetBinding'
import { PlacementApiVersion, Placements } from './Placement'
import { PlacementBindingApiVersion, PlacementBindings } from './PlacementBinding'
import { PlacementRules } from './PlacementRule'

export function PlacementSection(props: {
    bindingSubjectKind: string
    bindingSubjectApiGroup: string
    existingPlacements: IResource[]
    existingPlacementRules: IResource[]
    existingclusterSetBindings: IClusterSetBinding[]
    defaultPlacementType: 'placement' | 'placement-rule'
}) {
    const { update } = useData()
    const resources = useItem() as IResource[]
    const editMode = useEditMode()

    const [showPlacements, setShowPlacements] = useState(props.defaultPlacementType === 'placement')
    const [showPlacementRules, setShowPlacementRules] = useState(props.defaultPlacementType === 'placement-rule')
    const [showPlacementBindings, setShowPlacementBindings] = useState(false)

    const [placementCount, setPlacementCount] = useState(0)
    const [placementRuleCount, setPlacementRuleCount] = useState(0)
    const [placementBindingCount, setPlacementBindingCount] = useState(0)

    useEffect(() => {
        setPlacementCount(resources?.filter((resource) => resource.kind === 'Placement').length)
        setPlacementRuleCount(resources?.filter((resource) => resource.kind === 'PlacementRule').length)
        setPlacementBindingCount(resources?.filter((resource) => resource.kind === 'PlacementBinding').length)
    }, [resources, setPlacementCount, setPlacementRuleCount, setPlacementBindingCount])

    useEffect(() => {
        if (placementCount > 0) setShowPlacements(true)
        if (placementRuleCount > 0) setShowPlacementRules(true)
        if (placementCount + placementRuleCount > 1) setShowPlacementBindings(true)
        if (placementCount + placementRuleCount === 0 && placementBindingCount > 0) setShowPlacementBindings(true)
    }, [placementCount, placementRuleCount, setShowPlacements, setShowPlacementRules, setShowPlacementBindings, placementBindingCount])

    useEffect(() => {
        const placementCount = resources?.filter((resource) => resource.kind === 'Placement').length
        const placementRuleCount = resources?.filter((resource) => resource.kind === 'PlacementRule').length
        const placementBindingCount = resources?.filter((resource) => resource.kind === 'PlacementBinding').length
        if (placementCount === 1 && placementRuleCount === 0 && placementBindingCount === 0) {
            resources.push({
                apiVersion: PlacementBindingApiVersion,
                kind: 'PlacementBinding',
                metadata: { name: '', namespace: '' },
                placementRef: { name: '', kind: 'Placement', apiGroup: 'cluster.open-cluster-management.io' },
                subjects: [{ apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind, name: '' }],
            } as IResource)
            update()
        } else if (placementCount === 0 && placementRuleCount === 1 && placementBindingCount === 0) {
            resources.push({
                apiVersion: PlacementBindingApiVersion,
                kind: 'PlacementBinding',
                metadata: { name: '', namespace: '' },
                placementRef: { name: '', kind: 'PlacementRule', apiGroup: 'apps.open-cluster-management.io' },
                subjects: [{ apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind, name: '' }],
            } as IResource)
            update()
        }
    }, [
        placementCount,
        placementRuleCount,
        placementBindingCount,
        resources,
        props.bindingSubjectApiGroup,
        props.bindingSubjectKind,
        update,
    ])

    const setHasInputs = useSetHasInputs()
    useEffect(() => setHasInputs(), [setHasInputs])

    return (
        <Section
            label="Cluster placement"
            // description="Placement selects clusters from the cluster sets which have bindings to the resource namespace."
            autohide={false}
        >
            {/* TODO - if there are existing placements... */}
            {editMode === EditMode.Create && (
                <DetailsHidden>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <span className="pf-c-form__label pf-c-form__label-text">How do you want to select clusters?</span>
                        <ToggleGroup aria-label="Default with single selectable">
                            <ToggleGroupItem
                                text="New placement"
                                isSelected={placementCount + placementRuleCount === 1}
                                onClick={() => {
                                    let newResources = [...resources]
                                    newResources = resources
                                        .filter((resource) => resource.kind !== 'Placement')
                                        .filter((resource) => resource.kind !== 'PlacementRule')
                                        .filter((resource) => resource.kind !== 'PlacementBinding')
                                    if (props.defaultPlacementType === 'placement') {
                                        newResources.push({
                                            apiVersion: PlacementApiVersion,
                                            kind: 'Placement',
                                            metadata: { name: '', namespace: '' },
                                        } as IResource)
                                    } else {
                                        newResources.push({
                                            apiVersion: 'apps.open-cluster-management.io/v1beta1',
                                            kind: 'PlacementRule',
                                            metadata: { name: '', namespace: '' },
                                        } as IResource)
                                    }
                                    if (props.defaultPlacementType === 'placement') {
                                        newResources.push({
                                            apiVersion: PlacementBindingApiVersion,
                                            kind: 'PlacementBinding',
                                            metadata: { name: '', namespace: '' },
                                            placementRef: { name: '', kind: 'Placement', apiGroup: 'cluster.open-cluster-management.io' },
                                            subjects: [
                                                { apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind, name: '' },
                                            ],
                                        } as IResource)
                                    } else {
                                        newResources.push({
                                            apiVersion: PlacementBindingApiVersion,
                                            kind: 'PlacementBinding',
                                            metadata: { name: '', namespace: '' },
                                            placementRef: { name: '', kind: 'PlacementRule', apiGroup: 'apps.open-cluster-management.io' },
                                            subjects: [
                                                { apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind, name: '' },
                                            ],
                                        } as IResource)
                                    }
                                    update(newResources)
                                    setShowPlacementBindings(false)
                                }}
                            />
                            <ToggleGroupItem
                                text="Existing placement"
                                isSelected={placementCount === 0 && placementRuleCount === 0 && placementBindingCount === 1}
                                onClick={() => {
                                    let newResources = [...resources]
                                    newResources = resources
                                        .filter((resource) => resource.kind !== 'Placement')
                                        .filter((resource) => resource.kind !== 'PlacementRule')
                                        .filter((resource) => resource.kind !== 'PlacementBinding')
                                    if (props.defaultPlacementType === 'placement') {
                                        newResources.push({
                                            apiVersion: PlacementBindingApiVersion,
                                            kind: 'PlacementBinding',
                                            metadata: { name: '', namespace: '' },
                                            placementRef: { name: '', kind: 'Placement', apiGroup: 'cluster.open-cluster-management.io' },
                                            subjects: [
                                                { apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind, name: '' },
                                            ],
                                        } as IResource)
                                    } else {
                                        newResources.push({
                                            apiVersion: PlacementBindingApiVersion,
                                            kind: 'PlacementBinding',
                                            metadata: { name: '', namespace: '' },
                                            placementRef: { name: '', kind: 'PlacementRule', apiGroup: 'apps.open-cluster-management.io' },
                                            subjects: [
                                                { apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind, name: '' },
                                            ],
                                        } as IResource)
                                    }
                                    update(newResources)
                                    setShowPlacements(false)
                                    setShowPlacementRules(false)
                                }}
                            />
                            <ToggleGroupItem
                                text="Do not place"
                                isSelected={placementCount === 0 && placementRuleCount === 0 && placementBindingCount === 0}
                                onClick={() => {
                                    let newResources = [...resources]
                                    newResources = resources
                                        .filter((resource) => resource.kind !== 'Placement')
                                        .filter((resource) => resource.kind !== 'PlacementRule')
                                        .filter((resource) => resource.kind !== 'PlacementBinding')
                                    update(newResources)
                                    setShowPlacements(false)
                                    setShowPlacementRules(false)
                                    setShowPlacementBindings(false)
                                }}
                            />
                        </ToggleGroup>
                    </div>
                </DetailsHidden>
            )}
            {/* <TextInput label={`${showPlacements} - ${showPlacementRules} - ${showPlacementBindings}`} path="hh" /> */}
            {showPlacements && (
                <Placements
                    clusterSetBindings={props.existingclusterSetBindings}
                    bindingKind={props.bindingSubjectKind}
                    placementCount={placementCount}
                    showPlacementRules={showPlacementRules}
                    showPlacementBindings={showPlacementBindings}
                />
            )}
            {showPlacementRules && (
                <PlacementRules
                    showPlacements={showPlacements}
                    placementRuleCount={placementRuleCount}
                    showPlacementBindings={showPlacementBindings}
                />
            )}
            {showPlacementBindings && (
                <PlacementBindings
                    showPlacements={showPlacements}
                    showPlacementRules={showPlacementRules}
                    showPlacementBindings={showPlacementBindings}
                    placementCount={placementCount}
                    placementRuleCount={placementRuleCount}
                    placementBindingCount={placementBindingCount}
                    bindingSubjectKind={props.bindingSubjectKind}
                    bindingSubjectApiGroup={props.bindingSubjectApiGroup}
                    existingPlacements={props.existingPlacements}
                    existingPlacementRules={props.existingPlacementRules}
                />
            )}
        </Section>
    )
}
