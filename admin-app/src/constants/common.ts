export enum NOTIFICATION_TYPES {
    SUCCESS = 'success',
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
}

export const STATUS_CODES = {
    UN_AUTHORIZED: 401,
    FORBIDDEN: 403
}

export interface OPERATIONS_MANAGER {
    id: number
    name: string
    assignedTickets: [{ id: number, title: string }]
}

export interface SELECT_OPTIONS {
    id: number
    name: string
}

export enum UserTypes {
    Admin = "Admin",
    Operation_Manager = "Operation Manager"
}

export interface ARRAY_DATA {
    name: string
    value: number
}