// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries
// #endregion imports



// #region module
export interface IStyledRecord {
    theme: Theme;
}

export const StyledRecord = styled.div<IStyledRecord>`
    font-family: ${
        ({
            theme,
        }: IStyledRecord) => theme.fontFamilySansSerif
    };

    padding: 4rem;

    h1 {
        font-size: 2rem;
        font-weight: normal;
        margin: 0;
        line-height: 2;
        word-break: break-word;
    }

    h2 {
        font-size: 1.2rem;
        font-weight: normal;
        margin: 0;
    }
`;
// #endregion module
