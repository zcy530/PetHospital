import React from "react";
import { useParams } from "react-router-dom";


const ProcessDetail = () => {

    const params = useParams();
    console.log(params)

    return (
        <>
            <text>this is process detail</text>
        </>
    );
};

export default ProcessDetail;