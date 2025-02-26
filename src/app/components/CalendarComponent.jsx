import React, { useState, useMemo } from "react";
import eventsData from "../data/mockProviders.json";
import { slotColors } from "../helper";
import leftArrow from "../../../public/icons/leftArrow.svg";
import Dropdown from "./Dropdown";
import Image from "next/image";

const formatHour = (hour) => hour.toString().padStart(2, "0") + ":00";

const CalendarComponent = ({ searchTerm, filters }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const updateWeek = (offset) => {
        setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() + offset * 7)));
    };

    const days = useMemo(() => {
        const baseDate = new Date(selectedDate);
        baseDate.setDate(selectedDate.getDate() - selectedDate.getDay());
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(baseDate);
            date.setDate(baseDate.getDate() + i);
            return {
                day: date.toLocaleString("en-US", { weekday: "short" }),
                date: date.getDate(),
                month: date.toLocaleString("en-US", { month: "short" }),
                year: date.getFullYear(),
                fullDate: date.toISOString().split("T")[0],
            };
        });
    }, [selectedDate]);

    const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => formatHour(i)), []);

    const filterProvider = (provider, searchTerm, filters) => {
        const { service, type, centre } = filters;

        // Filter by search term
        const matchesSearchTerm = searchTerm ? provider.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;

        // Filter by service
        const matchesService = service ? provider.provider_usertype === service : true;

        // Filter by type
        const matchesType = type ? (provider.is_inhouse ? "In-house" : "External") === type : true;

        // Filter by centre
        const matchesCentre = centre ? provider.clinic_details.name === centre : true;

        // Return true if all conditions match
        return matchesSearchTerm && matchesService && matchesType && matchesCentre;
    };

    const filteredEventsMap = useMemo(() => {
        const map = {};

        eventsData.providers.forEach((provider) => {
            // Apply the combined filter function
            if (!filterProvider(provider, searchTerm, filters)) {
                return; // Skip provider if it doesn't match filters
            }

            // Process availabilities for the provider
            provider.availabilities.forEach((availability) => {
                const day = availability.date;
                map[day] = map[day] || {};

                // Process different types of slots
                ["online", "offline", "both", "onlineBooked", "offlineBooked"].forEach((type) => {
                    (availability[`${type}_slots`] || []).forEach((hour) => {
                        const formattedHour = formatHour(parseInt(hour, 10));
                        map[day][formattedHour] = { title: `${provider.name} (${type.replace(/([A-Z])/g, " $1")})`, type };
                    });
                });

                // Process blocked slots
                (availability.blocked_slots || []).forEach(({ slot, reason }) => {
                    const formattedHour = formatHour(parseInt(slot, 10));
                    map[day][formattedHour] = {
                        title: `${provider.name} (Blocked: ${reason})`,
                        type: "blocked",
                        isUnwell: reason === "unwell", // Check if the reason is 'unwell'
                    };
                });
            });
        });

        return map;
    }, [searchTerm, filters]);

    return (
        <div className="h-screen w-full flex flex-col ">
            {/* Navigation */}
            <div className="flex items-center gap-2 justify-between py-5 px-4">
                <div onClick={() => updateWeek(-1)} className="border-2 border-gray-300 rounded-full p-1 cursor-pointer">
                    <Image src={leftArrow} alt="Prev" width={24} height={24} />
                </div>
                <div onClick={() => updateWeek(1)} className="border-2 border-gray-300 rounded-full p-1 cursor-pointer">
                    <Image src={leftArrow} alt="Next" width={24} height={24} className="rotate-180" />
                </div>
                <h2 className="font-semibold"> {days[0].date} - {days[6].date} {days[0].month} {days[0].year}</h2>
                <div className="flex items-center gap-1 ml-auto">
                    <div className="rounded-lg w-4 h-2 bg-[#757575]" ></div>
                    <h6 className="capitalize">Session Event</h6>
                </div>
                <div className="flex items-center gap-1 px-4">
                    <div className="rounded-lg w-4 h-2 bg-[#E0E0E0] border border-[#757575]" ></div>
                    <h6 className="capitalize">Calender Event</h6>
                </div>
                <div>
                    <Dropdown options={["Monthly"]} placeholder={"Weekly"} />
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-8 px-4" style={{ gridTemplateColumns: "0.5fr repeat(7, 1fr)" }}>
                <div className="border-r border-b border-[#E0E0E0]"></div>

                {/* Days Header */}
                {days.map((day, index) => (
                    <div
                        key={day.fullDate}
                        className="border-r border-[#E0E0E0] p-2 text-center"
                    >
                        <span className="font-medium text-xs text-[#9E9E9E]">{day.day}</span>
                        <br />
                        <span className={`font-semibold text-sm text-[#4C4C4C] py-1 px-2 w-8 h-8 ${index === new Date().getDay() ? "bg-[#607447] rounded-full text-white" : ""
                            }`}>{day.date}</span>
                    </div>
                ))}

                {/* Time Slots */}
                {hours.map((hour) => (
                    <React.Fragment key={hour}>
                        <div className="border-b border-[#E0E0E0] p-1 text-[#757575] text-xs">{hour}</div>
                        {days.map((day) => {
                            const event = filteredEventsMap[day.fullDate]?.[hour] || null;
                            return (
                                <div
                                    key={`${day.fullDate}-${hour}`}
                                    className="border border-[#E0E0E0] h-16 relative flex items-center justify-center text-white text-sm"
                                    style={{
                                        backgroundColor: event ? slotColors[event.type] : "transparent",
                                    }}
                                >
                                    {event && event.title}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CalendarComponent;