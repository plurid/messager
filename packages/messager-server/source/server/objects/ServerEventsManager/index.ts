// #region imports
    // #region libraries
    import {
        Response,
    } from 'express';
    // #endregion libraries


    // #region external
    import ServerEventsMessager from '../ServerEventsMessager';
    // #endregion external
// #endregion imports



// #region module
export type EventsMessagers = Record<string, ServerEventsMessager | undefined>;


class ServerEventsManager {
    private messagers: Record<string, EventsMessagers | undefined> = {};


    public new(
        ownerID: string,
        messagerID: string,
        response: Response,
    ) {
        const existingEventsMessager = this.get(ownerID, messagerID);
        if (existingEventsMessager) {
            return existingEventsMessager;
        }

        if (!this.messagers[ownerID]) {
            this.messagers[ownerID] = {};
        }

        const eventsMessager = new ServerEventsMessager(response);
        (this.messagers[ownerID] as EventsMessagers)[messagerID] = eventsMessager;

        return eventsMessager;
    }

    public get(
        ownerID: string,
        messagerID: string,
    ) {
        if (this.messagers[ownerID]) {
            if ((this.messagers[ownerID] as EventsMessagers)[messagerID]) {
                return (this.messagers[ownerID] as EventsMessagers)[messagerID] as ServerEventsMessager;
            }
        }

        return;
    }

    public getAll(
        ownerID: string,
    ) {
        return this.messagers[ownerID];
    }

    public remove(
        ownerID: string,
        messagerID: string,
    ) {
        if (this.messagers[ownerID]) {
            delete (this.messagers[ownerID] as EventsMessagers)[messagerID];
        }
    }
}
// #endregion module



// #region exports
export default ServerEventsManager;
// #endregion exports
