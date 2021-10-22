// #region imports
    // #region libraries
    import React, {
        useState,
        useEffect,
    } from 'react';

    import { AnyAction } from 'redux';
    import { connect } from 'react-redux';
    import { ThunkDispatch } from 'redux-thunk';

    import {
        Theme,
    } from '@plurid/plurid-themes';

    import {
        data as dataFunctions,
    } from '@plurid/plurid-functions';

    import {
        PluridPlaneComponentProperty,
    } from '@plurid/plurid-react';
    // #endregion libraries


    // #region external
    import {
        Record,
    } from '~server/data/interfaces';

    import { AppState } from '~kernel-services/state/store';
    import StateContext from '~kernel-services/state/context';
    import selectors from '~kernel-services/state/selectors';
    // import actions from '~kernel-services/state/actions';
    // #endregion external


    // #region internal
    import {
        StyledRecord,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface RecordOwnProperties {
    plurid: PluridPlaneComponentProperty;
}

export interface RecordStateProperties {
    stateGeneralTheme: Theme;
    stateInteractionTheme: Theme;
    stateRecords: Record[];
}

export interface RecordDispatchProperties {
}

export type RecordProperties = RecordOwnProperties
    & RecordStateProperties
    & RecordDispatchProperties;

const Record: React.FC<RecordProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region own
        plurid,
        // #endregion own

        // #region state
        stateRecords,
        // stateGeneralTheme,
        // stateInteractionTheme,
        // #endregion state
    } = properties;

    const {
        id,
    } = plurid.plane.parameters;
    // #endregion properties


    // #region state
    const [
        record,
        setRecord,
    ] = useState(
        stateRecords.find(record => record.id === id)
    );
    // #endregion state


    // #region effects
    useEffect(() => {
        const record = stateRecords.find(record => record.id === id);

        if (record) {
            setRecord(record);
        }
    }, [
        stateRecords,
    ]);
    // #endregion effects


    // #region render
    const recordRender = (
        record: Record,
    ) => {
        const {
            type,
            socketID,
            sseID,
            data,
        } = record;

        const renderData = dataFunctions.parse(data.data)
            ? JSON.stringify(dataFunctions.parse(data.data), null, 4)
            : data.data;

        const typeTopic = data.topic
            ? `${data.type} on topic ${data.topic}`
            : `${data.type}`;

        return (
            <StyledRecord>
                <div>
                    <h1
                        style={{
                            marginBottom: '1rem',
                            lineHeight: 1,
                        }}
                    >
                        {type}
                    </h1>

                    <div
                        style={{
                            wordBreak: 'break-all',
                            marginBottom: '2rem',
                        }}
                    >
                        {socketID || sseID}
                    </div>
                </div>

                <div
                    style={{
                        marginBottom: '2rem',
                    }}
                >
                    <h2>
                        {typeTopic}
                    </h2>
                </div>

                <div>
                    <h2>
                        data
                    </h2>

                    <pre>
                        {renderData}
                    </pre>
                </div>
           </StyledRecord>
        );
    }

    return (
        <>
            {record && recordRender(record)}
        </>
    );
    // #endregion render
}


const mapStateToProperties = (
    state: AppState,
): RecordStateProperties => ({
    stateGeneralTheme: selectors.themes.getGeneralTheme(state),
    stateInteractionTheme: selectors.themes.getInteractionTheme(state),
    stateRecords: selectors.data.getRecords(state),
});


const mapDispatchToProperties = (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
): RecordDispatchProperties => ({
});


const ConnectedRecord = connect(
    mapStateToProperties,
    mapDispatchToProperties,
    null,
    {
        context: StateContext,
    },
)(Record);
// #endregion module



// #region exports
export default ConnectedRecord;
// #endregion exports
