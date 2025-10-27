import firebase_admin
from firebase_admin import credentials, auth
import os

def initialize_firebase():
    """Inicializa o Firebase Admin SDK"""
    if not firebase_admin._apps:
        # Caminho para o arquivo de credenciais
        cred_path = os.path.join(os.path.dirname(__file__), "lumind-auth-firebase-adminsdk-fbsvc-4308e4bfa1.json")
        
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin inicializado com sucesso!")
        else:
            raise FileNotFoundError(f"Arquivo de credenciais não encontrado: {cred_path}")

def verify_firebase_token(token: str):
    """Verifica o token do Firebase e retorna os dados do usuário"""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except auth.InvalidIdTokenError:
        raise ValueError("Token inválido ou expirado")
    except Exception as e:
        raise Exception(f"Erro ao verificar token: {str(e)}")
