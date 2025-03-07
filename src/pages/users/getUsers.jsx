import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function UserCards() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // === Mengambil data dari API ===
  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .catch((error) => console.error("Error:", error));
  }, [])

  // === Fungsi untuk memfilter pengguna berdasarkan pencarian ===
  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(search.toLowerCase()) ||
    user.lastName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            size={22}
          />
          <input
            type="text"
            placeholder="Cari pengguna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300
                 shadow-sm transition-all duration-200"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md 
                     transition-shadow duration-300 overflow-hidden"
          >
            <div className="h-24 bg-yellow-400 hover:bg-yellow-500" />

            <div className="relative px-4 pb-4">
              <div className="flex justify-center">
                <img
                  src={user.image}
                  alt={user.firstName}
                  className="w-20 h-20 rounded-full border-4 border-white -mt-10 
                           shadow-md object-cover bg-white"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </div>

              <div className="text-center mt-3">
                <h3 className="font-semibold text-sm lg:text-lg text-gray-800">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-500 text-xs lg:text-sm mt-1">{user.email}</p>
                <p className="text-gray-600 text-xs lg:text-sm mt-2">
                  {user.company?.department || "Department"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredUsers.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">Tidak ada pengguna yang ditemukan</p>
        </div>
      )}
    </div>
  );
}