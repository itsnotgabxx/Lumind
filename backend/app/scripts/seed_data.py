from sqlalchemy.orm import Session
from app.db.database import SessionLocal, Base, engine
from app.models.content_model import Content
from app.models import user_model, content_model
import json
from datetime import datetime
import random

# Áreas do conhecimento
KNOWLEDGE_AREAS = {
    "ciencias": {
        "name": "Ciências",
        "subáreas": ["astronomia", "biologia", "física", "química"],
        "tags": ["ciência", "experimentos", "natureza", "descobertas"]
    },
    "matematica": {
        "name": "Matemática",
        "subáreas": ["aritmética", "geometria", "álgebra", "lógica"],
        "tags": ["números", "cálculos", "problemas", "raciocínio"]
    },
    "historia": {
        "name": "História",
        "subáreas": ["história do brasil", "história mundial", "geografia", "sociedade"],
        "tags": ["eventos", "civilizações", "cultura", "tempo"]
    },
    "linguagens": {
        "name": "Linguagens",
        "subáreas": ["português", "literatura", "inglês", "comunicação"],
        "tags": ["leitura", "escrita", "expressão", "idiomas"]
    }
}

def generate_learning_style_weights():
    """Gera pesos aleatórios para diferentes estilos de aprendizado."""
    styles = ["visual", "auditory", "reading", "interactive"]
    weights = [random.random() for _ in range(len(styles))]
    total = sum(weights)
    normalized = {style: weight/total for style, weight in zip(styles, weights)}
    return json.dumps(normalized)

def create_science_content():
    """Cria conteúdo para a área de Ciências."""
    return [
        {
            "title": "Aventuras no Espaço Sideral",
            "description": "Vídeo animado sobre os planetas do nosso sistema solar.",
            "type": "video",
            "source": "https://www.youtube.com/embed/zR3Igc3Rhfg",
            "image_url": "images/espaco.jpeg",
            "tags": json.dumps(["espaço", "planetas", "astronomia", "ciência"]),
            "difficulty_level": 1,
            "learning_style_weights": generate_learning_style_weights(),
            "prerequisites": json.dumps([])
        },
        {
            "title": "DNA: O Código da Vida",
            "description": "Explore a estrutura do DNA e como ele armazena informações genéticas.",
            "type": "interactive_game",
            "content": "Jogo interativo sobre a estrutura do DNA e replicação",
            "image_url": "images/dna.jpg",
            "tags": json.dumps(["biologia", "genética", "células", "ciência"]),
            "difficulty_level": 3,
            "learning_style_weights": generate_learning_style_weights(),
            "prerequisites": json.dumps([])
        },
        {
            "title": "Química na Cozinha",
            "description": "Descubra as reações químicas que acontecem durante o cozimento dos alimentos.",
            "type": "text",
            "content": """A cozinha é um verdadeiro laboratório de química! 
            Quando cozinhamos, várias reações químicas acontecem...
            [Conteúdo detalhado sobre química na culinária]""",
            "image_url": "images/quimica.jpg",
            "tags": json.dumps(["química", "culinária", "reações", "ciência"]),
            "difficulty_level": 2,
            "learning_style_weights": generate_learning_style_weights(),
            "prerequisites": json.dumps([])
        }
    ]

def create_math_content():
    """Cria conteúdo para a área de Matemática."""
    return [
        {
            "title": "Desafio dos Números",
            "description": "Jogo divertido para praticar matemática de forma lúdica.",
            "type": "interactive_game",
            "content": "Jogo interativo de matemática com desafios progressivos",
            "image_url": "images/math.png",
            "tags": json.dumps(["matemática", "números", "jogo", "educativo"]),
            "difficulty_level": 1,
            "learning_style_weights": generate_learning_style_weights(),
            "prerequisites": json.dumps([])
        },
        {
            "title": "Geometria no Cotidiano",
            "description": "Descubra como a geometria está presente em tudo ao nosso redor.",
            "type": "video",
            "source": "https://www.youtube.com/embed/example",
            "image_url": "images/geometria.jpg",
            "tags": json.dumps(["matemática", "geometria", "formas", "medidas"]),
            "difficulty_level": 2,
            "learning_style_weights": generate_learning_style_weights(),
            "prerequisites": json.dumps(["Desafio dos Números"])
        }
    ]

def create_history_content():
    """Cria conteúdo para a área de História."""
    return [
        {
            "title": "História do Brasil",
            "description": "Conheça os principais eventos da história do nosso país.",
            "type": "text",
            "content": """A história do Brasil é rica e fascinante...
            [Conteúdo detalhado sobre história do Brasil]""",
            "image_url": "images/brasil.jpg",
            "tags": json.dumps(["história", "brasil", "cultura", "educação"]),
            "difficulty_level": 2,
            "learning_style_weights": generate_learning_style_weights(),
            "prerequisites": json.dumps([])
        },
        {
            "title": "Civilizações Antigas",
            "description": "Uma viagem pelo tempo para conhecer as grandes civilizações.",
            "type": "interactive_game",
            "content": "Jogo de exploração sobre civilizações antigas",
            "image_url": "images/civilizacoes.jpg",
            "tags": json.dumps(["história", "civilizações", "cultura", "mundo"]),
            "difficulty_level": 3,
            "learning_style_weights": generate_learning_style_weights(),
            "prerequisites": json.dumps(["História do Brasil"])
        }
    ]

def create_language_content():
    """Cria conteúdo para a área de Linguagens."""
    return [
        {
            "title": "Aventuras da Gramática",
            "description": "Aprenda gramática de forma divertida e interativa.",
            "type": "interactive_game",
            "content": "Jogo educativo sobre regras gramaticais",
            "image_url": "images/gramatica.jpg",
            "tags": json.dumps(["português", "gramática", "língua", "educação"]),
            "difficulty_level": 1,
            "learning_style_weights": generate_learning_style_weights(),
            "prerequisites": json.dumps([])
        },
        {
            "title": "English for Beginners",
            "description": "Start your journey learning English with fun activities.",
            "type": "video",
            "source": "https://www.youtube.com/embed/example",
            "image_url": "images/english.jpg",
            "tags": json.dumps(["inglês", "idiomas", "aprendizado", "educação"]),
            "difficulty_level": 1,
            "learning_style_weights": generate_learning_style_weights(),
            "prerequisites": json.dumps([])
        }
    ]

def create_initial_content():
    """Função principal para criar todo o conteúdo inicial."""
    # Garante que as tabelas existam
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # Verifica se já existe conteúdo
        existing_content = db.query(Content).first()
        if existing_content:
            print("Conteúdo já existe no banco de dados.")
            return
        
        # Lista para armazenar todo o conteúdo
        all_content = []
        
        # Adiciona conteúdo de cada área
        all_content.extend(create_science_content())
        all_content.extend(create_math_content())
        all_content.extend(create_history_content())
        all_content.extend(create_language_content())
        
        # Adiciona conteúdo ao banco de dados
        for content_data in all_content:
            content = Content(**content_data)
            db.add(content)
        
        db.commit()
        print(f"Conteúdo inicial criado com sucesso! Total: {len(all_content)} itens")
        
    except Exception as e:
        print(f"Erro ao criar conteúdo: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_initial_content()
