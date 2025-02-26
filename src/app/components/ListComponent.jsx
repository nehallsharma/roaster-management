"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import leftArrow from "../../../public/icons/leftArrow.svg";
import providersData from "../data/mockProviders.json";
import offline from "../../../public/icons/offline.svg";
import online from "../../../public/icons/online.svg";
import DatePicker from "./DateSelector";
import CalendarComponent from "./CalendarComponent";
import { slotColors } from "../helper";

const ListComponent = ({ searchTerm, filters }) => {
    const [providers, setProviders] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [showCalendar, setShowCalendar] = useState(false); 
    const [selectedProvider, setSelectedProvider] = useState(null);

    useEffect(() => {
        setProviders(providersData.providers);
    }, []);

    const filteredProviders = providers.filter(provider => {
        const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesService = filters.service ? provider.provider_usertype === filters.service : true;
        const matchesType = filters.type ? (provider.is_inhouse ? "Inhouse" : "External") === filters.type : true;
        const matchesCentre = filters.centre ? provider.clinic_details.name === filters.centre : true;
        
        return matchesSearch && matchesService && matchesType && matchesCentre;
    });

    
    const handleViewCalendar = (provider) => {
        setSelectedProvider(provider); 
        setShowCalendar(true);
    };

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 0; hour <= 23; hour++) { // 8 AM to 11 PM
            for (let minute = 0; minute < 60; minute += 15) {
                const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
                slots.push(time);
            }
        }

        return slots;
    };

    const timeSlots = generateTimeSlots();

    const getSlotStatus = (provider, time) => {
        const availability = provider.availabilities.find(avail => avail.date === selectedDate);
        if (!availability) return "default";

        if (availability.blocked_slots.includes(time)) return "blocked";
        if (availability.online_booked_slots.includes(time)) return "onlineBooked";
        if (availability.offline_booked_slots.includes(time)) return "offlineBooked";
        if (availability.both_slots.includes(time)) return "both";
        if (availability.online_slots.includes(time)) return "online";
        if (availability.offline_slots.includes(time)) return "offline";

        return "default"; // If time slot is not found
    };

    return (
        <div className="flex flex-col h-full w-full">
            {showCalendar && selectedProvider ? (
                <CalendarComponent
                    searchTerm={selectedProvider.name} 
                    filters={filters}
                />
            ) : (
                <main className="flex flex-col w-full">
                    {/* Date Picker */}
                    <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} tab="SlotView" />

                    {/* Schedule Information */}
                    <div className="flex justify-between items-center bg-white p-4 shadow">
                        <div className="flex flex-col gap-1">
                            <h3 className="font-semibold">Showing full schedules for {new Date(selectedDate).toDateString()}</h3>
                            <h6 className="font-normal">Showing slots in the 8 am to 11 pm window.</h6>
                        </div>
                        <div className="grid grid-cols-3 grid-rows-2 gap-2">
                            {Object.entries(slotColors).map(([key, color]) => (
                                <div key={key} className="flex items-center gap-1">
                                    <div className="rounded-lg w-4 h-2" style={{ backgroundColor: color }}></div>
                                    <h6 className="capitalize">{key.replace(/([A-Z])/g, " $1")}</h6>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Providers List */}
                    <div className="bg-white">
                        {filteredProviders.length > 0 ? (
                            filteredProviders.map((provider, idx) => (
                                <div key={idx} className="p-6 flex gap-4 w-full">
                                    {/* Provider Info */}
                                    <div className="flex flex-col gap-2 w-[20%]">
                                        <img src={provider.image} alt="Provider" width={64} height={64} className="rounded-full mr-2" />
                                        <h5 className="text-[#607447] font-semibold underline underline-offset-4">{provider.name}</h5>
                                        <div className="flex gap-2 mt-2">
                                            <Image src={offline} alt="Offline" />
                                            <Image src={online} alt="Online" />
                                        </div>
                                        <a href="#" onClick={() => handleViewCalendar(provider)} className="text-red-500 mt-4 underline underline-offset-4">View Calendar &gt;</a>
                                    </div>

                                    {/* Slots Grid */}
                                    <div className="flex w-[80%] border border-[#E0E0E0] rounded-lg items-center">
                                        <div className="">
                                            <Image src={leftArrow} alt="Prev" width={24} height={24} className="mx-2" />
                                        </div>
                                        <div
                                            className="border-r border-l border-[#E0E0E0] h-full overflow-auto no-scrollbar grid gap-2 w-full p-4"
                                            style={{
                                                gridTemplateRows: "repeat(4, auto)",
                                                gridTemplateColumns: `repeat(${Math.ceil(timeSlots.length / 4)}, 1fr)`,
                                            }}
                                        >
                                            {timeSlots.map((time, index) => {
                                                const slotStatus = getSlotStatus(provider, time);
                                                const slotColor = slotColors[slotStatus] || "#F7F7F7";

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`w-16 h-7 flex rounded-lg items-center justify-center text-xs ${slotStatus === "default" ? "text-black" : "text-white"
                                                            }`}
                                                        style={{ backgroundColor: slotColor }}
                                                    >
                                                        {time}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div>
                                            <Image src={leftArrow} alt="Next" width={24} height={24} className="rotate-180 mx-2" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-center">No providers found.</p>
                        )}
                    </div>
                </main>
            )}
        </div>
    );
};


export default ListComponent;
