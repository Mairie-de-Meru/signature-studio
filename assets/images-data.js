/*
 * Banque d'images — solution de secours.
 * Ce fichier est utilisé quand le navigateur bloque la lecture de
 * assets/images.json en ouverture directe de index.html (protocole file://).
 * IMPORTANT : gardez ce fichier synchronisé avec assets/images.json.
 * Pour ajouter une image : copiez le fichier dans assets/images/<categorie>/
 * puis ajoutez une entrée { file, alt } dans la catégorie correspondante,
 * ici ET dans images.json.
 */
window.IMAGE_BANK = {
  "categories": [
    {
      "id": "entreprise",
      "label": "Entreprise",
      "description": "Vos visuels officiels. Remplacez les fichiers du dossier assets/images/entreprise.",
      "images": [
        {
          "file": "assets/images/entreprise/logo-entreprise.svg",
          "alt": "Logo de l'entreprise (emplacement à remplacer)",
          "type": "logo"
        },
        {
          "file": "assets/images/entreprise/banniere-entreprise.svg",
          "alt": "Bannière de l'entreprise (emplacement à remplacer)",
          "type": "banner"
        }
      ]
    },
    {
      "id": "avatars",
      "label": "Avatars",
      "description": "Avatars génériques en attendant une vraie photo.",
      "images": [
        {
          "file": "assets/images/avatars/avatar-1.svg",
          "alt": "Avatar générique bleu",
          "type": "avatar"
        },
        {
          "file": "assets/images/avatars/avatar-2.svg",
          "alt": "Avatar générique orange",
          "type": "avatar"
        },
        {
          "file": "assets/images/avatars/avatar-3.svg",
          "alt": "Avatar générique vert",
          "type": "avatar"
        },
        {
          "file": "assets/images/avatars/avatar-4.svg",
          "alt": "Avatar générique violet",
          "type": "avatar"
        }
      ]
    },
    {
      "id": "logos",
      "label": "Logos",
      "description": "Logos temporaires de démonstration.",
      "images": [
        {
          "file": "assets/images/logos/logo-1.svg",
          "alt": "Logo de démonstration ACME",
          "type": "logo"
        },
        {
          "file": "assets/images/logos/logo-2.svg",
          "alt": "Logo de démonstration Studio",
          "type": "logo"
        },
        {
          "file": "assets/images/logos/logo-3.svg",
          "alt": "Logo de démonstration Peak",
          "type": "logo"
        }
      ]
    },
    {
      "id": "bannieres",
      "label": "Bannières",
      "description": "Bannières promotionnelles génériques.",
      "images": [
        {
          "file": "assets/images/bannieres/banniere-1.svg",
          "alt": "Bannière dégradé bleu-vert",
          "type": "banner"
        },
        {
          "file": "assets/images/bannieres/banniere-2.svg",
          "alt": "Bannière sombre Nouveautés",
          "type": "banner"
        }
      ]
    },
    {
      "id": "social",
      "label": "Icônes sociales",
      "description": "Icônes de référence (la signature utilise des pastilles compatibles e-mail).",
      "images": [
        {
          "file": "assets/images/social/linkedin.svg",
          "alt": "Icône LinkedIn",
          "type": "icone"
        },
        {
          "file": "assets/images/social/instagram.svg",
          "alt": "Icône Instagram",
          "type": "icone"
        },
        {
          "file": "assets/images/social/facebook.svg",
          "alt": "Icône Facebook",
          "type": "icone"
        },
        {
          "file": "assets/images/social/x.svg",
          "alt": "Icône X",
          "type": "icone"
        },
        {
          "file": "assets/images/social/youtube.svg",
          "alt": "Icône YouTube",
          "type": "icone"
        }
      ]
    },
    {
      "id": "icones",
      "label": "Icônes",
      "description": "Icônes SVG libres de droits pour signatures d'entreprise : fleurs, TV, informatique, web, contact, etc.",
      "images": [
        {
          "file": "assets/images/icones/fleur-tournesol.svg",
          "alt": "Fleur — Tournesol",
          "type": "icone"
        },
        {
          "file": "assets/images/icones/fleur-tulipe.svg",
          "alt": "Fleur — Tulipe",
          "type": "icone"
        },
        {
          "file": "assets/images/icones/fleur-marguerite.svg",
          "alt": "Fleur — Marguerite",
          "type": "icone"
        },
        {
          "file": "assets/images/icones/television.svg",
          "alt": "Télévision",
          "type": "icone"
        },
        {
          "file": "assets/images/icones/ordinateur.svg",
          "alt": "Ordinateur",
          "type": "icone"
        },
        {
          "file": "assets/images/icones/clavier.svg",
          "alt": "Clavier",
          "type": "icone"
        },
        {
          "file": "assets/images/icones/cd-rom.svg",
          "alt": "CD-ROM / Disque",
          "type": "icone"
        },
        {
          "file": "assets/images/icones/graphique.svg",
          "alt": "Graphique / Statistiques",
          "type": "icone"
        },
        {
          "file": "assets/images/icones/web.svg",
          "alt": "Web / Internet",
          "type": "icone"
        },
        {
          "file": "assets/images/icones/mailing.svg",
          "alt": "Mailing / Enveloppe",
          "type": "icone"
        },
        {
          "file": "assets/images/icones/dossier.svg",
          "alt": "Dossier",
          "type": "icone"
        },
        {
          "file": "assets/images/icones/securite.svg",
          "alt": "Sécurité / Bouclier",
          "type": "icone"
        },
        {
          "file": "assets/images/icones/contact.svg",
          "alt": "Contact / Carte de visite",
          "type": "icone"
        },
        {
          "file": "assets/images/icones/geo localisation.svg",
          "alt": "Géolocalisation / Adresse",
          "type": "icone"
        },
        {
          "file": "assets/images/icones/document.svg",
          "alt": "Document",
          "type": "icone"
        },
        {
          "file": "assets/images/icones/telephone.svg",
          "alt": "Téléphone",
          "type": "icone"
        }
      ]
    },
    {
      "id": "vie-locale",
      "label": "Vie locale",
      "description": "Images libres de droits (Wikimedia Commons, bannière).",
      "images": [
        {
          "file": "assets/images/banks/vie-locale/Nonac-Place-publique-2013-JPG-0.jpg",
          "alt": "Nonac Place publique 2013",
          "slot": "banner",
          "license": "CC BY-SA 3.0",
          "source": "https://commons.wikimedia.org/wiki/File:Nonac_Place_publique_2013.JPG",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/vie-locale/Place-publique-Marche-pour-le-climat-Nevers-16-Mar-1.jpg",
          "alt": "Place publique, Marche pour le climat, Nevers, 16 Mar 2019",
          "slot": "banner",
          "license": "CC BY-SA 4.0",
          "source": "https://commons.wikimedia.org/wiki/File:Place_publique,_Marche_pour_le_climat,_Nevers,_16_Mar_2019.jpg",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/vie-locale/Logo-Place-publique-svg-2.png",
          "alt": "Logo Place publique",
          "slot": "banner",
          "license": "Public domain",
          "source": "https://commons.wikimedia.org/wiki/File:Logo_Place_publique.svg",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/vie-locale/Jardin-Place-01-jpg-3.jpg",
          "alt": "Jardin Place 01",
          "slot": "banner",
          "license": "CC BY-SA 4.0",
          "source": "https://commons.wikimedia.org/wiki/File:Jardin_Place_01.jpg",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/vie-locale/Place-Agnico-Eagle-jpg-4.jpg",
          "alt": "Place Agnico-Eagle",
          "slot": "banner",
          "license": "CC0",
          "source": "https://commons.wikimedia.org/wiki/File:Place_Agnico-Eagle.jpg",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/vie-locale/Place-Agnico-Eagle-arriere-jpg-5.jpg",
          "alt": "Place Agnico-Eagle arrière",
          "slot": "banner",
          "license": "CC0",
          "source": "https://commons.wikimedia.org/wiki/File:Place_Agnico-Eagle_arri%C3%A8re.jpg",
          "type": "banner"
        }
      ]
    },
    {
      "id": "nature",
      "label": "Nature & Parcs",
      "description": "Images libres de droits (Wikimedia Commons, bannière).",
      "images": [
        {
          "file": "assets/images/banks/nature/Hain-Eiche-Herbst-121696-jpg-0.jpg",
          "alt": "Hain Eiche Herbst 121696",
          "slot": "banner",
          "license": "CC BY-SA 4.0",
          "source": "https://commons.wikimedia.org/wiki/File:Hain_Eiche_Herbst_121696.jpg",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/nature/Flowering-of-Cercis-siliquastrum-in-the-Parco-dell-1.jpg",
          "alt": "Flowering of Cercis siliquastrum in the 'Parco delle Valli' urban park",
          "slot": "banner",
          "license": "CC BY-SA 4.0",
          "source": "https://commons.wikimedia.org/wiki/File:Flowering_of_Cercis_siliquastrum_in_the_%27Parco_delle_Valli%27_urban_park.jpg",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/nature/Park-Srodula-Sosnowiec-Jesien-2021-jpg-2.jpg",
          "alt": "Park Środula, Sosnowiec, Jesień 2021",
          "slot": "banner",
          "license": "CC BY-SA 4.0",
          "source": "https://commons.wikimedia.org/wiki/File:Park_%C5%9Arodula,_Sosnowiec,_Jesie%C5%84_2021.jpg",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/nature/Croix-parc-mallet-stevens-tunnel-jpg-3.jpg",
          "alt": "Croix parc mallet stevens tunnel",
          "slot": "banner",
          "license": "CC BY-SA 4.0",
          "source": "https://commons.wikimedia.org/wiki/File:Croix_parc_mallet_stevens_tunnel.jpg",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/nature/Pond-at-Pearl-s-Hill-City-Park-Singapore-jpg-4.jpg",
          "alt": "Pond at Pearl's Hill City Park, Singapore",
          "slot": "banner",
          "license": "CC BY-SA 4.0",
          "source": "https://commons.wikimedia.org/wiki/File:Pond_at_Pearl%27s_Hill_City_Park,_Singapore.jpg",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/nature/An-Urban-Park-jpg-5.jpg",
          "alt": "An Urban Park",
          "slot": "banner",
          "license": "CC BY 4.0",
          "source": "https://commons.wikimedia.org/wiki/File:An_Urban_Park.jpg",
          "type": "banner"
        }
      ]
    },
    {
      "id": "france",
      "label": "France & Symboles",
      "description": "Images libres de droits (Wikimedia Commons, logo).",
      "images": [
        {
          "file": "assets/images/banks/france/Hugues-Lettre-de-Marianne-aux-republicains-1871-dj-0.jpg",
          "alt": "Hugues - Lettre de Marianne aux républicains, 1871",
          "slot": "logo",
          "license": "Public domain",
          "source": "https://commons.wikimedia.org/wiki/File:Hugues_-_Lettre_de_Marianne_aux_r%C3%A9publicains,_1871.djvu",
          "type": "logo"
        },
        {
          "file": "assets/images/banks/france/Pour-le-drapeau-Pour-la-victoire-Souscrivez-a-l-em-1.jpg",
          "alt": "Pour le drapeau! Pour la victoire! Souscrivez à l'emprunt national . . . Banque ",
          "slot": "logo",
          "license": "Public domain",
          "source": "https://commons.wikimedia.org/wiki/File:Pour_le_drapeau!_Pour_la_victoire!_Souscrivez_%C3%A0_l%27emprunt_national_._._._Banque_nationale_de_cr%C3%A9dit_LCCN99613516.jpg",
          "type": "logo"
        },
        {
          "file": "assets/images/banks/france/Pour-le-Drapeau-Pour-la-Victoire-Souscrivez-a-l-Em-2.jpg",
          "alt": "<div class=\"fn\">\nPour le Drapeau! Pour la Victoire! ... Souscrivez a l'Emprunt N",
          "slot": "logo",
          "license": "No restrictions",
          "source": "https://commons.wikimedia.org/wiki/File:Pour_le_Drapeau!_Pour_la_Victoire!_..._Souscrivez_a_l%27Emprunt_National._-_DPLA_-_accf3167f4455e77771ff454fd0de569.jpg",
          "type": "logo"
        }
      ]
    },
    {
      "id": "fonds",
      "label": "Fonds abstraits",
      "description": "Images libres de droits (Wikimedia Commons, bannière).",
      "images": [
        {
          "file": "assets/images/banks/fonds/Abstract-Blue-Background-png-0.png",
          "alt": "Abstract Blue Background",
          "slot": "banner",
          "license": "CC BY-SA 3.0",
          "source": "https://commons.wikimedia.org/wiki/File:Abstract_Blue_Background.png",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/fonds/Wavy-Gradient-1-Orange-and-Violet-21180369850-jpg-1.jpg",
          "alt": "Wavy Gradient 1 Orange and Violet (21180369850)",
          "slot": "banner",
          "license": "CC BY 2.0",
          "source": "https://commons.wikimedia.org/wiki/File:Wavy_Gradient_1_Orange_and_Violet_(21180369850).jpg",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/fonds/Geometric-Abstract-Background-jpg-2.jpg",
          "alt": "Geometric Abstract Background",
          "slot": "banner",
          "license": "CC0",
          "source": "https://commons.wikimedia.org/wiki/File:Geometric_Abstract_Background.jpg",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/fonds/Gradient-Abstract-Background-jpg-3.jpg",
          "alt": "Gradient Abstract Background",
          "slot": "banner",
          "license": "CC0",
          "source": "https://commons.wikimedia.org/wiki/File:Gradient_Abstract_Background.jpg",
          "type": "banner"
        }
      ]
    },
    {
      "id": "bureaux",
      "label": "Bureaux & Travail",
      "description": "Images libres de droits (Wikimedia Commons, bannière).",
      "images": [
        {
          "file": "assets/images/banks/bureaux/EFTA00000865-Modern-office-workspace-featuring-mul-0.jpg",
          "alt": "EFTA00000865 - Modern office workspace featuring multiple monitors on a wall a l",
          "slot": "banner",
          "license": "Public domain",
          "source": "https://commons.wikimedia.org/wiki/File:EFTA00000865_-_Modern_office_workspace_featuring_multiple_monitors_on_a_wall_a_laptop_on_a_desk_and_a_cluttered_yet_functional_setup.jpg",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/bureaux/Modern-office-workspace-featuring-a-computer-jpg-1.jpg",
          "alt": "Modern office workspace featuring a computer",
          "slot": "banner",
          "license": "CC BY 2.0",
          "source": "https://commons.wikimedia.org/wiki/File:Modern_office_workspace_featuring_a_computer.jpg",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/bureaux/Modern-office-workspace-with-a-stylish-desk-jpg-2.jpg",
          "alt": "Modern office workspace with a stylish desk",
          "slot": "banner",
          "license": "CC BY 2.0",
          "source": "https://commons.wikimedia.org/wiki/File:Modern_office_workspace_with_a_stylish_desk.jpg",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/bureaux/Business-professional-engages-in-note-taking-durin-3.jpg",
          "alt": "Business professional engages in note-taking during a meeting at a modern office",
          "slot": "banner",
          "license": "CC BY 2.0",
          "source": "https://commons.wikimedia.org/wiki/File:Business_professional_engages_in_note-taking_during_a_meeting_at_a_modern_office_desk.jpg",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/bureaux/Person-writing-in-notebook-while-using-laptop-at-a-4.jpg",
          "alt": "Person writing in notebook while using laptop at a modern workspace",
          "slot": "banner",
          "license": "CC BY 2.0",
          "source": "https://commons.wikimedia.org/wiki/File:Person_writing_in_notebook_while_using_laptop_at_a_modern_workspace.jpg",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/bureaux/Mini-shopping-cart-placed-on-a-table-next-to-a-lap-5.jpg",
          "alt": "Mini shopping cart placed on a table next to a laptop in a modern office setting",
          "slot": "banner",
          "license": "CC BY 2.0",
          "source": "https://commons.wikimedia.org/wiki/File:Mini_shopping_cart_placed_on_a_table_next_to_a_laptop_in_a_modern_office_setting.jpg",
          "type": "banner"
        }
      ]
    },
    {
      "id": "technologie",
      "label": "Technologie",
      "description": "Images libres de droits (Wikimedia Commons, bannière).",
      "images": [
        {
          "file": "assets/images/banks/technologie/Forest-of-synthetic-pyramidal-dendrites-grown-usin-0.png",
          "alt": "Forest of synthetic pyramidal dendrites grown using Cajal's laws of neuronal bra",
          "slot": "banner",
          "license": "CC BY 2.5",
          "source": "https://commons.wikimedia.org/wiki/File:Forest_of_synthetic_pyramidal_dendrites_grown_using_Cajal%27s_laws_of_neuronal_branching.png",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/technologie/Wireless-network-interface-controller-Gigabyte-GC--1.jpg",
          "alt": "Wireless network interface controller Gigabyte GC-WB867D-I - front and back - 20",
          "slot": "banner",
          "license": "CC BY-SA 4.0",
          "source": "https://commons.wikimedia.org/wiki/File:Wireless_network_interface_controller_Gigabyte_GC-WB867D-I_-_front_and_back_-_2018-05-15.jpg",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/technologie/Liquid-circuit-cooling-installation-for-a-Static-V-2.jpg",
          "alt": "Liquid circuit cooling installation for a Static VAR Compensator used in a large",
          "slot": "banner",
          "license": "CC BY 4.0",
          "source": "https://commons.wikimedia.org/wiki/File:Liquid_circuit_cooling_installation_for_a_Static_VAR_Compensator_used_in_a_large_high_voltage_electrical_distribution_network.jpg",
          "type": "banner"
        }
      ]
    },
    {
      "id": "monochromes",
      "label": "Avatars monochromes",
      "description": "Images libres de droits (Wikimedia Commons, logo).",
      "images": []
    },
    {
      "id": "avatars-modern",
      "label": "Avatars illustrés",
      "description": "Avatars illustrés (DiceBear, libre de droits). Teintez-les avec le sélecteur de couleur.",
      "images": [
        {
          "file": "assets/images/banks/avatars-modern/Aurelie.svg",
          "alt": "Avatar Aurélie",
          "slot": "photo",
          "tintable": true,
          "source": "DiceBear (libre de droits)",
          "type": "avatar"
        },
        {
          "file": "assets/images/banks/avatars-modern/Camille.svg",
          "alt": "Avatar Camille",
          "slot": "photo",
          "tintable": true,
          "source": "DiceBear (libre de droits)",
          "type": "avatar"
        },
        {
          "file": "assets/images/banks/avatars-modern/Julien.svg",
          "alt": "Avatar Julien",
          "slot": "photo",
          "tintable": true,
          "source": "DiceBear (libre de droits)",
          "type": "avatar"
        },
        {
          "file": "assets/images/banks/avatars-modern/Marie.svg",
          "alt": "Avatar Marie",
          "slot": "photo",
          "tintable": true,
          "source": "DiceBear (libre de droits)",
          "type": "avatar"
        },
        {
          "file": "assets/images/banks/avatars-modern/Pierre.svg",
          "alt": "Avatar Pierre",
          "slot": "photo",
          "tintable": true,
          "source": "DiceBear (libre de droits)",
          "type": "avatar"
        },
        {
          "file": "assets/images/banks/avatars-modern/Sophie.svg",
          "alt": "Avatar Sophie",
          "slot": "photo",
          "tintable": true,
          "source": "DiceBear (libre de droits)",
          "type": "avatar"
        },
        {
          "file": "assets/images/banks/avatars-modern/Thomas.svg",
          "alt": "Avatar Thomas",
          "slot": "photo",
          "tintable": true,
          "source": "DiceBear (libre de droits)",
          "type": "avatar"
        },
        {
          "file": "assets/images/banks/avatars-modern/Valerie.svg",
          "alt": "Avatar Valérie",
          "slot": "photo",
          "tintable": true,
          "source": "DiceBear (libre de droits)",
          "type": "avatar"
        },
        {
          "file": "assets/images/banks/avatars-modern/Nicolas.svg",
          "alt": "Avatar Nicolas",
          "slot": "photo",
          "tintable": true,
          "source": "DiceBear (libre de droits)",
          "type": "avatar"
        },
        {
          "file": "assets/images/banks/avatars-modern/Isabelle.svg",
          "alt": "Avatar Isabelle",
          "slot": "photo",
          "tintable": true,
          "source": "DiceBear (libre de droits)",
          "type": "avatar"
        },
        {
          "file": "assets/images/banks/avatars-modern/Laurent.svg",
          "alt": "Avatar Laurent",
          "slot": "photo",
          "tintable": true,
          "source": "DiceBear (libre de droits)",
          "type": "avatar"
        },
        {
          "file": "assets/images/banks/avatars-modern/Elodie.svg",
          "alt": "Avatar Élodie",
          "slot": "photo",
          "tintable": true,
          "source": "DiceBear (libre de droits)",
          "type": "avatar"
        }
      ]
    },
    {
      "id": "generes-icones",
      "label": "Icônes générées",
      "description": "Icônes vectorielles générées par RunningHub (GPT Image 2), découpées en PNG transparents.",
      "images": [
        {
          "file": "assets/images/banks/generes/icones/icone-telephone.png",
          "alt": "Icône téléphone",
          "type": "icone"
        },
        {
          "file": "assets/images/banks/generes/icones/icone-enveloppe.png",
          "alt": "Icône enveloppe",
          "type": "icone"
        },
        {
          "file": "assets/images/banks/generes/icones/icone-globe.png",
          "alt": "Icône globe",
          "type": "icone"
        },
        {
          "file": "assets/images/banks/generes/icones/icone-position.png",
          "alt": "Icône position",
          "type": "icone"
        },
        {
          "file": "assets/images/banks/generes/icones/icone-calendrier.png",
          "alt": "Icône calendrier",
          "type": "icone"
        },
        {
          "file": "assets/images/banks/generes/icones/icone-horloge.png",
          "alt": "Icône horloge",
          "type": "icone"
        },
        {
          "file": "assets/images/banks/generes/icones/icone-dossier.png",
          "alt": "Icône dossier",
          "type": "icone"
        },
        {
          "file": "assets/images/banks/generes/icones/icone-document.png",
          "alt": "Icône document",
          "type": "icone"
        },
        {
          "file": "assets/images/banks/generes/icones/icone-bouclier.png",
          "alt": "Icône bouclier",
          "type": "icone"
        },
        {
          "file": "assets/images/banks/generes/icones/icone-graphique.png",
          "alt": "Icône graphique",
          "type": "icone"
        },
        {
          "file": "assets/images/banks/generes/icones/icone-chat.png",
          "alt": "Icône chat",
          "type": "icone"
        },
        {
          "file": "assets/images/banks/generes/icones/icone-profil.png",
          "alt": "Icône profil",
          "type": "icone"
        },
        {
          "file": "assets/images/banks/generes/icones/icone-camera.png",
          "alt": "Icône caméra",
          "type": "icone"
        },
        {
          "file": "assets/images/banks/generes/icones/icone-imprimante.png",
          "alt": "Icône imprimante",
          "type": "icone"
        },
        {
          "file": "assets/images/banks/generes/icones/icone-panier.png",
          "alt": "Icône panier",
          "type": "icone"
        },
        {
          "file": "assets/images/banks/generes/icones/icone-wifi.png",
          "alt": "Icône wifi",
          "type": "icone"
        }
      ]
    },
    {
      "id": "generes-bannieres",
      "label": "Bannières générées",
      "description": "Illustrations génériques générées par RunningHub (GPT Image 2) pour vos bannières.",
      "images": [
        {
          "file": "assets/images/banks/generes/bannieres/banniere-ville-dusk.jpg",
          "alt": "Bannière ville au crépuscule",
          "slot": "banner",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/generes/bannieres/banniere-campagne-verte.jpg",
          "alt": "Bannière campagne verdoyante",
          "slot": "banner",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/generes/bannieres/banniere-bureau-moderne.jpg",
          "alt": "Bannière bureau moderne",
          "slot": "banner",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/generes/bannieres/banniere-lac-montagnes.jpg",
          "alt": "Bannière lac et montagnes au lever du soleil",
          "slot": "banner",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/generes/bannieres/banniere-plage-tropicale.jpg",
          "alt": "Bannière plage tropicale",
          "slot": "banner",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/generes/bannieres/banniere-fete-confettis.jpg",
          "alt": "Bannière fête et confettis",
          "slot": "banner",
          "type": "banner"
        }
      ]
    },
    {
      "id": "generes-fonds",
      "label": "Fonds générés",
      "description": "Fonds abstraits générés par RunningHub (GPT Image 2) pour bannières et illustrations.",
      "images": [
        {
          "file": "assets/images/banks/generes/fonds/fond-vagues-bleu.jpg",
          "alt": "Fond vagues bleues",
          "slot": "banner",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/generes/fonds/fond-formes-pastel.jpg",
          "alt": "Fond formes pastel",
          "slot": "banner",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/generes/fonds/fond-aurore-boreale.jpg",
          "alt": "Fond aurore boréale",
          "slot": "banner",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/generes/fonds/fond-particules-nuit.jpg",
          "alt": "Fond particules nuit",
          "slot": "banner",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/generes/fonds/fond-marbre-or.jpg",
          "alt": "Fond marbre or",
          "slot": "banner",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/generes/fonds/fond-mesh-coral.jpg",
          "alt": "Fond mesh corail",
          "slot": "banner",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/generes/fonds/fond-rayures-rose.jpg",
          "alt": "Fond rayures rose et violet",
          "slot": "banner",
          "type": "banner"
        },
        {
          "file": "assets/images/banks/generes/fonds/fond-ondes-gris.jpg",
          "alt": "Fond ondes gris et bleu",
          "slot": "banner",
          "type": "banner"
        }
      ]
    }
  ]
};
