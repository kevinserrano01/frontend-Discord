window.addEventListener('DOMContentLoaded', function () {
    get_servers_all();
});

function get_servers_all() {
    fetch("http://127.0.0.1:5000/server/all", {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                data.forEach(element => {
                    // console.log(element.server_id)
                    const servers_container = document.getElementById('container-servers');
                    var option = document.createElement('option');
                    option.value = element.server_id; // Atributo "value"
                    option.text = element.server_name; // Texto visible
                    servers_container.appendChild(option);
                });
            });
        } else {
            return response.json().then(data => {
                document.getElementById("message").innerHTML = data.message;
            });
        }
    })
    .catch(error => {
        document.getElementById("message").innerHTML = "An error occurred.";
    });
}

document.getElementById("SearchServerForm").addEventListener("submit", function (event) {
    event.preventDefault();
    joinServer();
});

function joinServer() {
    const data = {
        server_id: document.getElementById("container-servers").value,
        user_id: sessionStorage.getItem('user_id')
    };
    console.log(data)

    fetch("http://127.0.0.1:5000/suscription/add", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 201) {
            // Redirect to profile page if login is successful
            return response.json().then(data => {
                window.location.href = "homeDiscord.html";
            });
        } else {
            return response.json().then(data => {
                document.getElementById("message").innerHTML = `<div class="notifications-container">
                <div class="error-alert">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="error-svg">
                        <path clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" fill-rule="evenodd"></path>
                      </svg>
                    </div>
                    <div class="error-prompt-container">
                      <p class="error-prompt-heading">${data.message}</p>
                    </div>
                  </div>
                </div>
              </div>`;
            });
        }
    })
    .catch(error => {
        document.getElementById("message").innerHTML = "An error occurred.";
    });
}

document.getElementById('btn-search-server').addEventListener('click', searchServer);

function searchServer() {
    let serverBuscado = document.getElementById('input-search-server').value;
    console.log("Buscando Servidor...");
    console.log(serverBuscado)

    fetch(`http://127.0.0.1:5000/server/get/${serverBuscado}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                console.log(data)

                const servers_container = document.getElementById('container-servers');
                servers_container.innerHTML = ""; // limpiar las opciones antes de mostrar un resultado
                var option = document.createElement('option');
                option.value = data.server_id; // Atributo "value"
                option.text = data.server_name; // Texto visible
                servers_container.appendChild(option);

                Toastify({
                    text: "Servidor encontrado!",
                    duration: 3000,
                    style: {
                        background: "linear-gradient(to right, #009942, #00b14d)",
                      },
                    }).showToast();
            });
        } else {
            return response.json().then(data => {
                // document.getElementById("message").innerHTML = data.message;
                Toastify({
                    text: `${data.message}`,
                    duration: 3000,
                    style: {
                        background: "linear-gradient(to right, #ff0000, #ff0000)",
                      },
                    }).showToast();
            });
        }
    })
    .catch(error => {
        document.getElementById("message").innerHTML = "An error occurred.";
    });
}