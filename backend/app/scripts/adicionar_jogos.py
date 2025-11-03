from app.db.database import SessionLocal
from app.models.content_model import Content
import json
from datetime import datetime

JOGOS_COMPLETOS = [
    {
        "title": "Jogo da Memória - Animais",
        "description": "Encontre os pares de animais! Exercite sua memória.",
        "type": "interactive_game",
        "image_url": "/images/memoria-animais.jpg",
        "difficulty": "Fácil",
        "duration": "10 min",
        "tags": json.dumps(["memória", "animais", "concentração"]),
        "content_data": json.dumps({
            "game_type": "memory",
            "cards": [
                "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
                "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"
            ]
        })
    },
    {
        "title": "Quiz de Matemática Básica",
        "description": "Resolva problemas matemáticos e teste seus conhecimentos!",
        "type": "interactive_game",
        "image_url": "/images/quiz-matematica.jpg",
        "difficulty": "Fácil",
        "duration": "15 min",
        "tags": json.dumps(["quiz", "matemática", "números"]),
        "content_data": json.dumps({
            "game_type": "quiz",
            "questions": [
                {
                    "question": "Quanto é 7 x 8?",
                    "options": ["54", "56", "58", "64"],
                    "correct": 1
                },
                {
                    "question": "Qual é a raiz quadrada de 144?",
                    "options": ["10", "11", "12", "13"],
                    "correct": 2
                },
                {
                    "question": "Quanto é 100 - 37?",
                    "options": ["63", "73", "67", "57"],
                    "correct": 0
                }
            ]
        })
    },
    {
        "title": "Quebra-Cabeça Numérico 15",
        "description": "Organize os números de 1 a 15 na ordem correta!",
        "type": "interactive_game",
        "image_url": "/images/puzzle-15.jpg",
        "difficulty": "Médio",
        "duration": "15 min",
        "tags": json.dumps(["puzzle", "lógica", "raciocínio"]),
        "content_data": json.dumps({
            "game_type": "puzzle"
        })
    },
    {
        "title": "Jogo da Memória - Espaço",
        "description": "Explore o universo encontrando os pares de objetos espaciais!",
        "type": "interactive_game",
        "image_url": "/images/memoria-espaco.jpg",
        "difficulty": "Médio",
        "duration": "10 min",
        "tags": json.dumps(["memória", "espaço", "planetas"]),
        "content_data": json.dumps({
            "game_type": "memory",
            "cards": [
                "🌍", "🌙", "⭐", "☀️", "🪐", "🌟", "💫", "🚀",
                "🌍", "🌙", "⭐", "☀️", "🪐", "🌟", "💫", "🚀"
            ]
        })
    },
    {
        "title": "Quiz de Geografia do Brasil",
        "description": "Teste seus conhecimentos sobre geografia brasileira!",
        "type": "interactive_game",
        "image_url": "/images/quiz-geografia.jpg",
        "difficulty": "Médio",
        "duration": "15 min",
        "tags": json.dumps(["quiz", "geografia", "brasil"]),
        "content_data": json.dumps({
            "game_type": "quiz",
            "questions": [
                {
                    "question": "Qual é a capital do Brasil?",
                    "options": ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
                    "correct": 2
                },
                {
                    "question": "Qual é o maior estado brasileiro?",
                    "options": ["Amazonas", "Pará", "Mato Grosso", "Minas Gerais"],
                    "correct": 0
                },
                {
                    "question": "Quantos estados tem o Brasil?",
                    "options": ["24", "25", "26", "27"],
                    "correct": 2
                }
            ]
        })
    }
]

def atualizar_jogos_existentes():
    """Atualiza os jogos que já existem no banco"""
    db = SessionLocal()
    
    try:
        jogos_antigos = db.query(Content).filter(
            Content.type == "interactive_game"
        ).all()
        
        if not jogos_antigos:
            print("⏭️  Nenhum jogo antigo encontrado\n")
            return
        
        print(f"\n📝 Atualizando {len(jogos_antigos)} jogos existentes:\n")
        
        for jogo in jogos_antigos:
            print(f"   Atualizando: {jogo.title}")
            
            # Atualizar com content_data apropriado
            if "DNA" in jogo.title:
                jogo.content_data = json.dumps({
                    "game_type": "quiz",
                    "questions": [
                        {
                            "question": "O que significa DNA?",
                            "options": [
                                "Ácido Desoxirribonucleico",
                                "Ácido Ribonucleico",
                                "Proteína Nuclear",
                                "Molécula Genética"
                            ],
                            "correct": 0
                        }
                    ]
                })
            elif "Desafio dos Números" in jogo.title:
                jogo.content_data = json.dumps({
                    "game_type": "quiz",
                    "questions": [
                        {
                            "question": "Quanto é 5 + 3?",
                            "options": ["6", "7", "8", "9"],
                            "correct": 2
                        }
                    ]
                })
            elif "Aventuras da Gramática" in jogo.title:
                jogo.content_data = json.dumps({
                    "game_type": "quiz",
                    "questions": [
                        {
                            "question": "Qual é o plural de 'flor'?",
                            "options": ["flores", "flors", "floreses", "flora"],
                            "correct": 0
                        }
                    ]
                })
            elif "Civilizações Antigas" in jogo.title:
                jogo.content_data = json.dumps({
                    "game_type": "memory",
                    "cards": [
                        "🏛️", "⚔️", "👑", "📜", "🗿", "🏺", "🎭", "🏰",
                        "🏛️", "⚔️", "👑", "📜", "🗿", "🏺", "🎭", "🏰"
                    ]
                })
            
            jogo.difficulty = "Médio"
            jogo.duration = "15 min"
            jogo.updated_at = datetime.now()
        
        db.commit()
        print(f"✅ {len(jogos_antigos)} jogos atualizados!\n")
        
    except Exception as e:
        print(f"❌ Erro ao atualizar: {e}\n")
        db.rollback()
    finally:
        db.close()

def adicionar_novos_jogos():
    """Adiciona novos jogos completos"""
    db = SessionLocal()
    
    try:
        contador = 0
        for jogo_data in JOGOS_COMPLETOS:
            # Verificar se já existe
            existe = db.query(Content).filter(
                Content.title == jogo_data["title"]
            ).first()
            
            if existe:
                print(f"⏭️  {jogo_data['title']} já existe")
                continue
            
            novo_jogo = Content(
                title=jogo_data["title"],
                description=jogo_data["description"],
                type=jogo_data["type"],
                image_url=jogo_data["image_url"],
                difficulty=jogo_data["difficulty"],
                duration=jogo_data["duration"],
                tags=jogo_data["tags"],
                content_data=jogo_data["content_data"],
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.add(novo_jogo)
            contador += 1
            print(f"✓ Adicionando: {jogo_data['title']}")
        
        db.commit()
        print(f"\n✅ {contador} novos jogos adicionados!\n")
        
    except Exception as e:
        print(f"❌ Erro ao adicionar: {e}\n")
        db.rollback()
    finally:
        db.close()

def listar_todos_jogos():
    """Lista todos os jogos do banco"""
    db = SessionLocal()
    
    try:
        jogos = db.query(Content).filter(
            Content.type == "interactive_game"
        ).all()
        
        print(f"\n📊 TOTAL: {len(jogos)} jogos no banco\n")
        
        for i, jogo in enumerate(jogos, 1):
            data = None
            if jogo.content_data:
                try:
                    data = json.loads(jogo.content_data)
                except:
                    pass
            
            game_type = data.get('game_type', '❌ SEM TIPO') if data else '❌ SEM content_data'
            
            print(f"{i}. {jogo.title}")
            print(f"   ID: {jogo.id} | Tipo: {game_type}")
            print()
        
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "="*70)
    print("🎮 CONFIGURANDO JOGOS EDUCATIVOS NO BANCO DE DADOS")
    print("="*70 + "\n")
    
    print("1️⃣ Atualizando jogos existentes...")
    atualizar_jogos_existentes()
    
    print("2️⃣ Adicionando novos jogos...")
    adicionar_novos_jogos()
    
    print("3️⃣ Listando todos os jogos...")
    listar_todos_jogos()
    
    print("="*70)
    print("✅ PROCESSO CONCLUÍDO!")
    print("="*70 + "\n")