import keycloak from "../auth/keycloak.js";

const API_URL = "/api";

async function authFetch(path, options = {}) {
    if (!keycloak?.authenticated) {
        await keycloak.login();
    }

    try {
       
        await keycloak.updateToken(30);
    } catch {
       
        await keycloak.login();
    }

    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `Bearer ${keycloak.token}`);

  
    if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    let response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
    try {
        await keycloak.updateToken(0);
        headers.set("Authorization", `Bearer ${keycloak.token}`);
        response = await fetch(`${API_URL}${path}`,{
        ...options,
        headers,
        })} catch{
            await keycloak.login();
        }
    }

    return response;
    
}

export async function getTasks() {
    const response = await authFetch(`/tasks`);
    return response.json();
}

export async function getPendingTasks() {
    const response = await authFetch(`/tasks?completed=false`);
    return response.json();
}

export async function getCompletedTasks() {
    const response = await authFetch(`/tasks?completed=true`);
    return response.json();
}

export async function createTask(task){
    const response = await authFetch(`/tasks`, {
        method: "POST",
        body: JSON.stringify(task)
        }
    )
    return response.json();
}

export async function deleteTask(id){
    await authFetch(`/tasks/${id}`, {
        method: "DELETE",
    });
}

export async function updateTask(id, task){
    const response = await authFetch(`/tasks/${id}`, {
        method:"PUT",
        body: JSON.stringify(task)
    }
    );
    return response.json();
}

export async function toggleTaskComplete(id){
    const response = await authFetch(`/tasks/${id}/complete`, {
        method: "PATCH"
    }
    );
    return response.json();
}