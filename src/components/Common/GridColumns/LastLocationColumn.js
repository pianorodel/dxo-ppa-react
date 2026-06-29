import { DateTimeColumn } from "./DateTimeColumn";

export const LastLocationColumn = ({ lastKnownLocation = '', lastSeenOnLocation = '' }) => {
    return (
        (lastKnownLocation &&
            <>
                {lastKnownLocation}
                <p>
                    <DateTimeColumn value={lastSeenOnLocation} />
                </p>
            </>
        )
    )
}
