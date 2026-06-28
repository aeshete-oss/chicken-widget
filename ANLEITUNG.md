# Chicken Widget — Setup-Anleitung

Dein Küken-Widget in 3 Schritten deployen. Danach nie wieder anfassen.

---

## Schritt 1: Notion Integration erstellen (5 Min)

1. Gehe zu **https://www.notion.so/my-integrations**
2. Klick **"New integration"**
3. Einstellungen:
   - Name: `Chicken Widget`
   - Logo: Lade ein Küken-Bild hoch (optional, sieht der Käufer bei der Autorisierung)
   - Typ: **Public** (wichtig! Nicht "Internal")
   - Redirect URI: `https://dein-app-name.vercel.app/api/callback` (nach Schritt 2 anpassen)
4. Unter **Capabilities**:
   - Content: **Read content** (nur lesen!)
   - User: No user information
5. Klick **Submit**
6. Kopiere **OAuth client ID** und **OAuth client secret** — brauchst du in Schritt 2

---

## Schritt 2: Auf Vercel deployen (5 Min)

1. Erstelle einen Account auf **https://vercel.com** (kostenlos mit GitHub)
2. Erstelle ein neues GitHub-Repository und lade den `chicken-widget` Ordner hoch
3. In Vercel: **"Add New Project"** → wähle dein Repository
4. Unter **Environment Variables** diese 3 Werte eintragen:

   | Variable | Wert |
   |----------|------|
   | `NOTION_CLIENT_ID` | Dein OAuth client ID aus Schritt 1 |
   | `NOTION_CLIENT_SECRET` | Dein OAuth client secret aus Schritt 1 |
   | `REDIRECT_URI` | `https://dein-app-name.vercel.app/api/callback` |

5. Klick **Deploy**
6. Deine App ist jetzt live unter `https://dein-app-name.vercel.app`

**Wichtig:** Gehe zurück zu Schritt 1 und aktualisiere die Redirect URI in deiner Notion Integration mit der echten Vercel-URL.

---

## Schritt 3: Widget in dein Notion-Template einbauen

1. Öffne dein ADHD Cleaning Template in Notion
2. Tippe `/embed` und füge diese URL ein:
   ```
   https://dein-app-name.vercel.app
   ```
3. Fertig! Das Widget erscheint eingebettet in der Seite.

---

## Was der Käufer sieht

1. Käufer dupliziert dein Template
2. Auf der Seite sieht er das Küken-Widget mit **"Connect to Notion"**
3. Käufer klickt → Notion fragt "Erlaube Chicken Widget Zugriff?" → Käufer klickt **Allow**
4. **Ab jetzt automatisch:** Aufgabe als "Erledigt" markieren → Küken wächst
5. Das Widget refresht alle 3 Minuten automatisch

---

## Kosten

- Vercel Free Tier: **0 EUR** (100 GB Bandwidth, 100K Requests/Monat)
- Notion Integration: **0 EUR**
- Für ein Template mit 50-100 Käufern/Monat: **komplett kostenlos**

---

## Fehlerbehebung

**Widget zeigt "Couldn't find your Cleaning Tasks database":**
→ Der Käufer hat beim Autorisieren nicht die richtige Seite/Datenbank ausgewählt. Er muss auf "Reconnect" klicken und die Cleaning Tasks Datenbank freigeben.

**Widget lädt nicht in Notion:**
→ Prüfe ob die Vercel-App erreichbar ist (URL direkt im Browser öffnen).

**Käufer sieht altes Level nach Refresh:**
→ Das Widget cached 3 Minuten. Seite neu laden erzwingt einen frischen Abruf.
