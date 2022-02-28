import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core'
import { useEffect, useState } from 'react'
import { DetailsHidden, EditMode, Section } from '../../src'
import { useData } from '../../src/contexts/DataContext'
import { useEditMode } from '../../src/contexts/EditModeContext'
import { useSetHasInputs } from '../../src/contexts/HasInputsProvider'
import { useItem } from '../../src/contexts/ItemContext'
import { IResource } from '../common/resource'
import { IClusterSetBinding } from '../common/resources/IClusterSetBinding'
import { PlacementApiGroup, PlacementApiVersion, PlacementKind } from '../common/resources/IPlacement'
import { PlacementBindingKind, PlacementBindingType } from '../common/resources/IPlacementBinding'
import { PlacementRuleApiGroup, PlacementRuleKind, PlacementRuleType } from '../common/resources/IPlacementRule'
import { Placements } from './Placement'
import { PlacementBindings } from './PlacementBinding'
import { PlacementRules } from './PlacementRule'

export function PlacementSection(props: {
    bindingSubjectKind: string
    bindingSubjectApiGroup: string
    existingPlacements: IResource[]
    existingPlacementRules: IResource[]
    existingclusterSetBindings: IClusterSetBinding[]
    defaultPlacementKind: 'Placement' | 'PlacementRule'
}) {
    const { update } = useData()
    const resources = useItem() as IResource[]
    const editMode = useEditMode()

    const [showPlacements, setShowPlacements] = useState(props.defaultPlacementKind === PlacementKind)
    const [showPlacementRules, setShowPlacementRules] = useState(props.defaultPlacementKind === PlacementRuleKind)
    const [showPlacementBindings, setShowPlacementBindings] = useState(false)

    const [placementCount, setPlacementCount] = useState(0)
    const [placementRuleCount, setPlacementRuleCount] = useState(0)
    const [placementBindingCount, setPlacementBindingCount] = useState(0)

    useEffect(() => {
        setPlacementCount(resources?.filter((resource) => resource.kind === PlacementKind).length)
        setPlacementRuleCount(resources?.filter((resource) => resource.kind === PlacementRuleKind).length)
        setPlacementBindingCount(resources?.filter((resource) => resource.kind === PlacementBindingKind).length)
    }, [resources, setPlacementCount, setPlacementRuleCount, setPlacementBindingCount])

    useEffect(() => {
        if (placementCount > 0) setShowPlacements(true)
        if (placementRuleCount > 0) setShowPlacementRules(true)
        if (placementCount + placementRuleCount > 1) setShowPlacementBindings(true)
        if (placementCount + placementRuleCount === 0 && placementBindingCount > 0) setShowPlacementBindings(true)
    }, [placementCount, placementRuleCount, setShowPlacements, setShowPlacementRules, setShowPlacementBindings, placementBindingCount])

    useEffect(() => {
        const placementCount = resources?.filter((resource) => resource.kind === PlacementKind).length
        const placementRuleCount = resources?.filter((resource) => resource.kind === PlacementRuleKind).length
        const placementBindingCount = resources?.filter((resource) => resource.kind === PlacementBindingKind).length
        if (placementCount === 1 && placementRuleCount === 0 && placementBindingCount === 0) {
            resources.push({
                ...PlacementBindingType,
                metadata: { name: '', namespace: '' },
                placementRef: { apiGroup: PlacementApiGroup, kind: PlacementKind, name: '' },
                subjects: [{ apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind, name: '' }],
            } as IResource)
            update()
        } else if (placementCount === 0 && placementRuleCount === 1 && placementBindingCount === 0) {
            resources.push({
                ...PlacementBindingType,
                metadata: { name: '', namespace: '' },
                placementRef: { apiGroup: PlacementApiGroup, kind: PlacementKind, name: '' },
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
            {editMode === EditMode.Create && (
                <PlacementSelector
                    placementCount={placementCount}
                    placementRuleCount={placementRuleCount}
                    placementBindingCount={placementBindingCount}
                    bindingSubjectKind={props.bindingSubjectKind}
                    bindingSubjectApiGroup={props.bindingSubjectApiGroup}
                    defaultPlacementKind={props.defaultPlacementKind}
                    setShowPlacements={setShowPlacements}
                    setShowPlacementRules={setShowPlacementRules}
                    setShowPlacementBindings={setShowPlacementBindings}
                />
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

export function PlacementSelector(props: {
    placementCount: number
    placementRuleCount: number
    placementBindingCount: number
    bindingSubjectKind: string
    bindingSubjectApiGroup: string
    defaultPlacementKind: 'Placement' | 'PlacementRule'
    setShowPlacements?: (show: boolean) => void
    setShowPlacementRules?: (show: boolean) => void
    setShowPlacementBindings?: (show: boolean) => void
}) {
    const resources = useItem() as IResource[]
    const {
        placementCount,
        placementRuleCount,
        placementBindingCount,
        setShowPlacements,
        setShowPlacementRules,
        setShowPlacementBindings,
    } = props
    const { update } = useData()
    return (
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
                                .filter((resource) => resource.kind !== PlacementKind)
                                .filter((resource) => resource.kind !== PlacementRuleKind)
                                .filter((resource) => resource.kind !== PlacementBindingKind)
                            if (props.defaultPlacementKind === PlacementKind) {
                                newResources.push({
                                    apiVersion: PlacementApiVersion,
                                    kind: PlacementKind,
                                    metadata: { name: '', namespace: '' },
                                } as IResource)
                            } else {
                                newResources.push({
                                    ...PlacementRuleType,
                                    metadata: { name: '', namespace: '' },
                                    spec: { clusterSelector: { matchExpressions: [] } },
                                } as IResource)
                            }
                            if (props.defaultPlacementKind === PlacementKind) {
                                newResources.push({
                                    ...PlacementBindingType,
                                    metadata: { name: '', namespace: '' },
                                    placementRef: { apiGroup: PlacementApiGroup, kind: PlacementKind, name: '' },
                                    subjects: [{ apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind, name: '' }],
                                } as IResource)
                            } else {
                                newResources.push({
                                    ...PlacementBindingType,
                                    metadata: { name: '', namespace: '' },
                                    placementRef: { apiGroup: PlacementRuleApiGroup, kind: PlacementRuleKind, name: '' },
                                    subjects: [{ apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind, name: '' }],
                                } as IResource)
                            }
                            update(newResources)
                            setShowPlacementBindings?.(false)
                        }}
                    />
                    <ToggleGroupItem
                        text="Existing placement"
                        isSelected={placementCount === 0 && placementRuleCount === 0 && placementBindingCount === 1}
                        onClick={() => {
                            let newResources = [...resources]
                            newResources = resources
                                .filter((resource) => resource.kind !== PlacementKind)
                                .filter((resource) => resource.kind !== PlacementRuleKind)
                                .filter((resource) => resource.kind !== PlacementBindingKind)
                            if (props.defaultPlacementKind === PlacementKind) {
                                newResources.push({
                                    ...PlacementBindingType,
                                    metadata: { name: '', namespace: '' },
                                    placementRef: { apiGroup: PlacementApiGroup, kind: PlacementKind, name: '' },
                                    subjects: [{ apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind, name: '' }],
                                } as IResource)
                            } else {
                                newResources.push({
                                    ...PlacementBindingType,
                                    metadata: { name: '', namespace: '' },
                                    placementRef: { apiGroup: PlacementApiGroup, kind: PlacementRuleKind, name: '' },
                                    subjects: [{ apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind, name: '' }],
                                } as IResource)
                            }
                            update(newResources)
                            setShowPlacements?.(false)
                            setShowPlacementRules?.(false)
                        }}
                    />
                    <ToggleGroupItem
                        text="Do not place"
                        isSelected={placementCount === 0 && placementRuleCount === 0 && placementBindingCount === 0}
                        onClick={() => {
                            let newResources = [...resources]
                            newResources = resources
                                .filter((resource) => resource.kind !== PlacementKind)
                                .filter((resource) => resource.kind !== PlacementRuleKind)
                                .filter((resource) => resource.kind !== PlacementBindingKind)
                            update(newResources)
                            setShowPlacements?.(false)
                            setShowPlacementRules?.(false)
                            setShowPlacementBindings?.(false)
                        }}
                    />
                </ToggleGroup>
            </div>
        </DetailsHidden>
    )
}
