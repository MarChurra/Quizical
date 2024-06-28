import React from "react";

export default function Notification({ showNotification, onHide }) {
    const [animate, setAnimate] = React.useState(showNotification);
    let timer, hideTimer;
    let isNotificationActive = false;
    const prevShowNotificationRef = React.useRef(false)

    React.useEffect(() => {
        if (showNotification && !isNotificationActive && showNotification !== prevShowNotificationRef.current) {
            isNotificationActive = true;
            setAnimate(true);
            timer = setTimeout(() => {
                setAnimate(false);
                hideTimer = setTimeout(onHide, 1750);
            }, 1500);
            return () => {
                clearTimeout(timer);
                clearTimeout(hideTimer);
                isNotificationActive = false;
            };
        }
        prevShowNotificationRef.current = showNotification;
    }, [showNotification, onHide]);

    return (
        <p
            className={`notification ${animate ? "fade-in" : "fade-out"}`}
        >
            Please answer all the questions before proceeding
        </p>
    )
}