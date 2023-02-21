import * as React from "react";
import './App.css';
import {Link, Route, Routes} from "react-router-dom";
import Header from "./components/Header.js";
import Loading from "./components/Loading.js";

export default function App(){
  return (
      <>
        <Header/>
      <Routes>
          <Route path="/" element={<Loading />} />
      </Routes>
      </>
  );

}

