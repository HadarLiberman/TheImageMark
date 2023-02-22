import React, {useEffect, useRef, useState} from 'react';
import { useLocation } from 'react-router-dom';
import {Button} from "reactstrap";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    RECTANGLE_COLOR,
    RECTANGLE_HEIGHT,
    RECTANGLE_STROKE_SIZE,
    RECTANGLE_WIDTH
} from "../constants/index.js";
import axios from "axios";
import Cookies from 'js-cookie';
export default function ImageMark(props) {

    const location = useLocation();

    const [imageUrl, setImageUrl] = useState(location.state.image_url);
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);
    const [deviceImage, setDeviceImage] = useState(null);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [croppedSettings, setCroppedSettings] = useState({});
    const [slicedImageUrl, setSlicedImageUrl] = useState(null);
    const [isSaveProcess, setIsSaveProcess] = useState(false);
    const [isNewCanvas, setIsNewCanvas] = useState(false)


    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        setCtx(context);
        const canvas_image = new Image();
        canvas_image.src = imageUrl;
        console.log(imageUrl);
        canvas_image.onload = () => {
            context.drawImage(canvas_image, 0, 0, canvas.width, canvas.height);
            setDeviceImage(canvas_image);
        }
    }, [isSaveProcess]);

    async function HandleSaveCroppedImage() {
        setIsSaveProcess(true);
        // console.log("from upload",blob)
        // const formData = new FormData();
        // formData.append('image', blob);
        console.log(croppedSettings);
        const response = await axios({
          method:'post',
          url: 'http://localhost:8000/api/process_rectangle/',
          data:croppedSettings,
          xsrfCookieName: 'csrftoken',
          xsrfHeaderName: 'X-CSRFTOKEN',
          withCredentials: true
            })
        // response.status === 201? setIsSaveProcess(false): null

    }

    function coordinatesCalculation(x,y){
        const coordinates ={
            "top_left_coordinate": [x,y],
            "top_right_coordinate": [x + RECTANGLE_WIDTH,y],
            "bottom_left_coordinate": [x ,y + RECTANGLE_HEIGHT],
            "bottom_right_coordinate": [x + RECTANGLE_WIDTH, y + RECTANGLE_HEIGHT]
        }
        Object.keys(coordinates).forEach(function(key){ coordinates[key] = coordinates[key].join(',') });
        return coordinates;
    }


    function paintRectangle(x_coordinate,y_coordinate){
        const rect = canvasRef.current.getBoundingClientRect();
        const x = x_coordinate - rect.left - RECTANGLE_WIDTH/2;
        const y = y_coordinate - rect.top - RECTANGLE_HEIGHT/2;
        ctx.strokeStyle = RECTANGLE_COLOR;
        ctx.lineWidth = RECTANGLE_STROKE_SIZE;
        ctx.strokeRect(x, y, RECTANGLE_WIDTH, RECTANGLE_HEIGHT);
        return {x,y}
    }

    function croppedImage(x_coordinate, y_coordinate){
        const slicedImage = ctx.getImageData(x_coordinate, y_coordinate, RECTANGLE_WIDTH, RECTANGLE_HEIGHT);
        // const canvasForSlicedImage = document.createElement("canvas");
        // canvasForSlicedImage.width = slicedImage.width;
        // canvasForSlicedImage.height = slicedImage.height;
        // canvasForSlicedImage.getContext("2d").putImageData(slicedImage, 0, 0);
        // setSlicedImageUrl(canvasForSlicedImage.toDataURL());
        const blob = new Blob([slicedImage], { type: 'image/png' });
        return blob;
    }
    async function handleCanvasClick(event) {
        if (ctx && deviceImage && isDrawingMode) {
            const {x,y} = paintRectangle(event.clientX, event.clientY);
            const rec_coordinates = coordinatesCalculation(x, y);
            console.log(rec_coordinates);
            const cropped_image = croppedImage(x,y);
            console.log(cropped_image)

            const new_data = {
                cropped_image:"canvasForSlicedImage.toDataURL()",
                image_settings:{image_name:"cropped.png",...rec_coordinates}
            }
            setCroppedSettings(new_data)
            setIsDrawingMode(false);
        }
    }

    function handleNewRectangleClick() {
        setIsDrawingMode(true);
    }
    const isButtonDisabled = isDrawingMode;

    return (
        <>
        <canvas ref={canvasRef} onClick={handleCanvasClick} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}  style={{cursor: isDrawingMode ? 'pointer' : 'auto'}}/>
        <Button onClick={handleNewRectangleClick} disabled={isButtonDisabled}>New Rectangle</Button>
            {slicedImageUrl && <img src={slicedImageUrl} alt="Sliced image" />}
        <Button onClick={HandleSaveCroppedImage}>save</Button>
        </>
    );

}