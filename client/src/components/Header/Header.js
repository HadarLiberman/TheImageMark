import React, { Component } from "react";
import logo from "../../assets/techsee_logo.png"
import './Header.css'


export default function Header() {
        return (
            <div className="text-center">
                <img src={logo} alt="Logo" className="logo"/>
            </div>
        );
}
