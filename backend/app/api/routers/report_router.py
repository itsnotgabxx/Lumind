from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.report_service import generate_student_report_pdf
from app.models.user_model import User
from app.services.user_service import get_user_by_id
from datetime import datetime

router = APIRouter()

@router.get("/reports/student/{student_id}/pdf")
async def get_student_report_pdf(
    student_id: int,
    db: Session = Depends(get_db)
):
    """
    Gera e retorna um relatório em PDF do progresso do estudante
    """
    try:
        # Valida se o estudante existe
        student = get_user_by_id(db, student_id)
        if not student:
            raise HTTPException(
                status_code=404,
                detail="Estudante não encontrado"
            )
        
        if student.user_type != "student":
            raise HTTPException(
                status_code=400,
                detail="Este usuário não é um estudante"
            )
        
        # Gera o PDF
        pdf_buffer = generate_student_report_pdf(
            db,
            student_id,
            guardian_name=None  # Pode ser obtido da requisição se necessário
        )
        
        # Prepara o nome do arquivo
        student_name = student.full_name.replace(" ", "_")
        filename = f"Relatorio_{student_name}_{datetime.now().strftime('%d_%m_%Y')}.pdf"
        
        # Retorna o PDF como stream
        return StreamingResponse(
            iter([pdf_buffer.getvalue()]),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao gerar relatório: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar relatório: {str(e)}"
        )
