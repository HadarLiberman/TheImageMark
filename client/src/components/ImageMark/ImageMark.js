import React, {useEffect, useRef, useState} from 'react';
import { useLocation } from 'react-router-dom';
import {Button, ButtonGroup, Col, Container, Input} from "reactstrap";
import {
    BASE_API_URL,
    CANVAS_HEIGHT,
    CANVAS_WIDTH, IMAGE_NAME_PATTERN,
    RECTANGLE_COLOR,
    RECTANGLE_HEIGHT,
    RECTANGLE_STROKE_SIZE,
    RECTANGLE_WIDTH
} from "../../constants/index.js";
import { coordinatesCalculation, dataURItoBlob} from "../../utils/utilities.js";
import axios from "axios";
import "./ImageMark.css"
import Cookies from 'js-cookie';
import {useClearCanvas} from "../useClearCanvas.js";
export default function ImageMark(props) {

    const location = useLocation();
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);

    const [sourceImageUrl, setSourceImageUrl] = useState(location.state.image_url);
    const [sourceImageName, setSourceImageName] = useState(location.state.image_name);
    const [slicedImageUrl, setSlicedImageUrl] = useState(null);
    const [deviceImage, setDeviceImage] = useState(null);

    const [croppedSettings, setCroppedSettings] = useState({});

    const [inputValue, setInputValue] = useState('');

    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [isSaveProcess, setIsSaveProcess] = useState(false);
    const [isClearCanvas, setIsClearCanvas] = useState(false)
    const [isProcessSucssed, setIsProcessSucssed] = useState(false)



    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.canvas.willReadFrequently = true;
        setCtx(context);
        const canvas_image = new Image();
        canvas_image.src = sourceImageUrl;
        console.log(sourceImageUrl);
        canvas_image.onload = () => {
            context.drawImage(canvas_image, 0, 0, canvas.width, canvas.height);
            setDeviceImage(canvas_image);
        }

    }, []);



    useClearCanvas(()=>{
        if(deviceImage && ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(deviceImage, 0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    },[isClearCanvas])


    async function SendImage(cropped_image_name){
        croppedSettings.image_settings["image_name"]=`${cropped_image_name}.png`;
        const formData = new FormData();
        formData.append("image", dataURItoBlob(slicedImageUrl), `${cropped_image_name}.png`);
        formData.append('image_settings', JSON.stringify(croppedSettings.image_settings));
        const headers = {
            "Content-Type": "multipart/form-data"
        }
        let response=null;
        try {
            response = await axios.post(`${BASE_API_URL}/process_rectangle/`, formData,
                {headers, xsrfCookieName: 'csrftoken', xsrfHeaderName: 'X-CSRFTOKEN', withCredentials: true})
        }catch (e) {
            console.log(e)
        }
        return response;

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

    function cropImage(x_coordinate, y_coordinate){
        const slicedImage = ctx.getImageData(x_coordinate, y_coordinate, RECTANGLE_WIDTH, RECTANGLE_HEIGHT);
        const canvasForSlicedImage = document.createElement("canvas");
        canvasForSlicedImage.width = slicedImage.width;
        canvasForSlicedImage.height = slicedImage.height;
        canvasForSlicedImage.getContext("2d").putImageData(slicedImage, 0, 0);
        setSlicedImageUrl(canvasForSlicedImage.toDataURL());
    }

    async function HandleSaveCroppedImage() {
        const isValid = IMAGE_NAME_PATTERN.test(inputValue);
        if (!isValid) {
            alert('please enter a valid name that includes only letters');
            setInputValue("")
            return;
        }

        const response = await SendImage(inputValue)
        if(response?.status === 201) {
            alert("image successfully saved")
        }
        else{
            setIsClearCanvas(!isClearCanvas);
            alert("something went wrong, please try again")
        }

        setIsClearCanvas(!isClearCanvas);
        setIsSaveProcess(false);
        setIsProcessSucssed(true);
        setInputValue('');
        setIsDrawingMode(false);
    }
    async function handleCanvasClick(event) {
        if (ctx && deviceImage && isDrawingMode) {
            const {x,y} = paintRectangle(event.clientX, event.clientY);
            const rec_coordinates = coordinatesCalculation(x, y);
            cropImage(x,y);
            setIsProcessSucssed(false)
            setCroppedSettings({image_settings:rec_coordinates})
            setIsSaveProcess(true)
        }
    }

    function handleNewRectangleClick() {
        setIsDrawingMode(true);
    }

    function handleInputChange(event) {
        setInputValue(event.target.value);
    }

    return (
            <div className="text-center">
                <Container >
                    <Col>
                       <p className="source-image-name">File name: {sourceImageName}</p>
                    </Col>
                    <Col>
                <ButtonGroup>
                    <Button color="primary" onClick={handleNewRectangleClick} disabled={isDrawingMode} className="new-rec-btn">New Rectangle</Button>
                    <Button color="primary" onClick={HandleSaveCroppedImage} disabled={!isSaveProcess}>save</Button>
                </ButtonGroup >
                    </Col>
                    {slicedImageUrl && (!isProcessSucssed) ?
                        <Col>
                        <Input className="new-image-input" placeholder={"please select a name for the image"}
                               type="text" value={inputValue} onChange={handleInputChange} ></Input>
                        </Col> :null }
                </Container>
                 <canvas ref={canvasRef} onClick={handleCanvasClick} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}
                         style={{cursor: isDrawingMode ? 'pointer' : 'auto'}}/>
            </div>
    );

}