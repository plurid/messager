// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const GENERATE_PROJECT = gql`
    mutation GenerateProject($input: InputValueString!) {
        generateProject(input: $input) {
            status
            error {
                type
                path
                message
            }
            data {
                id
                name
            }
        }
    }
`;


export const OBLITERATE_PROJECT = gql`
    mutation ObliterateProject($input: InputValueString!) {
        obliterateProject(input: $input) {
            status
            error {
                type
                path
                message
            }
        }
    }
`;


export const GENERATE_TOKEN = gql`
    mutation GenerateToken($input: InputGenerateToken!) {
        generateToken(input: $input) {
            status
            error {
                type
                path
                message
            }
            data {
                id
                name
                value
                startsWith
            }
        }
    }
`;


export const OBLITERATE_TOKEN = gql`
    mutation ObliterateToken($input: InputValueString!) {
        obliterateToken(input: $input) {
            status
            error {
                type
                path
                message
            }
        }
    }
`;


export const GENERATE_SPACE = gql`
    mutation GenerateSpace($input: InputGenerateSpace!) {
        generateSpace(input: $input) {
            status
            error {
                type
                path
                message
            }
            data {
                id
                name
                project
            }
        }
    }
`;


export const OBLITERATE_SPACE = gql`
    mutation ObliterateSpace($input: InputValueString!) {
        obliterateSpace(input: $input) {
            status
            error {
                type
                path
                message
            }
        }
    }
`;


export const OBLITERATE_RECORD = gql`
    mutation ObliterateRecord($input: InputValueString!) {
        obliterateRecord(input: $input) {
            status
            error {
                type
                path
                message
            }
        }
    }
`;


export const OBLITERATE_RECORDS = gql`
    mutation ObliterateRecords($input: InputObliterateRecords) {
        obliterateRecords(input: $input) {
            status
            error {
                type
                path
                message
            }
        }
    }
`;


export const LOGIN = gql`
    mutation Login($input: InputLogin!) {
        login(input: $input) {
            status
            error {
                type
                path
                message
            }
            data {
                id
            }
        }
    }
`;


export const LOGOUT = gql`
    mutation Logout {
        logout {
            status
            error {
                type
                path
                message
            }
        }
    }
`;
// #endregion module
