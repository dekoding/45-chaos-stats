export interface IDepartureRecord {
    LastName: string;
    FirstName: string;
    Affiliation: string;
    Position: string;
    DateHired: string;
    DateLeft: string;
    TotalTime: number;
    TrumpTime: number;
    MoochesTime: string;
    LeaveType: string;
    Notes: string;
    Image: string;
    Sources: string;
}

export interface IDepartureRecordRaw {
    "Last Name": string;
    "First Name": string;
    Affiliation: string;
    Position: string;
    "Date Hired": string;
    "Date Left": string;
    TotalTime: number;
    TrumpTime: number;
    MoochesTime: number;
    "Fired/Resigned /Resigned under pressure": string;
    Notes: string;
    "Technical stuff for the website (coming soon)": string;
    "Source 1": string;
    "Source 2": string;
}
