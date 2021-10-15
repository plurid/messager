// #region module
export interface Token {
    id: string;
    name: string;
    value: string;
    ownedBy: string;
    startsWith: string;
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


export interface MessagerOwner {
    id: string;
    tokens: Token[];
    projects: Project[];
    spaces: Space[];
}


export interface OwnerToken {
    token: string;
}
// #endregion module
