import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./styles/main.css";

function App() {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Leche", cantidad: 20, sucursal: "Centro" },
    { id: 2, nombre: "Pan", cantidad: 35, sucursal: "Norte" },
  ]);
  const [nuevo, setNuevo] = useState({ nombre: "", cantidad: "", sucursal: "" });

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const agregarProducto = (e) => {
    e.preventDefault();
    if (!nuevo.nombre || !nuevo.cantidad || !nuevo.sucursal) return;
    setProductos([
      ...productos,
      {
        id: productos.length + 1,
        nombre: nuevo.nombre,
        cantidad: parseInt(nuevo.cantidad),
        sucursal: nuevo.sucursal,
      },
    ]);
    setNuevo({ nombre: "", cantidad: "", sucursal: "" });
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Gestión de Inventario - Supermercados</h1>
      <form onSubmit={agregarProducto} style={{ marginBottom: 20 }}>
        <input
          name="nombre"
          placeholder="Nombre del producto"
          value={nuevo.nombre}
          onChange={handleChange}
          required
        />
        <input
          name="cantidad"
          type="number"
          placeholder="Cantidad"
          value={nuevo.cantidad}
          onChange={handleChange}
          required
          min="1"
        />
        <input
          name="sucursal"
          placeholder="Sucursal"
          value={nuevo.sucursal}
          onChange={handleChange}
          required
        />
        <button type="submit">Agregar</button>
      </form>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Sucursal</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.cantidad}</td>
              <td>{p.sucursal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);