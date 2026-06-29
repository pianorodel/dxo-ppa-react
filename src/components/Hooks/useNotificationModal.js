import { useState } from 'react';
import ErrorNotification from '../Common/Modals/ErrorNotification';
import RejectNotification from '../Common/Modals/RejectNotification';
import SuccessNotification from '../Common/Modals/SuccessNotification';

// sample usage:
// import lang sa taas parang custom hooks
// const { notification, NotificationContainer } = useNotificationModal();
// 
// tas pwede mo na gamitin after mag return yung api success man or error
// notification({ type: 'success', title: 'Vehicle Information', message: "Successfully Added!" });
// 
// ito yung container nya para lumabas yung modal, need to ilagay sa parent kung saan ka mag papalabas ng notif e.g index.js
// <NotificationContainer />


export const useNotificationModal = () => {
    const [visible, setVisible] = useState(false);
    const [type, setType] = useState('success');
    const [content, setContent] = useState({
        header: '',
        title: '',
        message: '',
    });

    const [customCloseButton, setCustomCloseButton] = useState(null);

    const COMPONENT_MAP = {
        success: SuccessNotification,
        error: ErrorNotification,
        reject: RejectNotification,
    };

    const HEADER_MAP = {
        success: 'Success',
        error: 'Error',
        reject: 'Rejected',
    };

    const notification = ({
        type = 'success',
        title = 'Success',
        message = 'Successfully Saved!',
        header,
        customCloseButton = null,
    }) => {
        setContent({
            header: header || HEADER_MAP[type],
            title,
            message,
        });

        setType(type);
        setVisible(true);
        setCustomCloseButton(customCloseButton);
    };

    const hideModal = () => {
        setVisible(false);
        setCustomCloseButton(null);
    };

    const NotificationContainer = () => {
        if (!visible || !COMPONENT_MAP[type]) return null;

        const NotificationModal = COMPONENT_MAP[type];
        return (
            <NotificationModal
                header={content.header}
                title={content.title}
                message={content.message}
                show={visible}
                onCloseClick={hideModal}
                customCloseButton={customCloseButton}
            />
        );
    };

    return { notification, hideModal, NotificationContainer };
};
