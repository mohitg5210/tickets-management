export const STATUS = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    CLOSED: 'Closed',
}

export interface TICKETS_LIST {
    id: number
    title: string
    description: string | null
    client: { id: number, name: string }
    operationsManager: { id: number, name: string } | null
    status: string
    createdAt: string
    updatedAt: string
}

export const TOASTER_MESSAGES = {
    SUCCESS_ASSIGNED: 'Ticket created successfully!!',
    SUCCESS_CLOSED: 'Ticket closed successfully!!'
}