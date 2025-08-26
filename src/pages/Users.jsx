import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(data => setUsers(data.data));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Usuarios registrados</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} ({u.email}) - Edad: {u.age}</li>
        ))}
      </ul>
    </div>
  );
}