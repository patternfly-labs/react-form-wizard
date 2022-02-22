import { Tile } from '@patternfly/react-core'
import { Fragment } from 'react'
import { EditMode, Section } from '../../src'
import { useData } from '../../src/contexts/DataContext'
import { useEditMode } from '../../src/contexts/EditModeContext'
import { useItem } from '../../src/contexts/ItemContext'
import { IResource } from '../common/resource'
import { Sync } from '../common/Sync'
import { IClusterSetBinding } from './ClusterSetBinding'
import { IPlacement, Placements } from './Placement'
import { PlacementBindings } from './PlacementBinding'
import { PlacementRules } from './PlacementRule'

const placementLocalCluster: IPlacement = {
    apiVersion: 'cluster.open-cluster-management.io/v1beta1',
    kind: 'Placement',
    metadata: { name: '', namespace: '' },
    spec: {
        predicates: [
            {
                requiredClusterSelector: {
                    labelSelector: {
                        matchExpressions: [
                            {
                                key: 'local-cluster',
                                operator: 'In',
                                values: ['true'],
                            },
                        ],
                    },
                },
            },
        ],
    },
}

export function PlacementSection(props: {
    clusterSetBindings: IClusterSetBinding[]
    bindingSubjectKind: string
    bindingSubjectApiGroup?: string
    placements: IResource[]
    placementRules: IResource[]
}) {
    const resources = useItem() as IResource[]
    const { update } = useData()
    const placementCount = resources?.filter((resource) => resource.kind === 'Placement').length
    const hasPlacement = placementCount !== 0
    const hasPlacementRules = resources?.find((resource) => resource.kind === 'PlacementRule') !== undefined
    const hasPlacementBindings = resources?.find((resource) => resource.kind === 'PlacementBinding') !== undefined
    const editMode = useEditMode()
    return (
        <Fragment>
            {editMode === EditMode.Create && (
                <Fragment>
                    <Sync kind="Placement" path="metadata.name" targetKind="PlacementBinding" targetPath="placementRef.name" />
                </Fragment>
            )}
            <Section
                label="Which clusters would you like to deploy the resources?"
                autohide={false}
                hidden={() => hasPlacement || hasPlacementRules || hasPlacementBindings}
            >
                <Tile
                    title="Deploy to clusters with specific labels"
                    onClick={() => {
                        resources.push({
                            apiVersion: 'cluster.open-cluster-management.io/v1beta1',
                            kind: 'Placement',
                            metadata: { name: '', namespace: '' },
                            spec: {},
                        } as IResource)
                        if (props.bindingSubjectKind) {
                            resources.push({
                                apiVersion: 'policy.open-cluster-management.io/v1',
                                kind: 'PlacementBinding',
                                metadata: { name: '', namespace: '' },
                                placementRef: { name, kind: 'Placement', apiGroup: 'cluster.open-cluster-management.io' },
                                subjects: [{ name, kind: props.bindingSubjectKind, apiGroup: props.bindingSubjectApiGroup }],
                            } as IResource)
                        }
                        update()
                    }}
                />
                <Tile
                    title="Deploy to all clusters"
                    onClick={() => {
                        const name = 'all-clusters'
                        resources.push({
                            apiVersion: 'cluster.open-cluster-management.io/v1beta1',
                            kind: 'Placement',
                            metadata: { name, namespace: '' },
                            spec: {},
                        } as IResource)
                        if (props.bindingSubjectKind) {
                            resources.push({
                                apiVersion: 'policy.open-cluster-management.io/v1',
                                kind: 'PlacementBinding',
                                metadata: { name, namespace: '' },
                                placementRef: { name, kind: 'Placement', apiGroup: 'cluster.open-cluster-management.io' },
                                subjects: [{ name, kind: props.bindingSubjectKind, apiGroup: props.bindingSubjectApiGroup }],
                            } as IResource)
                        }
                        update()
                    }}
                />
                <Tile
                    title="Deploy to local cluster"
                    onClick={() => {
                        const name = 'local-cluster'
                        resources.push(placementLocalCluster)
                        if (props.bindingSubjectKind) {
                            resources.push({
                                apiVersion: 'policy.open-cluster-management.io/v1',
                                kind: 'PlacementBinding',
                                metadata: { name, namespace: '' },
                                placementRef: { name, kind: 'Placement', apiGroup: 'cluster.open-cluster-management.io' },
                                subjects: [{ name, kind: props.bindingSubjectKind, apiGroup: props.bindingSubjectApiGroup }],
                            } as IResource)
                        }
                        update()
                    }}
                />
                <Tile
                    title="Select an existing placement"
                    onClick={() => {
                        update()
                    }}
                >
                    Uses an existing placement to deploy to clusters.
                </Tile>
            </Section>
            <Placements
                clusterSetBindings={props.clusterSetBindings}
                bindingKind={props.bindingSubjectKind}
                placementCount={placementCount}
            />
            <PlacementRules hasPlacement={hasPlacement} hasPlacementRules={hasPlacementRules} hasPlacementBindings={hasPlacementBindings} />
            <PlacementBindings
                hasPlacement={hasPlacement}
                hasPlacementRules={hasPlacementRules}
                hasPlacementBindings={hasPlacementBindings}
                bindingSubjectKind={props.bindingSubjectKind}
                bindingSubjectApiGroup={props.bindingSubjectApiGroup}
                placements={props.placements}
                placementRules={props.placementRules}
            />
        </Fragment>
    )
}
