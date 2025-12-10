from io import BytesIO
from datetime import datetime, timedelta
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.models.interaction_model import UserInteraction
from app.models.content_model import Content, ActivityProgress
from sqlalchemy import func
import json

def generate_student_report_pdf(db: Session, student_id: int, guardian_name: str = None) -> BytesIO:
    """
    Gera um relatório em PDF com o progresso e atividades do estudante
    """
    # Busca dados do estudante
    student = db.query(User).filter(User.id == student_id).first()
    if not student:
        raise ValueError(f"Estudante com ID {student_id} não encontrado")
    
    # Cria o BytesIO para armazenar o PDF
    pdf_buffer = BytesIO()
    
    # Configura o documento
    doc = SimpleDocTemplate(
        pdf_buffer,
        pagesize=A4,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch,
    )
    
    # Estilos
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=HexColor('#8B5CF6'),  # Roxo da plataforma
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=HexColor('#7C3AED'),  # Roxo escuro
        spaceAfter=12,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )
    
    normal_style = styles['Normal']
    normal_style.fontSize = 11
    
    # Container de elementos do PDF
    elements = []
    
    # ===== CABEÇALHO =====
    elements.append(Paragraph("RELATÓRIO DE PROGRESSO LUMIND", title_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Data do relatório
    current_date = datetime.now().strftime("%d de %B de %Y").replace("January", "Janeiro").replace("February", "Fevereiro").replace("March", "Março").replace("April", "Abril").replace("May", "Maio").replace("June", "Junho").replace("July", "Julho").replace("August", "Agosto").replace("September", "Setembro").replace("October", "Outubro").replace("November", "Novembro").replace("December", "Dezembro")
    elements.append(Paragraph(f"<b>Data do Relatório:</b> {current_date}", normal_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # ===== INFORMAÇÕES DO ESTUDANTE =====
    elements.append(Paragraph("INFORMAÇÕES DO ESTUDANTE", heading_style))
    
    student_data = [
        ["Nome:", student.full_name],
        ["Email:", student.email],
        ["Data de Nascimento:", student.birth_date.strftime("%d/%m/%Y") if student.birth_date else "Não informada"],
    ]
    
    if guardian_name:
        student_data.append(["Responsável:", guardian_name])
    
    student_table = Table(student_data, colWidths=[2*inch, 3.5*inch])
    student_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('TEXTCOLOR', (0, 0), (0, -1), HexColor('#8B5CF6')),
    ]))
    elements.append(student_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # ===== ESTATÍSTICAS GERAIS =====
    elements.append(Paragraph("ESTATÍSTICAS GERAIS", heading_style))
    
    # Calcula estatísticas baseadas em ActivityProgress (não UserInteraction)
    activities = db.query(ActivityProgress).filter(ActivityProgress.user_id == student_id).all()
    
    # Conta atividades por status
    completed_count = len([a for a in activities if a.status == 'completed'])
    in_progress_count = len([a for a in activities if a.status == 'in_progress'])
    total_activities = len(activities)
    
    # Calcula tempo total de estudo (em minutos)
    total_time_minutes = sum([a.time_spent for a in activities if a.time_spent])
    total_time_hours = total_time_minutes / 60
    
    # Pega o streak do usuário (já calculado no modelo)
    streak = student.streak_days if student.streak_days else 0
    
    stats_data = [
        ["Total de Atividades:", f"{total_activities}"],
        ["Conteúdos Concluídos:", f"{completed_count}"],
        ["Conteúdos em Progresso:", f"{in_progress_count}"],
        ["Tempo Total de Estudo:", f"{total_time_hours:.1f}h ({total_time_minutes} minutos)"],
        ["Sequência Atual:", f"{streak} dias consecutivos 🔥"],
    ]
    
    stats_table = Table(stats_data, colWidths=[2.5*inch, 3*inch])
    stats_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 0), (0, -1), HexColor('#8B5CF6')),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ROWBACKGROUNDS', (0, 0), (-1, -1), [HexColor('#F3E8FF'), white]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#E9D5FF')),
    ]))
    elements.append(stats_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # ===== ÚLTIMAS ATIVIDADES =====
    elements.append(Paragraph("ÚLTIMAS ATIVIDADES", heading_style))
    
    # Busca últimas atividades (últimas 10)
    recent_activities = db.query(ActivityProgress).filter(
        ActivityProgress.user_id == student_id
    ).order_by(ActivityProgress.updated_at.desc()).limit(10).all()
    
    if recent_activities:
        activities_data = [["Conteúdo", "Status", "Progresso", "Tempo", "Data"]]
        
        for activity in recent_activities:
            content = db.query(Content).filter(Content.id == activity.content_id).first()
            content_title = content.title if content else "Conteúdo"
            
            status_label = {
                'completed': '✓ Concluído',
                'in_progress': '⏳ Em Progresso',
                'not_started': '🆕 Não Iniciado'
            }.get(activity.status, activity.status)
            
            progress = f"{activity.progress_percentage}%" if activity.progress_percentage else "0%"
            time_spent = f"{activity.time_spent}min" if activity.time_spent else "0min"
            date = activity.updated_at.strftime("%d/%m/%Y") if activity.updated_at else "N/A"
            
            activities_data.append([
                content_title[:30] + "..." if len(content_title) > 30 else content_title,
                status_label,
                progress,
                time_spent,
                date
            ])
        
        activities_table = Table(activities_data, colWidths=[2*inch, 1.2*inch, 0.8*inch, 0.7*inch, 1.3*inch])
        activities_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (2, 0), (2, -1), 'CENTER'),
            ('ALIGN', (3, 0), (3, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#8B5CF6')),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#F3E8FF'), white]),
            ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#E9D5FF')),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
        ]))
        elements.append(activities_table)
    else:
        elements.append(Paragraph("Nenhuma atividade registrada ainda.", normal_style))
    
    elements.append(Spacer(1, 0.3*inch))
    
    # ===== INTERESSES E PREFERÊNCIAS =====
    elements.append(Paragraph("INTERESSES E PREFERÊNCIAS", heading_style))
    
    interests_text = "Não informados"
    if student.interests:
        try:
            interests_list = json.loads(student.interests)
            interests_text = ", ".join(interests_list)
        except:
            interests_text = student.interests
    
    # Criar uma tabela simples para interesses
    interests_data = [
        ["Temas de Interesse:", interests_text]
    ]
    interests_table = Table(interests_data, colWidths=[2*inch, 3.5*inch])
    interests_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, 0), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 0), (0, 0), HexColor('#8B5CF6')),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(interests_table)
    elements.append(Spacer(1, 0.2*inch))
    
    # ===== RODAPÉ =====
    elements.append(Spacer(1, 0.3*inch))
    footer_text = "Este relatório foi gerado automaticamente pela plataforma Lumind. Os dados apresentados refletem o estado atual das atividades do estudante."
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=HexColor('#999999'),
        alignment=TA_CENTER,
        spaceAfter=6,
    )
    elements.append(Paragraph(footer_text, footer_style))
    
    # Data de geração (usando estilo itálico)
    generated_date_style = ParagraphStyle(
        'GeneratedDate',
        parent=styles['Normal'],
        fontSize=8,
        textColor=HexColor('#999999'),
        alignment=TA_CENTER,
        fontName='Helvetica-Oblique'
    )
    elements.append(Paragraph(f"Gerado em {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}", generated_date_style))
    
    # Constrói o PDF
    doc.build(elements)
    
    # Retorna o buffer posicionado no início
    pdf_buffer.seek(0)
    return pdf_buffer
