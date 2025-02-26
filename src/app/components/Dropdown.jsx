import React from "react";

const Dropdown = ({ options, placeholder, value, onChange }) => {
    return (
        <select
            className="w-full p-2 border rounded-lg"
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
        >
            <option value="">{placeholder}</option>
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};

export default Dropdown;
