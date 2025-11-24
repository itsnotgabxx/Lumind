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
from app.models.content_model import Content
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
        textColor=HexColor('#0D9488'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=HexColor('#0D9488'),
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
        ('TEXTCOLOR', (0, 0), (0, -1), HexColor('#0D9488')),
    ]))
    elements.append(student_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # ===== ESTATÍSTICAS GERAIS =====
    elements.append(Paragraph("ESTATÍSTICAS GERAIS", heading_style))
    
    # Calcula estatísticas baseadas nas interações do usuário
    interactions = db.query(UserInteraction).filter(UserInteraction.user_id == student_id).all()
    
    # Conta interações por tipo
    completed_count = len([i for i in interactions if i.interaction_type == 'complete'])
    view_count = len([i for i in interactions if i.interaction_type == 'view'])
    click_count = len([i for i in interactions if i.interaction_type == 'click'])
    total_interactions = len(interactions)
    
    # Calcula sequência de dias
    today = datetime.now().date()
    streak = 0
    check_date = today
    for i in range(365):
        day_interactions = [inter for inter in interactions if inter.created_at.date() == check_date]
        if day_interactions:
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break
    
    stats_data = [
        ["Interações Totais:", f"{total_interactions}"],
        ["Conteúdos Concluídos:", f"{completed_count}"],
        ["Conteúdos Visualizados:", f"{view_count}"],
        ["Sequência Atual:", f"{streak} dias consecutivos"],
    ]
    
    stats_table = Table(stats_data, colWidths=[2.5*inch, 3*inch])
    stats_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 0), (0, -1), HexColor('#0D9488')),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ROWBACKGROUNDS', (0, 0), (-1, -1), [HexColor('#F0FDFA'), white]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#D1FAE5')),
    ]))
    elements.append(stats_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # ===== ÚLTIMAS ATIVIDADES =====
    elements.append(Paragraph("ÚLTIMAS ATIVIDADES", heading_style))
    
    # Busca últimas interações (últimas 10)
    recent_interactions = db.query(UserInteraction).filter(
        UserInteraction.user_id == student_id
    ).order_by(UserInteraction.created_at.desc()).limit(10).all()
    
    if recent_interactions:
        activities_data = [["Conteúdo", "Tipo", "Data"]]
        
        for interaction in recent_interactions:
            content = db.query(Content).filter(Content.id == interaction.content_id).first()
            content_title = content.title if content else "Conteúdo"
            
            interaction_type_label = {
                'complete': '✓ Concluído',
                'view': '👁️ Visualizado',
                'click': '🖱️ Clicado',
                'error': '⚠️ Erro'
            }.get(interaction.interaction_type, interaction.interaction_type)
            
            date = interaction.created_at.strftime("%d/%m/%Y %H:%M")
            
            activities_data.append([
                content_title[:40] + "..." if len(content_title) > 40 else content_title,
                interaction_type_label,
                date
            ])
        
        activities_table = Table(activities_data, colWidths=[2.5*inch, 1.5*inch, 2*inch])
        activities_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#0D9488')),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#F0FDFA'), white]),
            ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#D1FAE5')),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
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
        ('TEXTCOLOR', (0, 0), (0, 0), HexColor('#0D9488')),
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
