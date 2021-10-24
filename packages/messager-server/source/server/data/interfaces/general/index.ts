// #region module
export interface Token {
    id: string;
    name: string;
    value: string;
    ownedBy: string;
    startsWith: string;
    useOrigins: boolean;
    origins: string[];
    useIPs: boolean;
    ips: string[];
    useKey: boolean;
    key: string;
}

export type ClientToken = Omit<Token, 'value' | 'ownedBy'>;


export interface Project {
    id: string;
    name: string;
    ownedBy: string;

    // generatedBy: string;
    // generatedAt: number;
    // sharedWith: ProjectSharer[];
}

export type ProjectEntityAccess =
    | 'CAN_READ'
    | 'CAN_WRITE';

export interface ProjectSharer {
    id: string;
    access: {
    };
}


export interface Space {
    id: string;
    name: string;
    project: string;
    ownedBy: string;
}


export interface Record {
    id: string;
    ownedBy: string;
    happenedAt: number;
    kind: string;
    sseID?: string;
    socketID?: string;
    data: {
        type: string;
        topic?: string;
        data: string;
    };
}



export interface MessagerOwner {
    id: string;
    tokens: Token[];
    projects: Project[];
    spaces: Space[];
    records: Record[];
}


export interface OwnerToken {
    token: string;
}



export interface AuthenticationMarkers {
    ip: string | undefined;
    origin: string | undefined;
    key: string | undefined;
}
// #endregion module
