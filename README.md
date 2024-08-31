# Discord Meme Bot

## Description
Ce bot Discord génère des memes en utilisant une légende créée par l'API OpenAI. Il prend en charge les commandes slash et gère les contenus NSFW de manière appropriée selon le type de salon.

## Fonctionnalités
- **/help** : Affiche toutes les commandes disponibles.
- **/c [prompt]** : Génère un meme basé sur le prompt fourni.
  - Dans les salons non-NSFW, le bot filtre les mots interdits (par exemple, "penis", "sex").
  - Dans les salons NSFW, il n'y a pas de filtre, permettant des contenus adultes.

## Prérequis

- Node.js installé sur votre machine
- Un compte Discord avec les permissions pour créer un bot
- Une clé API OpenAI

## Installation

1. Clonez ce dépôt sur votre machine locale :
   ```bash
   git clone https://github.com/votre-utilisateur/discord-meme-bot.git
   cd discord-meme-bot
