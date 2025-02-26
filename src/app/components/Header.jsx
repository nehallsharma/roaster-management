"use client";

import React from "react";
import Image from "next/image";
import DoubleLeftArrow from "../../../public/icons/DoubleLeftArrow.svg";
import calender from "../../../public/icons/calender.svg";
import list from "../../../public/icons/list.svg";
import { useState } from "react";

const Header = ({ onCalenderClick, onListClick }) => {
    const [active, setActive] = useState("list");

    const handleListClick = () => {
        setActive("list");
        onListClick();
    };

    const handleCalenderClick = () => {
        setActive("calender");
        onCalenderClick();
    };

    return (
        <header className="p-4 bg-white shadow">
            <div className="px-6 flex items-center">
                <Image src={DoubleLeftArrow} alt="Back" />
                <h1 className="font-semibold text-xl pl-6 text-[#4C4C4C]">Provider Management</h1>
                <div className="border-2 ml-auto border-[#E0E0E0] rounded-lg flex items-center">
                    <div
                        className={`p-2 ${active === "list" ? "bg-[#DBE7CC]" : ""}`}
                        onClick={handleListClick}
                    >
                        <Image src={list} alt="List" />
                    </div>
                    <div
                        className={`p-2 border-l-2 border-[#E0E0E0] ${active === "calender" ? "bg-[#DBE7CC]" : ""}`}
                        onClick={handleCalenderClick}
                    >
                        <Image src={calender} alt="Calender" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
