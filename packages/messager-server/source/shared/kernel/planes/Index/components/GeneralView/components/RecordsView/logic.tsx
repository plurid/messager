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
        happenedAt,
        kind,
        sseID,
        socketID,
        data,
    } = record;

    const itemID = sseID || socketID || '';

    return (
        <>
            <div>
                {kind}
            </div>

            <div>
                {new Date(happenedAt).toLocaleString()}
            </div>

            <div>
                {itemID.slice(0, 5)}...{itemID.slice(itemID.length - 5)}
            </div>

            <div>
                {data.type}
            </div>

            <div>
                {data.topic || ''}
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
                kind,
                data,
            } = record;


            const searchTerm = {
                id,
                data: [
                    id,
                    kind,
                ],
            };

            return searchTerm;
        },
    );

    return searchTerms;
}
// #endregion module
