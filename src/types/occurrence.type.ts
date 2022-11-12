export type Occurrence = {
    _id: string
    client: string
    type_client: string
    name_client: string
    type_occurrence: string
    description: string
    type_document: string
    document: string
    action: string
    responsible_id: string[]
    evidence: string[]
    status: string
    type_analysis: string
    remedial_action_id: string;
    step: number
}
