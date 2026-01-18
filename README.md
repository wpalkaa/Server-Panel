# Server Panel

Panel do zarządzania plikami serwera, monitorowania listy użytkowników oraz zużycia zasobów.

---

##  Jak uruchomić

### 1. Sklonuj repozytorium
```bash
git clone https://github.com/wpalkaa/Server-Panel
```

### 2. Konfiguracja Frontend'u
Pobierz wszystkie zależności
```bash
cd Server-Panel/frontend
npm install
```

Uruchom, wpisując:
- dla trybu deweloperskiego
```bash
npm run dev
```

- dla trybu produkcyjnego

```bash
npm run build
npm run start
```

### 3. Konfiguracja Backend'u

Pobierz wszystkie zależności

```bash
cd Server-Panel/backend
npm install
```

Włącz serwer, wpisująć:

```bash
node src/server.js
```