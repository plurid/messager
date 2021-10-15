// #region module
export interface InputOf<T> {
    input: T;
}


export interface InputValueString {
    value: string;
}


export interface InputQuery {
    count?: number;
    start?: string;
}


export interface InputGenerateToken {
    name: string;
}


export interface InputGenerateSpace {
    name: string;
    project: string;
}


export interface InputGetAnalyticsLastPeriod {
    project: string;
    period: string;
    type: string;
}

export interface InputGetAnalyticsLastPeriodData {
    project: string;
    period: string;
}


export interface InputGetAnalyticsSize {
    project: string;
}


export interface InputVerifyUniqueID {
    type: string;
    value: string;
}
// #endregion module
