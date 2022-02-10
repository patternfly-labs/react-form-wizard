export interface IResource {
    apiVersion?: string
    kind?: string
    metadata?: { name?: string; namespace?: string }
}
