# Wdrożenie
### 1. Uruchomienie klastra w Docker Dekstop

### 2. Deploy zasobów
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f 00-ingress-controller.yaml

kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=120s

kubectl apply -f k8s/
```

### 3. Weryfikacja podów
```bash
kubectl get all -n server-panel
kubectl get pvc -n server-panel
kubectl get ingress -n server-panel
```

# Checklista

### Manifesty Kubernetes
- Projekt zawiera katalog k8s/ albo Helm/Kustomize. ✅
- Manifesty obejmują minimum: 
    - Namespace, ✅
    - Deployment, ✅
    - StatefulSet lub równoważny zasób dla bazy, ✅
    - Service, ✅
    - Ingress, ✅
    - ConfigMap, ✅
    - Secret, ✅
    - PVC.✅

### Deploymenty i rolling update
- Frontend/API/worker działają jako Deployment. ✅
- Backend ma minimum 2 repliki i strategię aktualizacji rolling update. ✅

Sprawdzenie:
```bash
kubectl get deploy -n server-panel
kubectl get pods -l io.kompose.service=backend -n server-panel
kubectl get deployment backend -o yaml -n server-panel

kubectl rollout restart deployment/backend -n server-panel
kubectl rollout status deployment/backend -n server-panel
```

### Baza danych i trwałość w Kubernetes
- Baza danych działa jako StatefulSet albo przez jasno uzasadniony zasób zapewniający trwałość. Musi używać PersistentVolumeClaim. ✅

Sprawdzenie:
```bash
kubectl get statefulset -n server-panel
kubectl get pvc -n server-panel

kubectl describe pod mongodb-0 -n server-panel # sekcja Mounts:
```

### Services, Ingress i izolacja
- Komunikacja wewnętrzna odbywa się przez Service. ✅
- Ruch zewnętrzny przechodzi przez Ingress. ✅
- Baza danych, cache i worker nie są wystawione na zewnątrz klastra.✅

Sprawdzenie:
``` bash
kubectl get svc -n server-panel
kubectl get ingress -n server-panel
```

### ConfigMap i Secret
- Konfiguracja niepoufna jest w ConfigMap, a dane poufne w Secret. ✅
- Hasła i tokeny nie mogą być zapisane jawnie w kodzie aplikacji ani w README jako prawdziwe wartości produkcyjne. ✅

Sprawdzenie:
```bash
kubectl get configmap -n server-panel
kubectl get secret -n server-panel

kubectl describe deployment backend -n server-panel # volumes
```

### Probes i zasoby
Główne kontenery mają 
- readinessProbe ✅
- livenessProbe ✅
- ustawione resources.requests i resources.limits ✅

Sprawdzenie:
```bash
kubectl describe pod frontend -n server-panel # gdzieś tam jest
```

### SecurityContext oraz initContainer albo Job
- Kontenery aplikacyjne działają jako non-root i mają podstawowy securityContext. ✅
- Projekt używa initContainer albo Job do migracji bazy, inicjalizacji danych lub oczekiwania na zależności.✅

Sprawdzenie:
```bash
# w manifestach jest `securityContext: runAsNonRoot: true`; jest initContainers
kubectl exec -it <pod> -n server-panel -- id # zwraca != 0
```

### CI/CD GitHub Actions
Repozytorium zawiera workflow, który 
- buduje obraz,  ✅
- uruchamia testy lub podstawową walidację, ✅
- publikuje obraz do rejestru ✅
- wykonuje deploy przez kubectl, Helm albo Kustomize. ✅
- Workflow sprawdza rollout po wdrożeniu.✅

Sprawdzenie:\
https://github.com/wpalkaa/Server-Panel/actions/runs/26786615050/job/78963885473

# Rzeczy dodatkowe

### NetworkPolicy
- Projekt definiuje NetworkPolicy, które ograniczają ruch między podami, np. baza przyjmuje ruch tylko z backendu lub workera. ✅

Sprawdzenie:
```bash
kubectl get networkpolicy -n server-panel
kubectl describe networkpolicy <nazwa> -n server-panel

kubectl exec -it deployment/frontend -n server-panel -- wget backend:3000/api/health
kubectl exec -it deployment/frontend -n server-panel -- nc -zv backend 3000
```

### PodDisruptionBudget
- Dla backendu dodano PodDisruptionBudget, który chroni minimalną dostępność replik podczas aktualizacji lub prac utrzymaniowych klastra. ✅

Sprawdzenie:
```bash
kubectl get pdb -n server-panel
kubectl describe pdb backend-pdb -n server-panel
```

### Helm albo Kustomize
- Projekt używa Helm albo Kustomize do parametryzacji manifestów i obsługuje minimum dwa środowiska, np. dev i prod. ❌

### Obserwowalność
- Aplikacja udostępnia /metrics, adnotacje dla Prometheusa albo inną prostą formę obserwowalności oraz instrukcję sprawdzenia metryk/logów. ❌

# Wymagania specyficzne dla projektu

### Minimalna funkcjonalność aplikacji
- Aplikacja ma jeden główny zasób biznesowy i obsługuje co najmniej dodanie danych, odczyt danych oraz endpoint /health lub /ready. Sprawdzenie: 2-3 komendy curl po wdrożeniu. ✅

Sprawdzenie:
```bash
kubectl exec -it deployment/frontend -n server-panel -- wget backend:3000/api/health
kubectl exec -it deployment/frontend -n server-panel -- nc -zv backend 3000
kubectl exec -it deployment/frontend -n server-panel -- wget nginx:80/api/health
```

### Trwałość danych aplikacji
- Dane aplikacji są zapisywane w bazie danych działającej w Kubernetes i pozostają dostępne po restarcie poda bazy. Sprawdzenie: dodać rekord, usunąć pod bazy, odczytać rekord po odtworzeniu poda. ✅

Sprawdzenie:
```bash
kubectl get pvc -n server-panel

kubectl delete pod mongodb-0 -n server-panel
# Poczekać, odśieżyć stronę
```

### Cache, kolejka albo worker
- Projekt zawiera dodatkowy komponent architektury, np. Redis, RabbitMQ albo worker. ✅ (redis)

Sprawdzenie:
```bash
kubectl exec -it deployment/redis -n server-panel -- redis-cli ping 
```