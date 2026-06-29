export const EmailLink = ({ email, subject, body }) => {
    if (!email) return null;

    // Split by comma or semicolon and trim whitespace
    const emails = email.split(/[,;]/).map(e => e.trim()).filter(e => e);

    // If only one email, use the original logic
    if (emails.length === 1) {
        let mailto = `mailto:${emails[0]}`;
        const params = [];

        if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
        if (body) params.push(`body=${encodeURIComponent(body)}`);

        if (params.length > 0) mailto += `?${params.join("&")}`;

        return (
            <a href={mailto} style={{ color: "rgb(41, 156, 219)" }} className="flex items-center gap-2">
                <i className="ri-mail-line text-muted" />{" "}
                <span className="text-wrap">{emails[0]}</span>
            </a>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <i className="ri-mail-line text-muted" />{" "}
            <>
                {emails.map((e, index) => {
                    let mailto = `mailto:${e}`;
                    const params = [];

                    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
                    if (body) params.push(`body=${encodeURIComponent(body)}`);

                    if (params.length > 0) mailto += `?${params.join("&")}`;

                    return (
                        <span key={index}>
                            {index > 0 && <span style={{ marginLeft: '1rem' }} />}
                            <a className="text-wrap" href={mailto} style={{ color: "rgb(41, 156, 219)" }}>
                                {e}
                            </a>
                            {index < emails.length - 1 && <br />}
                        </span>
                    );
                })}
            </>
        </div>
    );
};