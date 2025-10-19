from sqlalchemy.orm import Session
from app.db.database import SessionLocal, Base, engine
from app.models.content_model import Content
from app.models import user_model, content_model  # garante que os modelos sejam importados
import json

def create_initial_content():
    # Garante que as tabelas existam
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    
    # Verifica se já existe conteúdo
    existing_content = db.query(Content).first()
    if existing_content:
        print("Conteúdo já existe no banco de dados.")
        db.close()
        return
    
    # Conteúdo inicial baseado no frontend
    initial_content = [
        {
            "title": "Aventuras no Espaço Sideral",
            "description": "Vídeo animado sobre os planetas do nosso sistema solar.",
            "type": "video",
            "source": "https://www.youtube.com/embed/zR3Igc3Rhfg?autoplay=1&mute=1",
            "image_url": "images/espaco.jpeg",
            "tags": json.dumps(["espaço", "planetas", "astronomia", "ciência"])
        },
        {
            "title": "Dominando o Xadrez",
            "description": "Aprenda as regras e estratégias básicas do xadrez.",
            "type": "text",
            "content": """O xadrez é um jogo de estratégia entre dois jogadores. Cada jogador começa com 16 peças: um rei, uma rainha, duas torres, dois bispos, dois cavalos e oito peões.

O objetivo do jogo é dar xeque-mate no rei adversário, o que significa colocá-lo sob ataque de forma que não haja movimento legal para escapar.

Cada peça se move de uma maneira diferente. Aprender os movimentos e o valor relativo das peças é o primeiro passo para se tornar um bom jogador.

Vamos explorar os movimentos básicos e algumas táticas iniciais!""",
            "image_url": "images/xadrez.jpg",
            "tags": json.dumps(["xadrez", "estratégia", "jogos", "lógica"])
        },
        {
            "title": "Desafio dos Números",
            "description": "Jogo divertido para praticar matemática de forma lúdica.",
            "type": "interactive_game",
            "content": "Jogo interativo de matemática com desafios progressivos",
            "image_url": "images/math.png",
            "tags": json.dumps(["matemática", "números", "jogo", "educativo"])
        },
        {
            "title": "Mistérios do Oceano",
            "description": "Explore a vida marinha e descubra os segredos do fundo do mar.",
            "type": "interactive_game",
            "content": "Jogo educativo sobre vida marinha e ecossistemas aquáticos",
            "image_url": "images/oceano.jpg",
            "tags": json.dumps(["oceano", "vida marinha", "biologia", "natureza"])
        },
        {
            "title": "História do Brasil",
            "description": "Conheça os principais eventos da história do nosso país.",
            "type": "text",
            "content": """A história do Brasil é rica e fascinante, começando com os povos indígenas que habitavam estas terras há milhares de anos.

Em 1500, Pedro Álvares Cabral chegou ao Brasil, iniciando o período colonial português. Durante este período, o país foi colonizado e explorado pelos portugueses.

Em 1822, o Brasil conquistou sua independência, tornando-se um império sob o comando de Dom Pedro I.

Em 1889, o país se tornou uma república, iniciando uma nova fase de sua história política.""",
            "image_url": "images/brasil.jpg",
            "tags": json.dumps(["história", "brasil", "cultura", "educação"])
        }
    ]
    
    for content_data in initial_content:
        content = Content(**content_data)
        db.add(content)
    
    db.commit()
    print("Conteúdo inicial criado com sucesso!")
    db.close()

if __name__ == "__main__":
    create_initial_content()
