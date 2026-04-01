document.addEventListener("DOMContentLoaded", function () {

    const apiKey = "ebbc47085a9e49ae9eba1eabdc4a1caf";

    let cidadeLat = -27.1004;
    let cidadeLon = -52.6152;

    let buscando = false;
    let controller = null; // 🔥 para cancelar requisições

    const map = L.map("map").setView([cidadeLat, cidadeLon], 13);

    L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`, {
        maxZoom: 20
    }).addTo(map);

    let marcadores = L.layerGroup().addTo(map);

    function buscarLocais(texto) {

        if (!texto.trim()) return;

        // 🔥 Cancela requisição anterior se existir
        if (controller) {
            controller.abort();
        }

        controller = new AbortController();
        const signal = controller.signal;

        buscando = true;

        marcadores.clearLayers();
        const resultadosDiv = document.getElementById("resultados");
        resultadosDiv.innerHTML = "<p>🔍 Buscando...</p>";

        fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(texto)}&filter=circle:${cidadeLon},${cidadeLat},40000&limit=30&apiKey=${apiKey}`, {
            signal: signal
        })
        .then(res => res.json())
        .then(data => {

            buscando = false;
            resultadosDiv.innerHTML = "";

            if (!data.features || data.features.length === 0) {
                resultadosDiv.innerHTML = "<p>Nenhum resultado encontrado.</p>";
                return;
            }

            data.features.forEach(local => {

                const coords = local.geometry.coordinates;
                const nome = local.properties.name || texto;
                const endereco = local.properties.formatted || "";

                const marcador = L.circleMarker([coords[1], coords[0]], {
                    radius: 7,
                    stroke: false,
                    fillColor: "#0058f0",
                    fillOpacity: 0.9
                }).addTo(marcadores);

                marcador.on("click", function () {
                    abrirModal(nome, endereco);
                });

                const item = document.createElement("div");
                item.innerHTML = `
                    <strong>${nome}</strong><br>
                    <small>${endereco}</small>
                `;
                item.style.cursor = "pointer";
                item.style.padding = "8px";
                item.style.borderBottom = "1px solid #ddd";

                item.addEventListener("click", function () {
                    map.setView([coords[1], coords[0]], 17);
                    abrirModal(nome, endereco);
                });

                resultadosDiv.appendChild(item);

            });

        })
        .catch(err => {

            buscando = false;

            if (err.name === "AbortError") {
                return; // 🔥 ignorar erro de cancelamento
            }

            console.log("Erro:", err);
            resultadosDiv.innerHTML = "<p>Erro na busca.</p>";
        });
    }

    function abrirModal(nome, endereco) {
        document.getElementById("modalTitulo").textContent = nome;
        document.getElementById("modalEndereco").textContent = endereco;
        document.getElementById("modal").style.display = "flex";
    }

    document.getElementById("fecharModal").addEventListener("click", function () {
        document.getElementById("modal").style.display = "none";
    });

    window.addEventListener("click", function (e) {
        if (e.target.id === "modal") {
            document.getElementById("modal").style.display = "none";
        }
    });

    document.getElementById("form-busca").addEventListener("submit", function (e) {
        e.preventDefault();
        const texto = document.getElementById("pesquisa").value;
        buscarLocais(texto);
    });

});