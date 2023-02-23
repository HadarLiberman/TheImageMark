import {RECTANGLE_HEIGHT, RECTANGLE_WIDTH} from "../constants/index.js";


export function coordinatesCalculation(x,y){
    const coordinates ={
        "top_left_coordinate": [x,y],
        "top_right_coordinate": [x + RECTANGLE_WIDTH,y],
        "bottom_left_coordinate": [x ,y + RECTANGLE_HEIGHT],
        "bottom_right_coordinate": [x + RECTANGLE_WIDTH, y + RECTANGLE_HEIGHT]
    }
    Object.keys(coordinates).forEach(function(key){ coordinates[key] = coordinates[key].join(',') });
    return coordinates;
}

export function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}


