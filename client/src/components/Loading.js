import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

export default function Loading() {
    const [imageSrc, setImageSrc] = useState(null);
    const [imageName, setImageName] = useState(null);

    useEffect(() => {
        async function fetchImage() {
            try {
                const response = await axios.get('http://localhost:8000/api/get_image/', { responseType: 'arraybuffer' });
                const blob = new Blob([response.data], { type: 'image/png' });
                setImageSrc(URL.createObjectURL(blob));
                console.log(response.headers['filename'])
                //setImageName(response.headers['content-disposition'].split('"')[1]);
            } catch (error) {
                console.error(error);
            }
        }
        fetchImage();
    }, []);

    return (
        <div>
            {imageSrc ? (
                <>
                    <h1>image uploaded</h1>

                </>
            ) : (
                <p>Loading...</p>
            )}
            <Link to='/image_mark'
                state={{ image: imageSrc }}
            >
                Go to ImageMark
            </Link>
        </div>
    );
}
