"use client";

import { useEffect, useState } from "react";

type Advocate = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
};

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetch("/api/advocates")
      .then((res) => res.json())
      .then((json) => {
        setAdvocates(json.data);
        setFilteredAdvocates(json.data);
      })
      .catch((err) => console.error("Failed to fetch:", err));
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = advocates.filter((advocate) => {
      const lowerTerm = term.toLowerCase();
      return (
        advocate.firstName.toLowerCase().includes(lowerTerm) ||
        advocate.lastName.toLowerCase().includes(lowerTerm) ||
        advocate.city.toLowerCase().includes(lowerTerm) ||
        advocate.degree.toLowerCase().includes(lowerTerm) ||
        advocate.specialties.some((s) => s.toLowerCase().includes(lowerTerm)) ||
        advocate.yearsOfExperience.toString().includes(lowerTerm)
      );
    });

    setFilteredAdvocates(filtered);
  };

  const onClick = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Solace Advocates</h1>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Search</label>
        <input
          type="text"
          value={searchTerm}
          onChange={onChange}
          placeholder="Search by name, city, specialty, etc."
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-2 text-sm text-gray-500">
          Searching for: <span className="font-medium">{searchTerm}</span>
        </div>
        <button
          onClick={onClick}
          className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
        >
          Reset Search
        </button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full table-auto border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">First Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Last Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">City</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Degree</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Specialties</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Experience</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Phone</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">{advocate.firstName}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{advocate.lastName}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{advocate.city}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{advocate.degree}</td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  <ul className="list-disc ml-5">
                    {advocate.specialties.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">{advocate.yearsOfExperience}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{advocate.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
