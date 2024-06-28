import React from "react";

export default function Notification({ showNotification, onHide }) {
    const [animate, setAnimate] = React.useState(false);
    let timer, hideTimer; 

    React.useEffect(() => {
        if (showNotification) {
            setAnimate(true);
            timer = setTimeout(() => {
                setAnimate(false);
                hideTimer = setTimeout(onHide, 2500);
            }, 2000);
            return () => {
                clearTimeout(timer);
                clearTimeout(hideTimer); 
            };
        }
    }, [showNotification, onHide]);

    return (
        <p
            className={`notification ${animate ? "fade-in" : "fade-out"}`}
        >
            Please answer all the questions before proceeding
        </p>
    )
}