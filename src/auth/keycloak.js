import Keycloak from "keycloak-js";

export const keycloakConfig = {
    url: import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8081",
    realm: import.meta.env.VITE_KEYCLOAK_REALM || "task",
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "task-frontend",
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
