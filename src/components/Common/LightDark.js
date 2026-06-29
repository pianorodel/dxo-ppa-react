import React from 'react';

//constants
import { layoutModeTypes } from "@/components/constants/layout";

const LightDark = ({ layoutMode, onChangeLayoutMode }) => {

    const mode = layoutMode === layoutModeTypes['DARKMODE'] ? layoutModeTypes['LIGHTMODE'] : layoutModeTypes['DARKMODE'];

    return (
        <div className="ms-1 header-item d-sm-flex">
            <button
                onClick={() => onChangeLayoutMode(mode)}
                type="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle light-dark-mode">
                <i className='bx bx-moon fs-22' title={layoutMode === layoutModeTypes['DARKMODE'] ? "Toggle Light Mode" : "Toggle Dark Mode"}></i>
            </button>
        </div>
    );
};

export default LightDark;