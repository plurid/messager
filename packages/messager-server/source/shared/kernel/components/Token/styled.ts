// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries
// #endregion imports



// #region module
export interface IStyledToken {
    theme: Theme;
}

export const StyledToken = styled.div<IStyledToken>`
    display: grid;
    text-align: center;
    min-height: 700px;
    width: 350px;
    margin: 0 auto;
`;


export interface IStyledTokenAdded {
    theme: Theme;
}

export const StyledTokenAdded = styled.div<IStyledTokenAdded>`
    display: grid;
    place-content: center;
    text-align: center;
    min-height: 700px;
    margin: 0 auto;
`;


export const StyledTokenValue = styled.div`
    font-size: 1.1rem;
    line-height: 2;
`;
// #endregion module
