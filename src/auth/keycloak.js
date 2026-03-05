import Keycloak from "keycloak-js";


const keycloak = new Keycloak({

    url: "http://localhost:8081",
    realm: "task",
    clientId: "task-frontend"
});

export default keycloak;