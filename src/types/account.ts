export type RecordType = 'local' | 'ldap'

export interface LabelTag {
	text: string
}

export interface Account {
	id: string
	labels: LabelTag[]
	recordType: RecordType
	login: string
	password: string | null
}

export interface AccountFormData {
	id: string
	labelsInput: string
	recordType: RecordType
	login: string
	password: string
}

export interface ValidationErrors {
	login: boolean
	password: boolean
}
