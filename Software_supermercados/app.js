// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    // Estado
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    let filtroTexto = '';

    // Referencias a elementos (ahora seguras)
    const btnTema = document.getElementById('btn-tema');
    const formProducto = document.getElementById('form-producto');
    const filtroInput = document.getElementById('filtro');
    const btnLimpiarFiltro = document.getElementById('btn-limpiar-filtro');
    const btnExportar = document.getElementById('btn-exportar-csv');
    const btnEliminarTodos = document.getElementById('btn-eliminar-todos');

    // === MODO OSCURO ===
    const modoOscuro = localStorage.getItem('modoOscuro') === 'true';
    if (modoOscuro) {
        document.body.classList.add('modo-oscuro');
        if (btnTema) {
            btnTema.title = 'Modo claro';
            btnTema.textContent = '🌙';
        }
    }

    function actualizarTemaBoton() {
        if (!btnTema) return;
        if (document.body.classList.contains('modo-oscuro')) {
            btnTema.title = 'Modo claro';
            btnTema.textContent = '🌙';
        } else {
            btnTema.title = 'Modo oscuro';
            btnTema.textContent = '☀️';
        }
    }

    if (btnTema) {
        btnTema.addEventListener('click', function () {
            document.body.classList.toggle('modo-oscuro');
            actualizarTemaBoton();
            localStorage.setItem('modoOscuro', document.body.classList.contains('modo-oscuro'));
        });
    }

    // === FUNCIONES ===
    function guardarEnStorage() {
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    function actualizarContador() {
        const contador = document.getElementById('contador-productos');
        if (contador) contador.textContent = productos.length;
    }

    function filtrarProductos() {
        return productos.filter(p =>
            p.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
            p.sucursal.toLowerCase().includes(filtroTexto.toLowerCase())
        );
    }

    function renderTabla() {
        const tbody = document.querySelector('#tabla tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        const productosFiltrados = filtrarProductos();

        productosFiltrados.forEach((prod, idxOriginal) => {
            const idx = productos.indexOf(prod);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="editable" data-field="nombre" data-idx="${idx}">${prod.nombre}</td>
                <td class="editable" data-field="cantidad" data-idx="${idx}">${prod.cantidad}</td>
                <td class="editable" data-field="sucursal" data-idx="${idx}">${prod.sucursal}</td>
                <td>
                    <button class="eliminar" data-idx="${idx}" title="Eliminar ${prod.nombre}" aria-label="Eliminar ${prod.nombre}">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        actualizarContador();
    }

    // === EVENTOS ===

    // Agregar producto
    if (formProducto) {
        formProducto.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const cantidadInput = document.getElementById('cantidad').value;
            const cantidad = parseInt(cantidadInput);
            const sucursal = document.getElementById('sucursal').value.trim();

            if (!nombre) {
                alert("Por favor, ingresa un nombre de producto.");
                return;
            }
            if (isNaN(cantidad) || cantidad <= 0) {
                alert("Por favor, ingresa una cantidad válida mayor a 0.");
                return;
            }
            if (!sucursal) {
                alert("Por favor, ingresa una sucursal.");
                return;
            }

            productos.push({ nombre, cantidad, sucursal });
            guardarEnStorage();
            renderTabla();
            this.reset();
        });
    }

    // Editar con doble clic
    document.querySelector('#tabla tbody')?.addEventListener('dblclick', function (e) {
        const td = e.target;
        if (!td.classList.contains('editable')) return;

        const field = td.getAttribute('data-field');
        const idx = td.getAttribute('data-idx');
        const valorActual = td.textContent;

        const input = document.createElement('input');
        input.type = field === 'cantidad' ? 'number' : 'text';
        input.value = valorActual;
        input.className = 'edit-input';
        if (field === 'cantidad') input.min = '1';

        td.textContent = '';
        td.appendChild(input);
        input.focus();

        const guardar = () => {
            let nuevoValor = input.value.trim();
            if (field === 'cantidad') {
                nuevoValor = parseInt(nuevoValor);
                if (isNaN(nuevoValor) || nuevoValor <= 0) {
                    alert("Cantidad inválida.");
                    nuevoValor = productos[idx].cantidad;
                }
            } else if (!nuevoValor) {
                alert("Este campo no puede estar vacío.");
                return;
            }

            productos[idx][field] = nuevoValor;
            guardarEnStorage();
            renderTabla();
        };

        input.addEventListener('blur', guardar);
        input.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter') input.blur();
            if (ev.key === 'Escape') renderTabla();
        });
    });

    // Eliminar un producto
    document.querySelector('#tabla tbody')?.addEventListener('click', function (e) {
        if (e.target.classList.contains('eliminar')) {
            const idx = e.target.getAttribute('data-idx');
            const prod = productos[idx];
            if (confirm(`¿Eliminar ${prod.nombre} de ${prod.sucursal}?`)) {
                productos.splice(idx, 1);
                guardarEnStorage();
                renderTabla();
            }
        }
    });

    // Eliminar todos
    if (btnEliminarTodos) {
        btnEliminarTodos.addEventListener('click', function () {
            if (productos.length === 0) {
                alert("No hay productos para eliminar.");
                return;
            }
            if (confirm("¿Eliminar todos los productos del inventario?")) {
                productos = [];
                guardarEnStorage();
                renderTabla();
            }
        });
    }

    // Filtro
    if (filtroInput) {
        filtroInput.addEventListener('input', function () {
            filtroTexto = this.value.trim();
            renderTabla();
        });
    }

    if (btnLimpiarFiltro) {
        btnLimpiarFiltro.addEventListener('click', function () {
            if (filtroInput) {
                filtroInput.value = '';
                filtroTexto = '';
                renderTabla();
            }
        });
    }

    // Exportar a Excel
    if (btnExportar) {
        btnExportar.addEventListener('click', function () {
            if (productos.length === 0) {
                alert("No hay productos para exportar.");
                return;
            }

            const data = productos.map(p => ({
                Producto: p.nombre,
                Cantidad: p.cantidad,
                Sucursal: p.sucursal
            }));

            const ws = XLSX.utils.json_to_sheet(data);
            ws['!cols'] = [{ wch: 20 }, { wch: 10 }, { wch: 15 }];
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Inventario");
            XLSX.writeFile(wb, `Inventario_${new Date().toISOString().split('T')[0]}.xlsx`);
        });
    }

    // Render inicial
    renderTabla();
});