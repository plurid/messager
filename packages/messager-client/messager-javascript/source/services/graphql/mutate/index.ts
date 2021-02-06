// #region imports
    // #region libraries
    import {
        gql,
    } from '@apollo/client';
    // #endregion libraries
// #endregion imports



// #region module
const PUBLISH = gql`
    mutation MessagerMutationPublish($input: MessagerInputPublish!) {
        messagerMutationPublish(input: $input) {
            status
        }
    }
`;


const SUBSCRIBE = gql`
    subscription MessagerSubscriptionSubscribe($input: MessagerInputSubscribe!) {
        messagerMutationSubscribe(input: $input) {
            status
            data {
                sender
                message
            }
        }
    }
`;


const SEND = gql`
    mutation MessagerMutationSend($input: MessagerInputSend!) {
        messagerMutationSend(input: $input) {
            status
        }
    }
`;

// #endregion module



// #region exports
export {
    PUBLISH,
    SUBSCRIBE,
    SEND,
};
// #endregion exports
