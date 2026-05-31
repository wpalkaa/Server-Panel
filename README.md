
Wojciech Pałka 300869 gr. 4

# Server Panel

Panel do zarządzania plikami serwera, zarządzania użytkownikami oraz monitorowania zużycia zasobów.

Automatycznie są tworzone dwa konta na które można się zalogować na stronie:
```
login: admin
passwrod: admin
``` 
oraz
```
login: user
password: user
```


---

##  Jak uruchomić

### 1. Sklonuj repozytorium
```bash
git clone https://github.com/wpalkaa/Server-Panel
```

### 2. Uruchom
```bash
kubectl create ns server-panel
kubectl apply -f k8s/mongodb-cm0-configmap.yaml --server-side
kubectl apply -f .\k8s\.
```

### 3. Obrazy aplikacyjne
backend : docker.io/wojdeg13/server-panel-backend:v1.0.0
frontend: docker.io/wojdeg13/server-panel-front:v1.0.0