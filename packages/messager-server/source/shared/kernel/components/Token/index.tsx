// #region imports
    // #region libraries
    import React, {
        useState,
        useEffect,
    } from 'react';

    import {
        Theme,
    } from '@plurid/plurid-themes';

    import {
        network,
        uuid,
    } from '@plurid/plurid-functions';

    import {
        notifications,
    } from '@plurid/plurid-ui-state-react';
    // #endregion libraries


    // #region external
    import {
        Token as IToken,
        ClientToken,
    } from '~server/data/interfaces';

    import {
        addEntityMutation,
    } from '~kernel-services/logic/mutations';

    import {
        GENERATE_TOKEN,
        UPDATE_TOKEN,
    } from '~kernel-services/graphql/mutate';

    import {
        StyledH1,
        StyledPluridPureButton,
        StyledPluridLinkButton,

        PluridInputLine,
        PluridInputSwitch,
        PluridEntityPillGroup,
        PluridCopyableLine,
    } from '~kernel-services/styled';
    // #endregion external


    // #region internal
    import {
        StyledToken,
        StyledTokenValue,
        StyledTokenAdded,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface TokenProperties {
    // #region required
        // #region values
        theme: Theme;
        // #endregion values

        // #region methods
        action: (
            token: ClientToken,
        ) => void;
        // #endregion methods
    // #endregion required

    // #region optional
        // #region values
        editID?: string;
        // #endregion values

        // #region methods
        cancel?: () => void;
        getByID?: (
            id: string,
        ) => Promise<ClientToken | undefined>;
        addNotification?: typeof notifications.actions.add;
        // #endregion methods
    // #endregion optional
}

const Token: React.FC<TokenProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region required
            // #region values
            theme,
            // #endregion values

            // #region methods
            action,
            // #endregion methods
        // #endregion required

        // #region optional
            // #region values
            editID,
            // #endregion values

            // #region methods
            cancel,
            getByID,
            addNotification,
            // #endregion methods
        // #endregion optional
    } = properties;
    // #endregion properties


    // #region state
    const [
        tokenName,
        setTokenName,
    ] = useState('');
    const [
        tokenValue,
        setTokenValue,
    ] = useState('');

    const [
        tokenUseOrigins,
        setTokenUseOrigins,
    ] = useState(false);
    const [
        tokenOrigin,
        setTokenOrigin,
    ] = useState('');
    const [
        tokenOrigins,
        setTokenOrigins,
    ] = useState<string[]>([]);

    const [
        tokenUseIPs,
        setTokenUseIPs,
    ] = useState(false);
    const [
        tokenIP,
        setTokenIP,
    ] = useState('');
    const [
        tokenIPs,
        setTokenIPs,
    ] = useState<string[]>([]);

    const [
        tokenUseKey,
        setTokenUseKey,
    ] = useState(false);
    const [
        tokenKey,
        setTokenKey,
    ] = useState('');

    const [
        tokenValid,
        setTokenValid,
    ] = useState(false);

    const [
        clientToken,
        setClientToken,
    ] = useState<ClientToken | null>();
    // #endregion state


    // #region handlers
    const updateToken = async () => {
        const token: ClientToken | undefined = await addEntityMutation(
            {
                tokenID: editID,
                name: tokenName,
                useOrigins: tokenUseOrigins,
                origins: tokenOrigins,
                useIPs: tokenUseIPs,
                ips: tokenIPs,
                useKey: tokenUseKey,
                key: tokenKey,
            },
            UPDATE_TOKEN,
            'updateToken',
        );

        if (token) {
            action(token);
        }
    }

    const addToken = async () => {
        const token: IToken | undefined = await addEntityMutation(
            {
                name: tokenName,
                useOrigins: tokenUseOrigins,
                origins: tokenOrigins,
                useIPs: tokenUseIPs,
                ips: tokenIPs,
                useKey: tokenUseKey,
                key: tokenKey,
            },
            GENERATE_TOKEN,
            'generateToken',
        );

        if (token) {
            setTokenValue(token.value);

            const {
                id,
                name,
                startsWith,
                useOrigins,
                origins,
                useIPs,
                ips,
                useKey,
                key,
            } = token;

            const clientToken: ClientToken = {
                id,
                name,
                startsWith,
                useOrigins,
                origins,
                useIPs,
                ips,
                useKey,
                key,
            };
            setClientToken(clientToken);
        }
    }

    const tokenAction = async () => {
        if (!tokenValid) {
            return;
        }

        if (editID) {
            await updateToken();
            return;
        }

        await addToken();
    }

    const handleEnter = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            tokenAction();
        }
    }
    // #endregion handlers


    // #region effects
    /**
     * Check valid token.
     */
    useEffect(() => {
        const isInvalid = () => {
            setTokenValid(false);
        }

        if (!tokenName) {
            isInvalid();
            return;
        }

        if (tokenUseOrigins && tokenOrigins.length === 0) {
            isInvalid();
            return;
        }

        if (tokenUseIPs && tokenIPs.length === 0) {
            isInvalid();
            return;
        }

        if (tokenUseIPs && tokenIPs.length === 0) {
            isInvalid();
            return;
        }

        if (tokenUseKey && !tokenKey) {
            isInvalid();
            return;
        }

        setTokenValid(true);
    }, [
        tokenName,
        tokenUseOrigins,
        tokenOrigins,
        tokenUseIPs,
        tokenIPs,
        tokenUseKey,
        tokenKey,
    ]);

    /**
     * Handle edit mode
     */
    useEffect(() => {
        const getToken = async (
            editID: string,
        ) => {
            if (!getByID) {
                return;
            }

            const token: ClientToken | undefined = await getByID(
                editID,
            );
            if (!token) {
                return;
            }

            const {
                name,
                useOrigins,
                origins,
                useIPs,
                ips,
                useKey,
                key,
            } = token;

            setTokenName(name);
            setTokenUseOrigins(useOrigins);
            setTokenOrigins(origins);
            setTokenUseIPs(useIPs);
            setTokenIPs(ips);
            setTokenUseKey(useKey);
            setTokenKey(key);
        }

        if (editID) {
            getToken(editID);
        }
    }, [
        editID,
    ]);
    // #endregion effects


    // #region render
    if (!tokenValue) {
        return (
            <StyledToken
                theme={theme}
            >
                <StyledH1>
                    {editID ? 'update' : 'generate'} token
                </StyledH1>

                <PluridInputLine
                    name="name"
                    text={tokenName}
                    theme={theme}
                    atChange={(event) => setTokenName(event.target.value)}
                    atKeyDown={handleEnter}
                />

                <PluridInputSwitch
                    name="use origins"
                    checked={tokenUseOrigins}
                    atChange={() => setTokenUseOrigins(use => !use)}
                    theme={theme}
                />

                {tokenUseOrigins && (
                    <>
                        <PluridInputLine
                            name="origin"
                            text={tokenOrigin}
                            theme={theme}
                            atChange={(event) => setTokenOrigin(event.target.value)}
                            textline={{
                                enterAtClick: () => {
                                    const isOrigin = network.isOrigin(tokenOrigin);
                                    if (!isOrigin) {
                                        if (addNotification) {
                                            addNotification({
                                                id: uuid.generate(),
                                                text: `'${tokenOrigin}' does not look like an origin`,
                                                timeout: 4_000,
                                            });
                                        }
                                    }

                                    setTokenOrigins(values => [
                                        ...values,
                                        tokenOrigin,
                                    ]);
                                    setTokenOrigin('');
                                },
                            }}
                        />

                        <PluridEntityPillGroup
                            entities={tokenOrigins}
                            remove={(id) => {
                                const updatedOrigins = tokenOrigins.filter(origin => origin !== id);
                                setTokenOrigins(updatedOrigins);
                            }}
                            theme={theme}
                            style={{
                                marginTop: '1rem',
                            }}
                        />
                    </>
                )}

                <PluridInputSwitch
                    name="use IPs"
                    checked={tokenUseIPs}
                    atChange={() => setTokenUseIPs(use => !use)}
                    theme={theme}
                />

                {tokenUseIPs && (
                    <>
                        <PluridInputLine
                            name="ip"
                            text={tokenIP}
                            theme={theme}
                            atChange={(event) => setTokenIP(event.target.value)}
                            textline={{
                                enterAtClick: () => {
                                    const isIP = network.isIP(tokenIP);
                                    if (!isIP) {
                                        if (addNotification) {
                                            addNotification({
                                                id: uuid.generate(),
                                                text: `'${tokenIP}' does not look like an IP`,
                                                timeout: 4_000,
                                            });
                                        }
                                    }

                                    setTokenIPs(values => [
                                        ...values,
                                        tokenIP,
                                    ]);
                                    setTokenIP('');
                                },
                            }}
                        />

                        <PluridEntityPillGroup
                            entities={tokenIPs}
                            remove={(id) => {
                                const updatedIPs = tokenIPs.filter(ip => ip !== id);
                                setTokenIPs(updatedIPs);
                            }}
                            theme={theme}
                            style={{
                                marginTop: '1rem',
                            }}
                        />
                    </>
                )}

                <PluridInputSwitch
                    name="use key"
                    checked={tokenUseKey}
                    atChange={() => setTokenUseKey(use => !use)}
                    theme={theme}
                />

                {tokenUseKey && (
                    <PluridInputLine
                        name="key"
                        text={tokenKey}
                        theme={theme}
                        atChange={(event) => setTokenKey(event.target.value)}
                    />
                )}

                <StyledPluridPureButton
                    text={editID ? 'Update Token' : 'Generate Token'}
                    atClick={tokenAction}
                    level={2}
                    disabled={!tokenValid}
                />

                {cancel && (
                    <StyledPluridLinkButton
                        text="cancel"
                        atClick={() => cancel()}
                        theme={theme}
                        level={2}
                    />
                )}
            </StyledToken>
        );
    }

    return (
        <StyledTokenAdded
            theme={theme}
        >
            <StyledH1>
                token added
            </StyledH1>

            <div
                style={{
                    margin: '4rem 0',
                }}
            >
                <div
                    style={{
                        marginBottom: '1rem',
                    }}
                >
                    save the token value
                </div>

                <StyledTokenValue>
                    <PluridCopyableLine
                        data={tokenValue}
                    />
                </StyledTokenValue>
            </div>

            <StyledPluridPureButton
                text="Value Saved"
                atClick={() => {
                    if (clientToken) {
                        action(clientToken);
                    }

                    if (cancel) {
                        cancel();
                    }
                }}
                level={2}
            />
        </StyledTokenAdded>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Token;
// #endregion exports
