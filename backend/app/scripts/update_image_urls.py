"""
Script para atualizar as URLs de imagens dos conteúdos para usar URLs públicas
Executar: python -m app.scripts.update_image_urls
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.db.database import SessionLocal
from app.models.content_model import Content

db = SessionLocal()

# Mapeamento de IDs para URLs de imagens do Unsplash (ÚNICAS E COERENTES)
image_urls = {
    # JOGOS INTERATIVOS
    1: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800",  # Jogo Memória - Animais
    2: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800",  # Quiz Matemática
    3: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",  # Quebra-Cabeça Numérico
    4: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800",  # Jogo Memória - Espaço
    5: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800",  # Quiz Geografia Brasil
    
    # VÍDEOS
    6: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800",  # Aventuras Espaço Sideral
    7: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800",  # Química na Cozinha
    8: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",  # Ciclo da Água
    9: "https://images.unsplash.com/photo-1464618663641-bbdd760ae84a?w=800",  # Frações na Prática
    10: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800",  # Geometria Cotidiano
    11: "https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=800",  # História do Brasil
    12: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800",  # Egito Antigo
    13: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",  # Pontuação
    14: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800",  # English Beginners
    
    # TEXTOS
    15: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=800",  # Buracos Negros
    16: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",  # IA no Dia a Dia
    17: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800",  # Internet das Árvores
    18: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",  # Lógica Programação
    19: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800",  # Egito Além Pirâmides
    20: "https://images.unsplash.com/photo-1547638375-8c1b4ebf66e0?w=800",  # Química Cozinha
    21: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",  # Música e Cérebro
    22: "https://images.unsplash.com/photo-1578926078640-e4f6a5d14f0e?w=800",  # Van Gogh: Cores e Emoção
    23: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",  # Corpo de Atleta
    24: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800",  # Xadrez
    25: "https://images.unsplash.com/photo-1509803874385-db7c23652552?w=800",  # Fibonacci
    26: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",  # Dicas Inglês
    27: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800",  # Tectônica Placas
    28: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800",  # Jornada do Herói
    29: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800",  # Vida Fundo do Mar
    30: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",  # Fotografia Celular
    31: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800",  # Como Funcionam Vacinas
    32: "https://images.unsplash.com/photo-1580829103972-74f7e83fbb92?w=800",  # Peste Negra
    33: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800",  # Morar em Marte
    
    # VÍDEOS ADICIONAIS
    34: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800",  # Microscópio Caseiro
    35: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800",  # História Vacinas
    36: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800",  # Tamanho Universo
    37: "https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=800",  # História Brasil Animada
    38: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",  # Hardware Computador
    39: "https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=800",  # 3 Regras Xadrez
    40: "https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=800",  # Mundo das Formigas
    41: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=800",  # Sistema Solar Alinhado
    42: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",  # Como Funciona Wi-Fi
    43: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800",  # Cérebro Música
    44: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",  # Criar Jogos
    
    # JOGOS INTERATIVOS
    45: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",  # CodeCombat
    46: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800",  # GeoGuessr
    47: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800",  # Scratch MIT
    48: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=800",  # Lichess Xadrez
}

print("🔄 Atualizando URLs de imagens...\n")

updated_count = 0
for content_id, new_url in image_urls.items():
    content = db.query(Content).filter(Content.id == content_id).first()
    if content:
        old_url = content.image_url
        content.image_url = new_url
        print(f"✅ ID {content_id}: {content.title}")
        print(f"   Antiga: {old_url}")
        print(f"   Nova: {new_url}\n")
        updated_count += 1
    else:
        print(f"⚠️  Conteúdo ID {content_id} não encontrado\n")

db.commit()
print(f"\n{'='*70}")
print(f"✅ {updated_count} conteúdos atualizados com sucesso!")
print(f"{'='*70}")

db.close()
