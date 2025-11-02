"""
Script para adicionar jogos educativos no banco de dados do Lumind
Execute este arquivo para popular o banco com jogos de exemplo
"""

# Exemplos de jogos para adicionar ao banco de dados

JOGOS_EDUCATIVOS = [
    # ==========================================
    # JOGOS CUSTOMIZADOS (Built-in)
    # ==========================================
    {
        "title": "Jogo da Memória - Animais",
        "description": "Encontre os pares de animais! Exercite sua memória enquanto aprende sobre a fauna.",
        "type": "interactive_game",
        "image_url": "https://placehold.co/400x250/10B981/FFFFFF?text=Memoria+Animais",
        "difficulty": "Fácil",
        "duration": "10 min",
        "category": "logic",
        "tags": ["memória", "animais", "concentração"],
        "content_data": {
            "game_type": "memory",
            "cards": [
                "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
                "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"
            ]
        }
    },
    {
        "title": "Jogo da Memória - Espaço",
        "description": "Explore o universo encontrando os pares de objetos espaciais!",
        "type": "interactive_game",
        "image_url": "https://placehold.co/400x250/8B5CF6/FFFFFF?text=Memoria+Espaco",
        "difficulty": "Médio",
        "duration": "10 min",
        "category": "science",
        "tags": ["memória", "espaço", "planetas"],
        "content_data": {
            "game_type": "memory",
            "cards": [
                "🌍", "🌙", "⭐", "☀️", "🪐", "🌟", "💫", "🚀",
                "🌍", "🌙", "⭐", "☀️", "🪐", "🌟", "💫", "🚀"
            ]
        }
    },
    {
        "title": "Quiz de Geografia do Brasil",
        "description": "Teste seus conhecimentos sobre geografia brasileira! Perguntas sobre capitais, estados e regiões.",
        "type": "interactive_game",
        "image_url": "https://placehold.co/400x250/3B82F6/FFFFFF?text=Quiz+Geografia",
        "difficulty": "Médio",
        "duration": "15 min",
        "category": "geography",
        "tags": ["quiz", "geografia", "brasil", "capitais"],
        "content_data": {
            "game_type": "quiz",
            "questions": [
                {
                    "question": "Qual é a capital do Brasil?",
                    "options": ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
                    "correct": 2,
                    "explanation": "Brasília foi inaugurada em 21 de abril de 1960 e é a capital federal do Brasil."
                },
                {
                    "question": "Qual é o maior estado brasileiro em área?",
                    "options": ["Amazonas", "Pará", "Mato Grosso", "Minas Gerais"],
                    "correct": 0,
                    "explanation": "O Amazonas possui 1.559.146 km², sendo o maior estado do Brasil."
                },
                {
                    "question": "Quantos estados tem o Brasil?",
                    "options": ["24", "25", "26", "27"],
                    "correct": 2,
                    "explanation": "O Brasil possui 26 estados mais o Distrito Federal."
                },
                {
                    "question": "Qual é a capital do Rio Grande do Sul?",
                    "options": ["Curitiba", "Porto Alegre", "Florianópolis", "Pelotas"],
                    "correct": 1,
                    "explanation": "Porto Alegre é a capital do estado do Rio Grande do Sul."
                },
                {
                    "question": "Em qual região fica o estado da Bahia?",
                    "options": ["Norte", "Nordeste", "Centro-Oeste", "Sudeste"],
                    "correct": 1,
                    "explanation": "A Bahia está localizada na região Nordeste do Brasil."
                }
            ]
        }
    },
    {
        "title": "Quiz de Matemática Básica",
        "description": "Resolva problemas matemáticos e teste seus conhecimentos!",
        "type": "interactive_game",
        "image_url": "https://placehold.co/400x250/F59E0B/FFFFFF?text=Quiz+Matematica",
        "difficulty": "Fácil",
        "duration": "10 min",
        "category": "math",
        "tags": ["quiz", "matemática", "números", "cálculo"],
        "content_data": {
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
                },
                {
                    "question": "Quantos lados tem um hexágono?",
                    "options": ["5", "6", "7", "8"],
                    "correct": 1
                },
                {
                    "question": "Quanto é 25% de 200?",
                    "options": ["25", "40", "50", "75"],
                    "correct": 2
                }
            ]
        }
    },
    {
        "title": "Quebra-Cabeça Numérico",
        "description": "Organize os números de 1 a 15 na ordem correta! Desafio clássico de lógica.",
        "type": "interactive_game",
        "image_url": "https://placehold.co/400x250/2DD4BF/FFFFFF?text=Puzzle+15",
        "difficulty": "Médio",
        "duration": "10-15 min",
        "category": "logic",
        "tags": ["puzzle", "lógica", "raciocínio", "números"],
        "content_data": {
            "game_type": "puzzle"
        }
    },
    
    # ==========================================
    # JOGOS EMBEDDED (Externos)
    # ==========================================
    {
        "title": "Chess.com - Xadrez contra Computador",
        "description": "Aprenda e pratique xadrez jogando contra o computador. Diversos níveis de dificuldade!",
        "type": "interactive_game",
        "image_url": "https://placehold.co/400x250/000000/FFFFFF?text=Chess",
        "difficulty": "Todos os níveis",
        "duration": "Variável",
        "category": "logic",
        "tags": ["xadrez", "estratégia", "lógica", "concentração"],
        "content_data": {
            "game_type": "embedded",
            "game_url": "https://www.chess.com/play/computer"
        }
    },
    {
        "title": "Prodigy Math - Aventura Matemática",
        "description": "RPG educativo onde você resolve problemas de matemática para avançar na aventura!",
        "type": "interactive_game",
        "image_url": "https://placehold.co/400x250/6D28D9/FFFFFF?text=Prodigy",
        "difficulty": "Adaptável",
        "duration": "20-30 min",
        "category": "math",
        "tags": ["matemática", "rpg", "aventura", "educativo"],
        "content_data": {
            "game_type": "embedded",
            "game_url": "https://play.prodigygame.com/"
        }
    },
    {
        "title": "Code.org - Minecraft Hour of Code",
        "description": "Aprenda conceitos de programação com Minecraft! Ideal para iniciantes.",
        "type": "interactive_game",
        "image_url": "https://placehold.co/400x250/00A86B/FFFFFF?text=Code.org",
        "difficulty": "Iniciante",
        "duration": "1 hora",
        "category": "programming",
        "tags": ["programação", "minecraft", "code", "lógica"],
        "content_data": {
            "game_type": "embedded",
            "game_url": "https://studio.code.org/s/mc/lessons/1/levels/1"
        }
    },
    {
        "title": "NASA Space Place - Jogos Espaciais",
        "description": "Explore o espaço com jogos educativos da NASA! Aprenda sobre planetas, estrelas e muito mais.",
        "type": "interactive_game",
        "image_url": "https://placehold.co/400x250/0B3D91/FFFFFF?text=NASA+Games",
        "difficulty": "Variável",
        "duration": "10-20 min",
        "category": "science",
        "tags": ["espaço", "ciência", "nasa", "planetas"],
        "content_data": {
            "game_type": "embedded",
            "game_url": "https://spaceplace.nasa.gov/menu/play/"
        }
    },
    {
        "title": "Seterra - Geografia Mundial",
        "description": "Teste seus conhecimentos de geografia mundial! Mapas interativos e quizzes.",
        "type": "interactive_game",
        "image_url": "https://placehold.co/400x250/059669/FFFFFF?text=Seterra",
        "difficulty": "Variável",
        "duration": "15 min",
        "category": "geography",
        "tags": ["geografia", "mapas", "países", "capitais"],
        "content_data": {
            "game_type": "embedded",
            "game_url": "https://www.seterra.com/pt"
        }
    }
]

# ==========================================
# FUNÇÃO PARA INSERIR NO BANCO
# ==========================================

def inserir_jogos_no_banco():
    """
    Adiciona os jogos ao banco de dados
    
    Uso:
        from database import SessionLocal
        from models import Content
        import json
        
        db = SessionLocal()
        
        for jogo in JOGOS_EDUCATIVOS:
            novo_conteudo = Content(
                title=jogo["title"],
                description=jogo["description"],
                type=jogo["type"],
                image_url=jogo.get("image_url"),
                difficulty=jogo.get("difficulty"),
                duration=jogo.get("duration"),
                tags=json.dumps(jogo.get("tags", [])),
                content_data=json.dumps(jogo["content_data"])
            )
            db.add(novo_conteudo)
        
        db.commit()
        print(f"✅ {len(JOGOS_EDUCATIVOS)} jogos adicionados com sucesso!")
    """
    pass

# ==========================================
# EXEMPLO DE ENDPOINT DA API
# ==========================================

"""
# Em main.py do FastAPI:

@app.get("/api/content/games")
def get_games(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Content).filter(Content.type == "interactive_game")
    
    if category:
        query = query.filter(Content.tags.contains(category))
    
    if difficulty:
        query = query.filter(Content.difficulty == difficulty)
    
    games = query.all()
    
    return [
        {
            "id": game.id,
            "title": game.title,
            "description": game.description,
            "image_url": game.image_url,
            "difficulty": game.difficulty,
            "duration": game.duration,
            "tags": json.loads(game.tags) if game.tags else [],
            "game_type": json.loads(game.content_data).get("game_type")
        }
        for game in games
    ]

@app.get("/api/content/games/{game_id}")
def get_game_details(game_id: int, db: Session = Depends(get_db)):
    game = db.query(Content).filter(
        Content.id == game_id,
        Content.type == "interactive_game"
    ).first()
    
    if not game:
        raise HTTPException(status_code=404, detail="Jogo não encontrado")
    
    return {
        "id": game.id,
        "title": game.title,
        "description": game.description,
        "image_url": game.image_url,
        "difficulty": game.difficulty,
        "duration": game.duration,
        "tags": json.loads(game.tags) if game.tags else [],
        "content_data": json.loads(game.content_data)
    }
"""

if __name__ == "__main__":
    print("=" * 50)
    print("🎮 JOGOS EDUCATIVOS PARA LUMIND")
    print("=" * 50)
    print(f"\n✅ Total de jogos definidos: {len(JOGOS_EDUCATIVOS)}")
    
    # Conta jogos por tipo
    customizados = sum(1 for j in JOGOS_EDUCATIVOS if j["content_data"]["game_type"] in ["memory", "quiz", "puzzle"])
    embedded = sum(1 for j in JOGOS_EDUCATIVOS if j["content_data"]["game_type"] == "embedded")
    
    print(f"\n📊 Estatísticas:")
    print(f"   - Jogos Customizados: {customizados}")
    print(f"   - Jogos Embedded: {embedded}")
    
    print(f"\n📚 Categorias disponíveis:")
    categorias = set()
    for jogo in JOGOS_EDUCATIVOS:
        if "category" in jogo:
            categorias.add(jogo["category"])
    for cat in sorted(categorias):
        print(f"   - {cat}")
    
    print("\n💡 Para usar:")
    print("   1. Copie este arquivo para o backend")
    print("   2. Execute a função inserir_jogos_no_banco()")
    print("   3. Os jogos estarão disponíveis na API")
    print("\n" + "=" * 50)