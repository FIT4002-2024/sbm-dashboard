/**
 * Returns a newly constructed date in the current timezone of the server.
 * Currently only accepts an optional int input that is time elapsed since epoch in ms.
 *
 */
export const newDateInLocale = (timeSinceEpoch?: number): Date => {
    const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(currentTimezone)
    let returnTime: Date = timeSinceEpoch ? new Date(timeSinceEpoch): new Date();
    const returnTimeLocal = new Date(returnTime.toLocaleString('en-US', {timeZone: currentTimezone}));
    return returnTimeLocal;
}