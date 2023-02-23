import {useEffect} from "react";

export const useClearCanvas = (callback, dependencies) => {
    useEffect(() => {
        callback();
    }, dependencies);
};