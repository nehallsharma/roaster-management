"use client";

import React, { useState } from "react";
import Header from "./Header";
import CalendarComponent from "./CalendarComponent";
import ListComponent from "./ListComponent";
import Sidebar from "./Sidebar";

const MainComponent = () => {
    const [view, setView] = useState("list");
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ service: "", type: "", centre: "" });

    const handleCalenderClick = () => {
        setView("calender");
    };

    const handleListClick = () => {
        setView("list");
    };

    return (
        <div className="flex flex-col h-screen">
            <Header onCalenderClick={handleCalenderClick} onListClick={handleListClick} />
            <div className="flex flex-1">
                <div className="w-1/4">
                    <Sidebar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filters={filters}
                        setFilters={setFilters}
                    />
                </div>
                <div className="w-3/4 border border-[#E0E0E0] overflow-auto">
                    {view === "calender" && <CalendarComponent searchTerm={searchTerm} filters={filters} />}
                    {view === "list" && <ListComponent searchTerm={searchTerm} filters={filters} />}
                </div>
            </div>
        </div>
    );
};

export default MainComponent;   