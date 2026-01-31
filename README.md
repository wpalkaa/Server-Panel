
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
Docker wymagany dla MongoDB.
```bash
sh run.sh
```

### Przydatne
- Adres www: https://localhost:3000/

- Adres serwera: https://localhost:13001/

- Adres bazy danych: mongodb://localhost:27017/

- By odpalić testy, należy uruchomić serwer - w katalogu **backend** `node src/server.js`
a następnie `npm run cov` 