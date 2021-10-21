// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const queries = gql`
    extend type Query {
        getRecords(input: InputGetRecords): ResponseRecords!
    }
`;


export const mutations = gql`
    extend type Mutation {
        obliterateAllRecords: Response!
        obliterateRecord(input: InputValueString!): Response!
        obliterateRecords(input: InputObliterateRecords!): Response!
    }
`;


export const types = gql`
    type ResponseRecords {
        status: Boolean!
        error: Error
        data: [Record!]
    }

    type Record {
        id: ID!
        type: String!
        sseID: String
        socketID: String
        data: RecordData!
    }

    type RecordData {
        type: String!
        topic: String
        data: String!
    }

    # extend type Owner {
    #     records: [Record!]!
    # }
`;


export const inputs = gql`
    input InputGetRecords {
        pagination: String
    }

    input InputObliterateRecords {
        ids: [String!]!
    }
`;
// #endregion module



// #region exports
export default gql`
    ${queries}
    ${mutations}
    ${types}
    ${inputs}
`;
// #endregion exports
