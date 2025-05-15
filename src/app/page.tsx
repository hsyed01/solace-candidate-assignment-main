"use client";

import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";

type Advocate = {
  id: number;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalAdvocates, setTotalAdvocates] = useState(0);

  const fetchAdvocates = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
      });

      if (searchTerm) queryParams.set("searchTerm", searchTerm);
      if (selectedCity !== "All") queryParams.set("selectedCity", selectedCity);
      if (selectedSpecialty !== "All") queryParams.set("selectedSpecialty", selectedSpecialty);

      const res = await fetch(`/api/advocates?${queryParams.toString()}`);
      const json = await res.json();
      setAdvocates(json.data || []);
      setTotalAdvocates(json.total || 0);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvocates();
  }, [page, searchTerm, selectedCity, selectedSpecialty]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchTerm(value);
        setPage(1);
      }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    setPage(1);
  }, [selectedCity, selectedSpecialty]);

  const cities = useMemo(() => {
    const citySet = new Set(advocates.map((a) => a.city));
    return ["All", ...Array.from(citySet)];
  }, [advocates]);

  const specialties = useMemo(() => {
    const allSpecialties = advocates.flatMap((a) => a.specialties || []);
    return ["All", ...Array.from(new Set(allSpecialties))];
  }, [advocates]);

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Solace Advocates</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          onChange={handleSearchChange}
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
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4 mb-4">
              <div className="w-16 h-6 bg-gray-300 rounded-md"></div>
              <div className="w-full h-6 bg-gray-300 rounded-md"></div>
              <div className="w-32 h-6 bg-gray-300 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : advocates.length === 0 ? (
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
                {advocates.map((advocate) => (
                  <tr key={advocate.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{advocate.firstName}</td>
                    <td className="px-4 py-2">{advocate.lastName}</td>
                    <td className="px-4 py-2">{advocate.city}</td>
                    <td className="px-4 py-2">{advocate.degree}</td>
                    <td className="px-4 py-2">
                      <ul className="list-disc list-inside">
                        {advocate.specialties.map((s, i) => (
                          <li key={i}>{s}</li>
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

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: Math.ceil(totalAdvocates / ITEMS_PER_PAGE) }).map((_, idx) => {
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
