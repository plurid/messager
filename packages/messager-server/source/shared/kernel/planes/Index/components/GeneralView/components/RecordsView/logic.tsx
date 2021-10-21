// #region imports
    // #region libraries
    import React from 'react';

    import {
        PluridIconDelete,
        PluridIconInfo,
    } from '@plurid/plurid-icons-react';

    import {
        PluridLink,
    } from '@plurid/plurid-react';
    // #endregion libraries


    // #region external
    import {
        Record,
    } from '~server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const recordRowRenderer = (
    record: Record,
    handleRecordObliterate: (
        id: string,
    ) => void,
) => {
    const {
        id,
        type,
        sseID,
        socketID,
        data,
    } = record;

    return (
        <>
            <div>
                {type}
            </div>

            <div>
                {sseID || socketID}
            </div>

            <div>
                <pre>
                    {data}
                </pre>
            </div>

            <PluridLink
                route={`/record/${id}`}
                devisible={true}
            >
                <PluridIconInfo
                    atClick={() => {}}
                />
            </PluridLink>

            <PluridIconDelete
                atClick={() => handleRecordObliterate(id)}
            />
        </>
    );
}


export const createSearchTerms = (
    records: Record[],
) => {
    const searchTerms = records.map(
        record => {
            const {
                id,
                type,
                data,
            } = record;


            const searchTerm = {
                id,
                data: [
                    type,
                ],
            };

            return searchTerm;
        },
    );

    return searchTerms;
}
// #endregion module
