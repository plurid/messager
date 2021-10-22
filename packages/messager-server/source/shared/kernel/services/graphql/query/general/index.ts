// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const GET_CURRENT_OWNER = gql`
    query GetCurrentOwner {
        getCurrentOwner {
            status
            error {
                path
                type
                message
            }
            data {
                id
                analytics {
                    entries {
                        project
                        period
                        data {
                            name
                            value
                        }
                    }
                    faults {
                        project
                        period
                        data {
                            name
                            value
                        }
                    }
                    size {
                        project
                        value
                    }
                }
                tokens {
                    id
                    name
                    startsWith
                    useOrigins
                    origins
                    useIPs
                    ips
                    useKey
                    key
                }
                projects {
                    id
                    name
                }
            }
        }
    }
`;


export const GET_USAGE_TYPE = gql`
    query GetUsageType {
        getUsageType {
            status
            error {
                path
                type
                message
            }
            data
        }
    }
`;


export const VERIFY_UNIQUE_ID = gql`
    query VerifyUniqueID($input: InputVerifyUniqueID!) {
        verifyUniqueID(input: $input) {
            status
            error {
                type
                path
                message
            }
        }
    }
`;


export const GET_RECORDS = gql`
    query GetRecords($input: InputGetRecords) {
        getRecords(input: $input) {
            status
            error {
                type
                path
                message
            }
            data {
                id
                happenedAt
                kind
                sseID
                socketID
                data {
                    type
                    topic
                    data
                }
            }
        }
    }
`;
// #endregion module
