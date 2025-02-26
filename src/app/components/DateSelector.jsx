import { useState } from "react";
import Image from "next/image";
import leftArrow from "../../../public/icons/leftArrow.svg";
import Dropdown from "./Dropdown";

const getNextSevenDays = (startDate = new Date()) => {
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        return {
            day: date.toLocaleDateString("en-US", { weekday: "short" }),
            date: date.getDate(),
            fullDate: date.toISOString().split("T")[0], // YYYY-MM-DD format
        };
    });
};

const DatePicker = ({ selectedDate, setSelectedDate, tab }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [dates, setDates] = useState(getNextSevenDays());

    const handlePrev = () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(startDate.getDate() - 7);
        setStartDate(newStartDate);
        setDates(getNextSevenDays(newStartDate));
    };

    const handleNext = () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(startDate.getDate() + 7);
        setStartDate(newStartDate);
        setDates(getNextSevenDays(newStartDate));
    };

    return (
        <>
            {tab === "SlotView" ? (
                <div className="flex justify-evenly items-center gap-4 bg-white p-4">
                    <div onClick={handlePrev} className="border-2 border-gray-300 rounded-full p-1 cursor-pointer">
                        <Image src={leftArrow} alt="Prev" width={24} height={24} />
                    </div>
                    <div className="w-full flex gap-4 h-12">
                        {dates.map(({ day, date, fullDate }) => (
                            <div key={fullDate}
                                onClick={() => setSelectedDate(fullDate)}
                                className={`flex flex-col items-center justify-center border-2 border-[#E0E0E0] w-full rounded-lg py-1 text-xs font-medium cursor-pointer 
                    ${selectedDate === fullDate ? "bg-[#4E6137] text-white" : "bg-white text-black"}`}>
                                <span>{day}</span>
                                <span>{date}</span>
                            </div>
                        ))}
                    </div>

                    <div onClick={handleNext} className="border-2 border-gray-300 rounded-full p-1 cursor-pointer">
                        <Image src={leftArrow} alt="Next" width={24} height={24} className="rotate-180" />
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex gap-2 items-center bg-white p-4">
                        <div onClick={handlePrev} className="border-2 border-gray-300 rounded-full p-1 cursor-pointer">
                            <Image src={leftArrow} alt="Prev" width={24} height={24} />
                        </div>
                        <div onClick={handleNext} className="border-2 border-gray-300 rounded-full p-1 cursor-pointer">
                            <Image src={leftArrow} alt="Next" width={24} height={24} className="rotate-180" />
                        </div>
                        <div>{dates[0].date} - {dates[6].date} feb 2024</div>
                        <div className="flex items-center gap-1 ml-auto">
                            <div className="rounded-lg w-4 h-2 bg-[#757575]" ></div>
                            <h6 className="capitalize">Session Event</h6>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="rounded-lg w-4 h-2 bg-[#E0E0E0] border border-[#757575]" ></div>
                            <h6 className="capitalize">Calender Event</h6>
                        </div>
                        <div>
                            <Dropdown options={["Monthly"]} placeholder={"Weekly"} />
                        </div>
                    </div>
                </div>

            )}
        </>
    );
};

export default DatePicker;
