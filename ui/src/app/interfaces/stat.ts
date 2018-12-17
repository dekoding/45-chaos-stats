export interface StatEntry {
    label: string,
    count: number
}

export interface Stat {
    perDayStr: string,
    avgTrumpTime: number,
	avgRolloverTime: number,
	avgTrumpHireTime: number
    leaveTypes: StatEntry[],
    affiliationStats: StatEntry[]
}
