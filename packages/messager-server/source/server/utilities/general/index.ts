// #region module
export const cleanFileName = (
    name: string,
) => {
    return name.replace(/\//, '-');
}


export const compareValues = <T>(
    key: string,
    order = 'asc',
) => {
    return (
        a: T,
        b: T,
    ) => {
        if (!(a as any).hasOwnProperty(key) || !(b as any).hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
        }

        const varA = (typeof (a as any)[key] === 'string')
            ? (a as any)[key].toUpperCase()
            : (a as any)[key];
        const varB = (typeof (b as any)[key] === 'string')
            ? (b as any)[key].toUpperCase()
            : (b as any)[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }

        return (
            (order === 'desc')
                ? (comparison * -1)
                : comparison
        );
    };
}


export const removeDuplicates = <T>(
    data: T[],
    key: string,
) => {
    return data.filter(
        (obj, pos, arr) => arr.map(mapObj => (mapObj as any)[key]).indexOf((obj as any)[key]) === pos
    );
}
// #endregion module
