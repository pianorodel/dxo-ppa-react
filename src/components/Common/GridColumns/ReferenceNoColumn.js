import { useState } from 'react';

export const ReferenceNoColumn = ({ text = '', onClick, color }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyClick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);

        // Reset the message after 2 seconds
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div onClick={onClick} style={{ alignItems: "center", verticalAlign: "middle", cursor: onClick ? "pointer" : "default", color: color || '#0ab39c' }}>
            {text} {' '}
            {text && (<i
                className="ri-file-copy-line text-muted"
                title={copied ? 'Copied to Clipboard' : 'Copy to Clipboard'}
                onClick={handleCopyClick}
                style={{ cursor: 'pointer' }}
            />)}
            {copied && (
                <span className="text-success ms-1" style={{ fontSize: '0.85em' }}>
                    Copied
                </span>
            )}
        </div>
    )
}