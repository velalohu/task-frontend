import Keycloak from "keycloak-js";


const keycloak = new Keycloak({

    url: "https://auth.tasksrc.es",
    realm: "task",
    clientId: "task-frontend"
});

export default keycloak;
