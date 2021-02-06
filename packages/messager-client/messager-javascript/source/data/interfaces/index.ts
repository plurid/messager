// #region module
export interface MessagerMetadata {
    sender: string;
}


export interface MesagerContextCall {
    depth?: number;
    repository?: MesagerContextCallRepository;
}


export interface MesagerContextCallRepository {
    provider?: string;
    name?: string;
    branch?: string;
    commit?: string;
    basePath?: string;
}


export interface MesagerInputRecord {
    text: string;
    time: number;
    level: number;

    project?: string;
    space?: string;

    format?: string;

    method?: string;
    error?: string;
    extradata?: string;
    context?: MesagerInputRecordContextCall;
}


export interface MesagerInputRecordContextCall {
    repository: MesagerInputRecordContextRepository;
    caller: MesagerInputRecordContextCaller;
}

export interface MesagerInputRecordContextRepository {
    provider: string;
    name: string;
    branch: string;
    commit: string;
    basePath: string;
}

export interface MesagerInputRecordContextCaller {
    file: string;
    line: number;
    column: number;
}
// #endregion module
