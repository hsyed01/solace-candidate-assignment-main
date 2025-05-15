"use client";

import { useEffect, useMemo, useState } from "react";

type Advocate = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
};

const ITEMS_PER_PAGE = 6;

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    setLoading(true);
    fetch("/api/advocates")
      .then((res) => res.json())
      .then((json) => {
        setAdvocates(json.data);
        setFilteredAdvocates(json.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch:", err);
        setLoading(false);
      });
  }, []);

  const cities = useMemo(
    () => ["All", ...Array.from(new Set(advocates.map((a) => a.city)))],
    [advocates]
  );

  const specialties = useMemo(
    () =>
      ["All", ...Array.from(new Set(advocates.flatMap((a) => a.specialties)))],
    [advocates]
  );

  const filterData = () => {
    let result = advocates;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((advocate) =>
        [
          advocate.firstName,
          advocate.lastName,
          advocate.city,
          advocate.degree,
          ...advocate.specialties,
          advocate.yearsOfExperience.toString(),
        ]
          .map((val) => val.toLowerCase())
          .some((val) => val.includes(term))
      );
    }

    if (selectedCity !== "All") {
      result = result.filter((a) => a.city === selectedCity);
    }

    if (selectedSpecialty !== "All") {
      result = result.filter((a) => a.specialties.includes(selectedSpecialty));
    }

    setPage(1);
    setFilteredAdvocates(result);
  };

  useEffect(() => {
    filterData();
  }, [searchTerm, selectedCity, selectedSpecialty]);

  const paginatedAdvocates = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredAdvocates.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAdvocates, page]);

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Solace Advocates</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
        >
          {cities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
        >
          {specialties.map((spec) => (
            <option key={spec}>{spec}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-20">Loading...</div>
      ) : filteredAdvocates.length === 0 ? (
        <div className="text-center text-gray-500 py-20">No advocates found.</div>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="min-w-full table-auto text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">First</th>
                  <th className="px-4 py-2 text-left font-semibold">Last</th>
                  <th className="px-4 py-2 text-left font-semibold">City</th>
                  <th className="px-4 py-2 text-left font-semibold">Degree</th>
                  <th className="px-4 py-2 text-left font-semibold">Specialties</th>
                  <th className="px-4 py-2 text-left font-semibold">Experience</th>
                  <th className="px-4 py-2 text-left font-semibold">Phone</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAdvocates.map((advocate, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{advocate.firstName}</td>
                    <td className="px-4 py-2">{advocate.lastName}</td>
                    <td className="px-4 py-2">{advocate.city}</td>
                    <td className="px-4 py-2">{advocate.degree}</td>
                    <td className="px-4 py-2">
                      <ul className="list-disc list-inside">
                        {advocate.specialties.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-2">{advocate.yearsOfExperience}</td>
                    <td className="px-4 py-2">{advocate.phoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {Array.from({
              length: Math.ceil(filteredAdvocates.length / ITEMS_PER_PAGE),
            }).map((_, idx) => {
              const num = idx + 1;
              return (
                <button
                  key={num}
                  className={`px-3 py-1 rounded border text-sm ${
                    page === num
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setPage(num)}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
