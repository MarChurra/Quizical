import React from "react";



export default function Loader() {
    return (
        <div className="loading-screen">
            <h2 className="loading-text">App is currently loading, please wait...</h2>
            <div className="loader"></div>
        </div>
    )
}