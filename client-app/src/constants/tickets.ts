export const STATUS = {
    OPEN: 'OPEN',
    IN_PROGRESS: 'IN PROGRESS',
    CLOSED: 'CLOSED',
}

export interface TICKETS_LIST {
    id: number
    title: string
    description: string | null
    operationsManager: { name: string } | null
    status: string
    createdAt: string
    updatedAt: string
}

export const TICKET_MESSAGES = {
    SUCCESS_TICKET: 'Ticket created successfully!!'
}