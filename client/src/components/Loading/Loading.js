import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import {Spinner} from "reactstrap";
import './Loading.css'
import {BASE_API_URL} from "../../constants/index.js";
import {convertBlobToBase64 } from "../../utils/utilities.js";

export default function Loading() {
    const [imageSrc, setImageSrc] = useState(null);
    const [imageName, setImageName] = useState(null);

    useEffect(() => {
        async function fetchImage() {
            try {
                const response = await axios.get(`${BASE_API_URL}/get_image`, { responseType: 'arraybuffer' });
                const blob = new Blob([response.data], { type: 'image/png' });
                const base64 = await convertBlobToBase64(blob);
                console.log(base64)
                setImageSrc(base64);

                setImageName('washing machine');
            } catch (error) {
                console.error(error);
            }
        }
        fetchImage();
    }, []);

    return (
        <div className="text-center">
            {imageSrc ?
                <>
                 <p className="uploaded-message">image uploaded, let's start !</p>
                <Link to='/image_mark'
                      state={{ image_url: imageSrc, image_name: imageName  }}
                      className="start-link"
                >
                    go to image mark
                </Link>
                </>
                :
                <>
                <Spinner className="m-5" color="primary"/>
                    <p className="loading">Loading...</p>
                </>
            }
        </div>
    );
}
