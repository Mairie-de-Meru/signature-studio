# ✒️ Signature Studio

Mini-application web **100 % statique** pour concevoir et exporter des signatures
d'e-mail professionnelles : HTML5, CSS3 et JavaScript natif uniquement.
Aucun serveur, aucun Node.js, aucune compilation, aucune dépendance.

## 🚀 Lancer l'application

Ouvrez simplement **`index.html`** dans votre navigateur (double-clic).
C'est tout.

> Astuce : la banque d'images est décrite dans `assets/images.json`. Si votre
> navigateur bloque la lecture de ce fichier en ouverture directe (`file://`),
> l'application bascule automatiquement sur `assets/images-data.js` — vous ne
> perdez aucune fonctionnalité.

Vos saisies sont sauvegardées automatiquement dans le `localStorage` du
navigateur et restaurées à la prochaine ouverture.

## 📁 Structure

```
signature-studio/
├── index.html          Structure de la page (3 zones)
├── styles.css          Styles de l'interface
├── app.js              Logique : état, modèles, aperçu, export
├── README.md
└── assets/
    ├── images.json     Banque d'images (source principale)
    ├── images-data.js  Banque d'images (secours file://) — à garder synchronisé
    └── images/
        ├── entreprise/ ⭐ VOS visuels officiels (emplacements à remplacer)
        ├── avatars/    Avatars génériques
        ├── logos/      Logos de démonstration
        ├── bannieres/  Bannières génériques
        └── social/     Icônes sociales de référence
```

## ➕ Ajouter un modèle de signature

Dans `app.js`, repérez l'objet `TEMPLATES`. Chaque modèle est une entrée :

```js
monModele: {
  label: "Mon modèle",
  render(p) {
    // p contient les briques prêtes à l'emploi :
    // p.name, p.role, p.company, p.contactBlock, p.contactInline,
    // p.social, p.photo, p.logo, p.banner, p.legal, p.s (styles)…
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0">…</table>`;
  }
}
```

Dupliquez un modèle existant, adaptez le HTML retourné (tableaux + styles en
ligne uniquement), et il apparaît automatiquement dans la liste des vignettes.

## 🖼️ Ajouter une image à la banque

1. Copiez le fichier (SVG ou PNG/JPG **léger**, < 100 Ko idéalement) dans le
   sous-dossier adapté de `assets/images/`.
2. Ajoutez une entrée `{ "file": "...", "alt": "..." }` dans la catégorie
   correspondante de **`assets/images.json`** **et** de
   **`assets/images-data.js`** (les deux fichiers doivent rester identiques).

Vous pouvez aussi importer une image ponctuelle via le bouton
« 📁 Importer une image… » (elle est stockée localement dans le navigateur).

## 🏢 Remplacer les visuels de l'entreprise

Les emplacements réservés sont dans **`assets/images/entreprise/`** :

- `logo-entreprise.svg` → remplacez-le par votre logo (gardez le même nom de
  fichier, ou ajoutez le vôtre puis référencez-le dans `images.json` /
  `images-data.js`) ;
- `banniere-entreprise.svg` → idem pour votre bannière.

## ☁️ Héberger les images (indispensable pour l'envoi)

Les logiciels de messagerie des destinataires ne peuvent afficher **que des
images accessibles publiquement**. Les chemins locaux (`assets/…`) et les
images intégrées (`data:`) ne fonctionneront pas partout (Gmail les bloque).

1. Déposez vos images sur un hébergement public : votre site web, un CDN,
   GitHub Pages, un bucket S3…
2. Récupérez l'URL absolue en `https://` de chaque image.
3. Utilisez ces URL dans la signature (importez l'image pour l'aperçu, puis
   remplacez le `src` dans le HTML exporté, ou hébergez d'abord et collez
   directement).

L'application vous avertit sous l'aperçu quand une image n'est pas hébergée.

## 📬 Installer la signature

Cliquez d'abord sur **« 📋 Copier la signature »** dans l'application.

### Gmail
1. ⚙️ → **Voir tous les paramètres** → onglet **Général**.
2. Section **Signature** → **Créer** → nommez la signature.
3. Collez (Ctrl+V / Cmd+V) dans la zone d'édition.
4. Choisissez cette signature pour les nouveaux messages, puis **Enregistrer
   les modifications** en bas de page.

### Outlook (nouveau Outlook / Outlook web)
1. ⚙️ → **Compte** → **Signatures**.
2. **Nouvelle signature**, nommez-la, collez le contenu.
3. Définissez-la comme signature par défaut, puis **Enregistrer**.

> Outlook Windows classique : Fichier → Options → Courrier → Signatures →
> Nouvelle, puis collez.

### Apple Mail (macOS)
1. **Mail** → **Réglages** → onglet **Signatures**.
2. Sélectionnez votre compte, cliquez sur **+**.
3. Décochez « Toujours utiliser ma police par défaut ».
4. Collez la signature dans la zone de droite.

> Si le collage perd la mise en forme, utilisez « 🖱️ Sélection manuelle » dans
> l'application puis copiez avec Cmd+C avant de coller dans Mail.

## ✅ Compatibilité du HTML exporté

Le HTML généré respecte les contraintes des clients de messagerie :

- mise en page **à base de tableaux** (`role="presentation"`) ;
- **styles CSS en ligne** uniquement ;
- **polices web-safe** (Arial, Georgia, Verdana…) ;
- pas de JavaScript, formulaire, animation ni police distante ;
- attributs `alt` sur toutes les images ;
- liens en URL absolues (`https://`, `mailto:`, `tel:`) ;
- icônes sociales rendues en pastilles colorées HTML (aucune image à héberger).

## 🔒 Confidentialité

Toutes les données restent dans votre navigateur (`localStorage`).
Rien n'est envoyé sur un serveur.
