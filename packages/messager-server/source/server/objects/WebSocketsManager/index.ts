// #region imports
    // #region external
    import WebSocketsMessager from '../WebSocketsMessager';
    // #endregion external
// #endregion imports



// #region module
class WebSocketsManager {
    private messagers: Record<string, WebSocketsMessager | undefined> = {};


    public new(
        id: string,
    ) {
        if (this.messagers[id]) {
            return this.messagers[id] as WebSocketsMessager;
        }

        const webSocketsMessager = new WebSocketsMessager(id);
        this.messagers[id] = webSocketsMessager;

        return this.messagers[id] as WebSocketsMessager;
    }

    public get(
        id: string,
    ) {
        return this.messagers[id];
    }

    public remove(
        id: string,
    ) {
        delete this.messagers[id];
    }
}
// #endregion module



// #region exports
export default WebSocketsManager;
// #endregion exports
