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
        type,
        sseID,
        socketID,
        data,
    } = record;

    const itemID = sseID || socketID || '';

    return (
        <>
            <div>
                {type}
            </div>

            <div>
                {new Date(happenedAt).toLocaleString()}
            </div>

            <div>
                {itemID.slice(0, 5)}...{itemID.slice(itemID.length - 5)}
            </div>

            <div>
                <div>
                    type {data.type}
                </div>
                {data.topic && (
                    <div>
                        topic {data.topic}
                    </div>
                )}
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
