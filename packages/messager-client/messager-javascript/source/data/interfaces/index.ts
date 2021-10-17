// #region module
export interface MessagerConfiguration {
    endpoint?: string;
    token?: string;
    logger?: (
        message: string,
        error?: any,
    ) => void;
}


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



export type MessagerSocketAction =
    | MessagerSocketPublish
    | MessagerSocketSubscribe;

export interface MessagerSocketPublish {
    type: 'publish';
    topic: string;
    data: any;
}

export interface MessagerSocketSubscribe {
    type: 'subscribe';
    topic: string;
}
// #endregion module
