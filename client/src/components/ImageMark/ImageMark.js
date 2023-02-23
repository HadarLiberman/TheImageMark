import React, {useEffect, useRef, useState} from 'react';
import { useLocation } from 'react-router-dom';
import {Button, ButtonGroup, Col, Container, Input} from "reactstrap";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    RECTANGLE_COLOR,
    RECTANGLE_HEIGHT,
    RECTANGLE_STROKE_SIZE,
    RECTANGLE_WIDTH
} from "../../constants/index.js";
import { coordinatesCalculation, dataURItoBlob} from "../../utils/utilities.js";
import axios from "axios";
import "./ImageMark.css"
import Cookies from 'js-cookie';
export default function ImageMark(props) {

    const location = useLocation();

    const [sourceImageUrl, setSourceImageUrl] = useState(location.state.image_url);
    const [sourceImageName, setSourceImageName] = useState(location.state.image_name);
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);
    const [deviceImage, setDeviceImage] = useState(null);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [croppedSettings, setCroppedSettings] = useState({});
    const [slicedImageUrl, setSlicedImageUrl] = useState(null);
    const [isSaveProcess, setIsSaveProcess] = useState(false);
    const [isNewCanvas, setIsNewCanvas] = useState(false)
    const [inputValue, setInputValue] = useState('');
    const [isProcessSucssed, setIsProcessSucssed] = useState(false)

    function handleInputChange(event) {
        setInputValue(event.target.value);
    }


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

    function RefreshCanvas(){
        const canvas = canvasRef.current;
        const canvas_image = new Image();
        canvas_image.src = sourceImageUrl;
        console.log(sourceImageUrl);
        canvas_image.onload = () => {
            ctx.drawImage(canvas_image, 0, 0, canvas.width, canvas.height);
            setDeviceImage(canvas_image);
        }
    }


    async function HandleSaveCroppedImage() {

        const pattern = /^[a-zA-Z]+$/;
        const isValid = pattern.test(inputValue);
        if (!isValid) {
            alert('please enter a valid name that includes only letters');
            setInputValue("")
            return;
        }
        setIsNewCanvas(true);
        RefreshCanvas()

        croppedSettings.image_settings["image_name"]=`${inputValue}.png`;
        const formData = new FormData();
        formData.append("image", dataURItoBlob(slicedImageUrl), `${inputValue}.png`);
        console.log("setting",croppedSettings)
        formData.append('image_settings', JSON.stringify(croppedSettings.image_settings));
        const headers = {
            "Content-Type": "multipart/form-data"
        }

        const response = await axios.post('http://localhost:8000/api/process_rectangle/', formData,
          { headers,
          xsrfCookieName: 'csrftoken',
          xsrfHeaderName: 'X-CSRFTOKEN',
          withCredentials: true
        })
        if(response.status === 201) {
            alert("image successfully saved")
        }
        else{
            alert("something went wrong, please try again")
        }
        setIsSaveProcess(false);
        setIsProcessSucssed(true);
        setInputValue('')

        console.log(response)

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
        const canvasForSlicedImage = document.createElement("canvas");
        canvasForSlicedImage.width = slicedImage.width;
        canvasForSlicedImage.height = slicedImage.height;
        canvasForSlicedImage.getContext("2d").putImageData(slicedImage, 0, 0);
        setSlicedImageUrl(canvasForSlicedImage.toDataURL());
        //setSlicedImageUrl(slicedImage);
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
                image_settings:rec_coordinates
            }
            setIsProcessSucssed(false)
            setCroppedSettings(new_data)
            setIsDrawingMode(false);
            setIsSaveProcess(true)
        }
    }

    function handleNewRectangleClick() {
        setIsDrawingMode(true);
    }

    return (
            <div className="text-center">
                <Container >
                    <Col>
                       <p className="source-image-name">{sourceImageName}</p>
                    </Col>
                    <Col>
                <ButtonGroup>
                    <Button color="primary" onClick={handleNewRectangleClick} disabled={isDrawingMode} className="new-rec-btn">New Rectangle</Button>
                    <Button color="primary" onClick={HandleSaveCroppedImage} disabled={!isSaveProcess}>save</Button>
                </ButtonGroup >
                    </Col>
                    {slicedImageUrl && (!isProcessSucssed) ?
                        <Col>
                        {/*<img src={slicedImageUrl} alt="Sliced image" />*/}
                        <Input className="new-image-input" placeholder={"please select a name for the image"} type="text" value={inputValue} onChange={handleInputChange} ></Input>
                        </Col> :null }
                </Container>
                 <canvas ref={canvasRef} onClick={handleCanvasClick} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}  style={{cursor: isDrawingMode ? 'pointer' : 'auto'}}/>




            </div>
    );

}