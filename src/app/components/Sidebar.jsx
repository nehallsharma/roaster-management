import React, { useMemo, useState } from "react";
import Dropdown from "./Dropdown";
import providersData from "../data/mockProviders.json";
import crossIcon from "../../../public/icons/CrossIcon.svg";
import Image from "next/image";

const Sidebar = ({ searchTerm, setSearchTerm, filters, setFilters }) => {
    const [selectedProviders, setSelectedProviders] = useState([]); // Stores selected providers
    const [selectedService, setSelectedService] = useState(filters.service); // Service filter
    const [selectedType, setSelectedType] = useState(filters.type); // Type filter
    const [selectedCentre, setSelectedCentre] = useState(filters.centre); // Centre filter

    const services = Array.from(providersData.providers.reduce((map, provider) => map.set(provider.provider_usertype, true), new Map()).keys());
    const types = Array.from(providersData.providers.reduce((map, provider) => map.set(provider.is_inhouse, true), new Map()).keys());
    const centres = Array.from(providersData.providers.reduce((map, provider) => map.set(provider.clinic_details.name, true), new Map()).keys());

    // Filter providers based on searchTerm
    const filteredProviders = useMemo(() => {
        if (!searchTerm) return [];
        return providersData.providers
            .filter(provider => provider.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !selectedProviders.some(p => p.id === provider.id)) // Exclude already selected ones
            .slice(0, 5); // Limit to 5 suggestions
    }, [searchTerm, selectedProviders]);

    // Handle provider selection
    const handleSelectProvider = (provider) => {
        setSelectedProviders((prev) => [...prev, provider]); // Add new provider
        setSearchTerm(""); // Clear search input after selection
    };

    // Handle removing selected provider
    const handleRemoveProvider = (id) => {
        setSelectedProviders((prev) => prev.filter(provider => provider.id !== id));
    };

    // Apply filters to ListComponent
    const handleApplyFilters = () => {
        console.log(selectedService, selectedType, selectedCentre);
        
        setFilters({
            service: selectedService,
            type: selectedType,
            centre: selectedCentre
        });
    };

    return (
        <aside className="bg-white p-6 flex flex-col gap-4 shadow h-full border border-[#E0E0E0]">
            <Dropdown options={services} placeholder="All services" value={selectedService} onChange={setSelectedService} />
            <Dropdown options={types} placeholder="All types" value={selectedType} onChange={setSelectedType} />
            <Dropdown options={centres} placeholder="All centres" value={selectedCentre} onChange={setSelectedCentre} />

            <div className="flex gap-4">
                {(selectedService || selectedType || selectedCentre) && (
                    <button
                        className="w-fit bg-[#FFF5F2] text-[#E76943] px-6 py-2 font-semibold rounded-lg"
                        onClick={() => {
                            setSelectedService("");
                            setSelectedType("");
                            setSelectedCentre("");
                            setFilters({
                                service: "",
                                type: "",
                                centre: ""
                            });
                        }}
                    >
                        Reset
                    </button>)}
                <button className="w-fit bg-[#E76943] text-white px-6 py-2 font-semibold rounded-lg" onClick={handleApplyFilters}>
                    Apply
                </button>
            </div>
            <div className="border-b border-[#E0E0E0]"></div>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search provider"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-lg"
            />
            <p>You can search up to 5 providers to view their availability specifically.</p>

            {/* Display searched providers */}
            {filteredProviders.length > 0 && (
                <ul className="mt-2 border border-[#E0E0E0] rounded-lg p-2 bg-[#F9F9F9]">
                    {filteredProviders.map((provider) => (
                        <li
                            key={provider.id}
                            className="p-2 border-b last:border-b-0 text-[#4C4C4C] cursor-pointer hover:bg-[#E0E0E0]"
                            onClick={() => handleSelectProvider(provider)}
                        >
                            {provider.name}
                        </li>
                    ))}
                </ul>
            )}

            {/* Display selected providers */}
            {selectedProviders.length > 0 && (
                <div>
                    {selectedProviders.map((provider) => (
                        <li key={provider.id} className="mt-2 px-3 py-1 bg-[#E3F2FF] text-black rounded-lg flex items-center gap-2">
                            {provider.name}
                            <Image
                                src={crossIcon}
                                alt="Remove"
                                className="text-black rounded-full w-5 h-5 flex ml-auto text-sm"
                                onClick={() => handleRemoveProvider(provider.id)}
                            />
                        </li>
                    ))}
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
