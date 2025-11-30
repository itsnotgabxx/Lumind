"""
Script para atualizar as thumbnails dos conteúdos específicos
"""
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.content_model import Content

def update_content_thumbnails():
    """Atualiza as imagens dos conteúdos específicos."""
    db = SessionLocal()
    
    try:
        # Mapeamento: título do conteúdo -> nova imagem
        content_images = {
            "Frações na Prática": "images/fracoes.jpg",
            "O Ciclo da Água": "images/img_ciclo_da_agua.jpg",
            "Química na Cozinha": "images/quimica-na-cozinha.webp"
        }
        
        updated_count = 0
        
        for title, new_image in content_images.items():
            # Busca o conteúdo pelo título
            content = db.query(Content).filter(Content.title == title).first()
            
            if content:
                old_image = content.image_url
                content.image_url = new_image
                print(f"✅ Atualizado: '{title}'")
                print(f"   Antiga: {old_image}")
                print(f"   Nova: {new_image}")
                updated_count += 1
            else:
                print(f"⚠️  Conteúdo não encontrado: '{title}'")
        
        if updated_count > 0:
            db.commit()
            print(f"\n🎉 {updated_count} thumbnail(s) atualizada(s) com sucesso!")
        else:
            print("\n❌ Nenhum conteúdo foi atualizado.")
            
    except Exception as e:
        print(f"\n❌ Erro ao atualizar thumbnails: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🖼️  Atualizando thumbnails dos conteúdos...\n")
    update_content_thumbnails()
