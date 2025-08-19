const productos = [];

function renderTabla() {
    const tbody = document.querySelector('#tabla tbody');
    tbody.innerHTML = '';
    productos.forEach((prod, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${prod.nombre}</td>
            <td>${prod.cantidad}</td>
            <td>${prod.sucursal}</td>
            <td><button data-idx="${idx}" class="eliminar">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
    });
    document.querySelectorAll('.eliminar').forEach(btn => {
        btn.onclick = (e) => {
            const idx = e.target.getAttribute('data-idx');
            productos.splice(idx, 1);
            renderTabla();
        };
    });
}

document.getElementById('form-producto').onsubmit = function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const sucursal = document.getElementById('sucursal').value.trim();
    if (nombre && cantidad && sucursal) {
        productos.push({ nombre, cantidad, sucursal });
        renderTabla();
        this.reset();
    }
};

renderTabla();