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
    2: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",  # Quiz Matemática
    3: "https://poppybabyco.com/cdn/shop/products/woodennumberpuzzle.png",  # Quebra-Cabeça Numérico
    4: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800",  # Jogo Memória - Espaço
    5: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800",  # Quiz Geografia Brasil
    
    # VÍDEOS
    6: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800",  # Aventuras Espaço Sideral
    7: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800",  # Química na Cozinha
    8: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",  # Ciclo da Água
    9: "https://s2.static.brasilescola.uol.com.br/be/2020/02/fracoes-com-macas.jpg",  # Frações na Prática
    10: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800",  # Geometria Cotidiano
    11: "https://i0.wp.com/blog.portaleducacao.com.br/wp-content/uploads/2022/02/184-Historia-do-Brasil-em-ordem-cronologica.jpg?fit=740%2C416&ssl=1",  # História do Brasil
    12: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800",  # Egito Antigo
    13: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",  # Pontuação
    14: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800",  # English Beginners
    
    # TEXTOS
    15: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=800",  # Buracos Negros
    16: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",  # IA no Dia a Dia
    17: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800",  # Internet das Árvores
    18: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",  # Lógica Programação
    19: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800",  # Egito Além Pirâmides
    20: "https://blog.nerduca.com/wp-content/uploads/2023/11/img-principal-1.png",  # Química Cozinha
    21: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",  # Música e Cérebro
    22: "https://i.pinimg.com/474x/e0/e7/db/e0e7db262302a66bcd33b9ff3d195463.jpg",  # Van Gogh: Cores e Emoção
    23: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",  # Corpo de Atleta
    24: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800",  # Xadrez
    25: "https://store-images.s-microsoft.com/image/apps.23536.14172887699904370.847f4e6f-3255-4018-8541-afb16a32af0c.80f6a128-d542-42b4-9b77-a55082da75aa",  # Fibonacci
    26: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",  # Dicas Inglês
    27: "https://img.odcdn.com.br/wp-content/uploads/2024/03/placa-tectonica-rachadura.jpg",  # Tectônica Placas
    28: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800",  # Jornada do Herói
    29: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800",  # Vida Fundo do Mar
    30: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",  # Fotografia Celular
    31: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800",  # Como Funcionam Vacinas
    32: "https://static.dw.com/image/53604811_804.jpg",  # Peste Negra
    33: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800",  # Morar em Marte
    
    # VÍDEOS ADICIONAIS
    34: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj4AVMfXMr-b2SAyxjPp72IcnMdTyTLKfemw&s",  # Microscópio Caseiro
    35: "https://portal.varzeapaulista.sp.gov.br/wp-content/uploads/2021/04/WhatsApp-Image-2021-04-27-at-15.48.01-1024x678.jpeg",  # História Vacinas
    36: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800",  # Tamanho Universo
    37: "https://i0.wp.com/blog.portaleducacao.com.br/wp-content/uploads/2022/02/184-Historia-do-Brasil-em-ordem-cronologica.jpg?fit=740%2C416&ssl=1",  # História Brasil Animada
    38: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",  # Hardware Computador
    39: "https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=800",  # 3 Regras Xadrez
    40: "https://mega.ibxk.com.br/2023/07/21/21155014592378.jpg",  # Mundo das Formigas
    41: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=800",  # Sistema Solar Alinhado
    42: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",  # Como Funciona Wi-Fi
    43: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800",  # Cérebro Música
    44: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",  # Criar Jogos
    
    # JOGOS INTERATIVOS
    45: "https://progression.co/images/customers/codecombat-header.jpg",  # CodeCombat
    46: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800",  # GeoGuessr
    47: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Scratch_3.0_Screen_Hello_World.png",  # Scratch MIT
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
