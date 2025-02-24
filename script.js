document.getElementById('fileInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        let allNumbers = jsonData.flatMap(row => {
            const name = row['BOLETOS'];
            const totalBoletos = row['Total Boletos'];
            const number = row['Números'];

            return name && totalBoletos && number
                ? Array.from({ length: totalBoletos }, (_, i) => ({ name: name, number: number + i }))
                : [];
        });

        console.log("Todos los números: ", allNumbers);

        function pickWinner() {
            if (allNumbers.length === 0) {
                document.getElementById('output').textContent = "No hay más boletos disponibles para el sorteo.";
                return;
            }
        
            // Seleccionar aleatoriamente un número de la lista
            const winnerIndex = Math.floor(Math.random() * allNumbers.length);
            const winner = allNumbers[winnerIndex];
        
            // Eliminar todos los boletos del ganador de la lista
            allNumbers = allNumbers.filter(ticket => ticket.name !== winner.name);
        
            console.log("Números restantes después del sorteo: ", allNumbers);
        
            // Mostrar al ganador en el área principal
            document.getElementById('output').textContent = `El ganador es: ${winner.name} con el boleto número ${winner.number}`;
            
            // Agregar el ganador a la lista de ganadores
            const winnerItem = document.createElement('li');
            winnerItem.textContent = `${winner.name} - Boleto: ${winner.number}`;
            document.getElementById('winnerList').appendChild(winnerItem);
        
            // Cambiar texto del botón
            document.getElementById('selectWinnerBtn').textContent = "Seleccionar otro ganador";
        }
        
        // Función para resetear el sorteo
        function resetSorteo() {
            document.getElementById('output').textContent = "";
            document.getElementById('selectWinnerBtn').textContent = "Seleccionar ganador";
            document.getElementById('selectWinnerBtn').style.display = 'none';
            document.getElementById('resetBtn').style.display = 'none';
            document.getElementById('fileInput').value = ""; // Resetea el input de archivo
        }

        document.getElementById('resetBtn').addEventListener('click', function() {
            // Limpiar la lista de ganadores
            document.getElementById('winnerList').innerHTML = '';
            // Restablecer los boletos
            allNumbers = []; // Reiniciamos la lista de boletos (si quieres, puedes cargarla de nuevo o reiniciar la lista original)
            document.getElementById('output').textContent = "Los datos han sido reiniciados. Carga un nuevo archivo para continuar.";
            document.getElementById('selectWinnerBtn').style.display = 'none'; // Ocultamos el botón de seleccionar ganador
        });
        
        document.getElementById('selectWinnerBtn').addEventListener('click', pickWinner);
        document.getElementById('resetBtn').addEventListener('click', resetSorteo);

        // Mostrar los botones
        document.getElementById('selectWinnerBtn').style.display = 'block';
        document.getElementById('resetBtn').style.display = 'block';
    };

    reader.readAsArrayBuffer(file);
});
