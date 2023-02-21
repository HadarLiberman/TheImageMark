import React, {useEffect, useRef, useState} from 'react';
import { useLocation } from 'react-router-dom';
import {Button} from "reactstrap";
export default function ImageMark(props) {

    const location = useLocation();

    const [imageUrl, setImageUrl] = useState(location.state.image);
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);
    const [image, setImage] = useState(null);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [rectangles, setRectangles] = useState([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        setCtx(context);
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            setImage(img);
        }
    }, []);

    function handleCanvasClick(event) {
        if (ctx && image && isDrawingMode) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left - 150; // center of rectangle is 150px to the left of the cursor
            const y = event.clientY - rect.top - 150; // center of rectangle is 150px above the cursor
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2; // adjust as needed
            ctx.strokeRect(x, y, 300, 300);
            setIsDrawingMode(false);
        }
    }
    function handleNewRectangleClick() {
        setIsDrawingMode(true);
    }
    const isButtonDisabled = isDrawingMode;

    return (
        <>
        <canvas ref={canvasRef} onClick={handleCanvasClick} width={800} height={800}  style={{cursor: isDrawingMode ? 'pointer' : 'auto'}}/>
        <button onClick={handleNewRectangleClick} disabled={isButtonDisabled}>New Rectangle</button>
        </>
    );

}