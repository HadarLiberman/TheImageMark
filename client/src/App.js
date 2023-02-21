import * as React from "react";
import './App.css';
import { Route, Routes} from "react-router-dom";
import Header from "./components/Header.js";
import Loading from "./components/Loading.js";
import ImageMark from "./components/ImageMark.js";

export default function App(){
  return (
      <>
        <Header/>
      <Routes>
          <Route path="/" element={<Loading />} />
          <Route path="/image_mark" element={<ImageMark />} />
      </Routes>
      </>
  );

}

