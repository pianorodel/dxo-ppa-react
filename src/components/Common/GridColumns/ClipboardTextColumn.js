import { useState } from 'react';

export const ClipboardTextColumn = ({ text = '', onClick }) => {
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
        <div onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
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