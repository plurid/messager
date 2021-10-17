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



export type MessagerType =
    | 'socket'
    | 'event';

export interface MessagerOptions {
    /**
     * Path for web sockets.
     *
     * default: `'/socket'`
     */
    socketPath: string;

    /**
     * Path for server sent events.
     *
     * default: `'/event'`
     */
    eventPath: string;

    /**
     * Use secure protocols.
     *
     * default: `true`
     */
    secure: boolean;
}

export type MessagerSubscribeAction<D = any> = (
    data: D,
) => void;



export type MessagerSocketAction =
    | MessagerSocketPublish
    | MessagerSocketSubscribe;

export interface MessagerSocketPublish<D = any> {
    type: 'publish';
    topic: string;
    data: D;
}

export interface MessagerSocketSubscribe {
    type: 'subscribe';
    topic: string;
}


export interface MessagerMessageData<D = any> {
    topic: string;
    data: D;
}
// #endregion module
