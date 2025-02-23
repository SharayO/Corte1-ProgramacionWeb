document.getElementById('procesar').addEventListener('click', function() {
    // Obtenemos los coeficientes
    let a = parseFloat(document.getElementById('coefA').value);
    let b = parseFloat(document.getElementById('coefB').value);
    let c = parseFloat(document.getElementById('coefC').value);
    let d = parseFloat(document.getElementById('coefD').value);
    let e = parseFloat(document.getElementById('coefE').value);
    
    // Obtenemos los límites
    let xMin = parseFloat(document.getElementById('xMin').value);
    let xMax = parseFloat(document.getElementById('xMax').value);

    // Arrays para almacenar los valores
    let xValues = [];
    let yValues = [];
    let valoresXY = "";
    
    // Variables para estadísticas
    let yMin = Infinity;
    let yMax = -Infinity;
    let cortes = 0;

    // Calculamos puntos cada 0.05 unidades
    for (let x = xMin; x <= xMax; x += 0.05) {
        // Redondeamos x a 4 decimales para evitar errores de punto flotante
        let xRedondeado = parseFloat(x.toFixed(4));
        
        // Verificamos las restricciones del dominio
        if ((xRedondeado + c) <= 0) continue; // Evita raíz cuadrada de número negativo
        if ((xRedondeado + 1) <= 0) continue; // Evita raíz cuadrada de número negativo
        if ((xRedondeado + d) === 0) continue; // Evita división por cero

        try {
            // Calculamos y
            let y = (Math.sin(a * xRedondeado) + Math.cos(b * xRedondeado)) / Math.sqrt(xRedondeado + c) +
                    (Math.cos(d * xRedondeado) + Math.sin(e * xRedondeado)) / Math.sqrt(xRedondeado + 1) +
                    (1 / (xRedondeado + d));

            // Redondeamos y a 4 decimales
            let yRedondeado = parseFloat(y.toFixed(4));

            // Solo agregamos el punto si y es un número finito y real
            if (isFinite(yRedondeado) && !isNaN(yRedondeado)) {
                xValues.push(xRedondeado);
                yValues.push(yRedondeado);
                valoresXY += `X: ${xRedondeado}, Y: ${yRedondeado}\n`;

                // Actualizamos estadísticas
                if (yRedondeado < yMin) yMin = yRedondeado;
                if (yRedondeado > yMax) yMax = yRedondeado;
                if (Math.abs(yRedondeado) < 0.1) cortes++;
            }
        } catch (error) {
            console.log(`Error al calcular y para x = ${xRedondeado}: ${error}`);
            continue;
        }
    }

    // Actualizamos la interfaz solo si tenemos valores válidos
    if (xValues.length > 0) {
        document.getElementById('yMin').textContent = yMin.toFixed(4);
        document.getElementById('yMax').textContent = yMax.toFixed(4);
        document.getElementById('cortes').textContent = cortes;
        document.getElementById('valoresXY').textContent = valoresXY;

        // Limpiamos el gráfico anterior si existe
        let chartStatus = Chart.getChart("graficoXY");
        if (chartStatus != undefined) {
            chartStatus.destroy();
        }

        // Creamos el nuevo gráfico
        new Chart(document.getElementById('graficoXY'), {
            type: 'line',
            data: {
                labels: xValues,
                datasets: [{
                    label: 'Y vs X',
                    data: yValues,
                    borderColor: '#736cc3',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'X' },
                        min: xMin,
                        max: xMax
                    },
                    y: {
                        title: { display: true, text: 'Y' }
                    }
                }
            }
        });
    } else {
        alert('No hay valores válidos de la función en el rango especificado.');
    }
});

document.getElementById('reiniciar').addEventListener('click', function() {
    location.reload();
});