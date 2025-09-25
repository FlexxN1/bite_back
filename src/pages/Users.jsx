import React from "react";

export default function Users() {

  return (
    <div className="container mt-4">
      <h2>Usuarios registrados</h2>
      <ul>
       {/*users.map(u => (
          <li key={u.id}>{u.name} ({u.email}) - Edad: {u.age}</li>
        ))*/}
      </ul>
    </div>
  );
}