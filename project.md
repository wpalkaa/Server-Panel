# Projekt - React

**Warunek podstawowy uzyskania zaliczenia - kompletne repozytorium zgodne z kolejnymi zadaniami i zaliczone kolokwium**

**Warunki konieczne**:
- React / NextJS
- ESLint - nie może zwracać żadnych błędów
- Formik
- Strona ma być responsywna 
- Unikalny temat zgodny z dziedziną lub ustalony indywidualnie


**Termin 20.01.2025 godz.: 10:00**

Wymagania: 
1. Interfejs
    1. ~~interfejs aplikacji powinien być przemyślany i jasno komunikować użytkownikowi jakie działania podjął (np.: wyświetlanie aktualnego sposobu sortowania lub przycisk cofnij na podstronach). Proszę się trzymać zasady: *Nie każ mi myśleć*  [DST]~~
    1. ~~interfejs powinien spełniać aktualne standardy stylowania. (możesz użyć gotowej biblioteki - w razie wątpliwości zapytaj prowadzącego). [DST]~~
1. Funkcjonalność
    1. ~~aplikacja musi korzystać z jakiegoś REST API z danymi w formacie JSON - stworzonego samodzielnie (zachęcam do wykorzystnia API tworzonego na przedmiocie 'Bazy danych 2' lub dostępnego publicznie. [DST]~~
    1. ~~aplikacja musi korzystać z komponentów funkcyjnych. Powinna być podzielona na komponenty. Komponenty klasowe będą skutkowały oceną niedostateczną z projektu. [DST]~~
    1. ~~Oceniany będzie również styl kodu i przestrzeganie zasad clean code.~~
    1. Oceniana będzie struktura store'a i operacje na nim wykonywane.
1. Pobieranie danych
    1. Dane powinny być w pierwszej kolejności pobierane ze store'a, a jeśli tam ich nie ma to dopiero z API.
    1. Dane z dziedziny głównej [DST]
        1. ~~Powinna być możliwość wyświetlenia wszystkich danych~~
            1.~~ na liście powinny być widoczne podstawowe dane [DST]~~
            1. ~~z podziałem na strony (paginacja) [BDB]~~
        1. Możliwość filtrowania pól 
            1. o trzech różnych typach (np.: checkbox, dropdown i text oraz inne kombinacje) [DB]
        1. Możliwość sortowania 
            1. Alfabetycznie, wg daty oraz wg danych liczbowych [DST]
        1. ~~Graficzne przedstawienie danych:~~
            1. ~~wyświetlenie informacji o elemencie wraz ze zdjęciem [DST]~~
    1. Dane dodatkowe dla dziedziny pobocznej [BDB]
        1. W widoku dziedziny pobocznej powinny pojawiać się elementy z dziedziny powiązanej

1. Poruszanie się po aplikacji
    1. ~~Powinna być możliwość przeglądania danych w strukturze master - detail (lista wszystkich elementów, po naciśnięciu na dany element pokazują się dane szczegółowe ~~
    1. ~~W widoku prezentującym dziedzinę powinny wyświetlać się dane z dziedzin pobocznych. Po kliknięciu na dane w elemencie powinno nastąpić przekierowanie na stronę zawierającą szczegóły na jego temat~~
    1. ~~W widoku przezentującym dziedziny poboczne i powiązane powinny wyświetlać się statystyki związane z powiązaniami.~~ 
    1. ~~Widok szczegółowy powinien umożliwić edycję i usunięcie widocznego elementu po naciśnięciu odpowiednich przycisków~~
    1. ~~Na liście wszystkich danych powinna być możliwość dodania nowego elementu po naciśnięciu przycisku. [DST]~~
1. ~~Dodawanie i edycja danych~~ 
    1. ~~Dodawanie i edycja danych powinna się znajdować pod odpowiednimi route'ami [DST]~~
    1. ~~Powinna być możliwość dodawania i edycji danych [DST]~~
    1. ~~Powinien istnieć wspólny formularz dla operacji dodawania i edycji. ~~
    1. ~~Formularz powinien spełniać wymagania stawiane przez backend (np. odpowiednie typy danych). [DST]~~
    1. ~~Wymagana jest odpowiednia walidacja danych [DST]~~
    1. ~~W widoku elementu z dziedziny powinna być możliwość zmiany elementów z dziedziny głównej [DST] i dodania/usunięcia elementów powiązanych. [BDB]~~
1. Statystyki
    1. ~~Powinna być możliwość przeglądania "ciekawych" statystyk w aplikacji (np. elementy z największą/najmniejszą liczbą powiązań, statystyki liczbowe itp.). Statystyki powinny być umieszczone pod osobnym routem i zaprezentowane w czytelny sposób. [BDB]~~
    1. ~~Statystyki powinny być wizualizowane za pomocą wykresów (z użyciem dowolnej wtyczki) [BDB]~~ 
1. ~~Internacjonalizacja [BDB]~~
    1. ~~Aplikacja powinna być dostępna w dwóch wersjach językowych przełączanych przyciskiem.~~ 
1. ~Integracje z kolejnymi API [BDB]~
    1. Przykłady rozmaitych API (np. currency exchange, geoapi, tourism itp.)[przykłady publicznych API](https://github.com/public-apis/public-apis)
