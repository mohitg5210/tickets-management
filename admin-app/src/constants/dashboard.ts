export interface TICKETS_STATUS {
    status: string
    count: string
}

export interface ASSIGNED_TICKETS {
    id: number
    name: string
    inProgress: string
    closed: string
}

export interface TICKETS_TIME_TAKEN {
    id: number
    name: string
    assignedTickets: []
}