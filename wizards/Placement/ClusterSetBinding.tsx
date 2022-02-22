import { IResource } from '../common/resource'

export type IClusterSetBinding = IResource & {
    spec: {
        clusterSet: string
    }
}
