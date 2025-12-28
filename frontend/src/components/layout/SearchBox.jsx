import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms, getEquipment } from "../../utils/rooms";

const MOCK_DATA = [
  { type: "patient", id: "P-10234", name: "John Doe", link: "/patient/P-10234" },
  { type: "patient", id: "P-20458", name: "Jane Smith", link: "/patient/P-20458" },
  { type: "surgery", id: "S-5501", name: "Appendectomy — John Doe", link: "/surgeries/view/S-5501" },
  { type: "surgery", id: "S-5502", name: "Knee Arthroscopy — Jane Smith", link: "/surgeries/view/S-5502" },
  { type: "appointment", id: "A-9001", name: "Follow-up — John Doe", link: "/appointments" },
  { type: "prescription", id: "RX-3001", name: "Amoxicillin — Jane Smith", link: "/prescriptions/RX-3001" },
];

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const results = useMemo(() => {
    if (debounced.length < 2) return [];
    const q = debounced.toLowerCase();
    
    // Search in mock data
    const mockResults = MOCK_DATA.filter(
      x => x.name.toLowerCase().includes(q) || x.id.toLowerCase().includes(q)
    ).map(x => ({ ...x, link: x.link }));

    // Search in rooms
    const rooms = getRooms();
    const roomResults = rooms
      .filter(r => 
        r.roomNumber.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        (r.assignedPatient && r.assignedPatient.toLowerCase().includes(q))
      )
      .map(r => ({
        type: "room",
        id: r.id,
        name: `${r.roomNumber} - ${r.type}`,
        link: `/rooms/${r.id}`
      }));

    // Search in equipment
    const equipment = getEquipment();
    const equipmentResults = equipment
      .filter(eq => 
        eq.name.toLowerCase().includes(q) ||
        eq.category.toLowerCase().includes(q) ||
        (eq.serialNumber && eq.serialNumber.toLowerCase().includes(q))
      )
      .map(eq => ({
        type: "equipment",
        id: eq.id,
        name: `${eq.name} (${eq.category})`,
        link: `/rooms/${eq.assignedRoom || 'equipment'}/equipment`
      }));

    // Combine all results
    return [...mockResults, ...roomResults, ...equipmentResults].slice(0, 8);
  }, [debounced]);

  useEffect(() => {
    setOpen(results.length > 0 && document.activeElement === inputRef.current);
  }, [results]);

  const handleSelect = (link) => {
    navigate(link);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="searchbox" onBlur={() => setTimeout(() => setOpen(false), 150)}>
      <label className="search-label">Quick Search</label>
      <input
        ref={inputRef}
        className="search-input"
        placeholder="Search patients, surgeries, etc..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setOpen(results.length > 0)}
      />
      {open && (
        <div className="search-dropdown">
          {results.map(r => (
            <div
              key={r.id}
              className="search-item"
              onMouseDown={() => handleSelect(r.link)} // onMouseDown fires before onBlur
            >
              <span className="search-type">{r.type}</span>
              <span className="search-name">{r.name}</span>
              <span className="search-id">{r.id}</span>
            </div>
          ))}
          {results.length === 0 && (
            <div className="search-empty">No results</div>
          )}
        </div>
      )}
    </div>
  );
}


