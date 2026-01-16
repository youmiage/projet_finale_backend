#!/bin/bash

# Script de maintenance de la base de données
echo "🔧 Démarrage de la maintenance de la base de données..."

# 1. Analyse de la base de données
echo "📊 1. Analyse de la base de données..."
node analyze-db.js

echo ""
echo "🧹 2. Nettoyage des enregistrements orphelins..."
node cleanup-orphaned.js

echo ""
echo "✅ 3. Validation du nettoyage..."
node validate-cleanup.js

echo ""
echo "🎯 Maintenance terminée !"
echo "💡 Exécutez ce script régulièrement pour maintenir une base de données propre"
