from io import BytesIO
from datetime import datetime, timedelta
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.models.interaction_model import Interaction
from app.models.content_model import Content
from sqlalchemy import func

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
        ["<b>Nome:</b>", student.full_name],
        ["<b>Email:</b>", student.email],
        ["<b>Data de Nascimento:</b>", student.birth_date.strftime("%d/%m/%Y") if student.birth_date else "Não informada"],
    ]
    
    if guardian_name:
        student_data.append(["<b>Responsável:</b>", guardian_name])
    
    student_table = Table(student_data, colWidths=[2*inch, 3.5*inch])
    student_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(student_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # ===== ESTATÍSTICAS GERAIS =====
    elements.append(Paragraph("ESTATÍSTICAS GERAIS", heading_style))
    
    # Calcula estatísticas
    interactions = db.query(Interaction).filter(Interaction.user_id == student_id).all()
    
    total_time_spent = sum([i.time_spent for i in interactions if i.time_spent]) or 0
    completed_interactions = len([i for i in interactions if i.completed])
    total_interactions = len(interactions)
    
    hours = total_time_spent // 60
    minutes = total_time_spent % 60
    
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
        ["<b>Tempo Total de Estudo:</b>", f"{hours}h {minutes}min"],
        ["<b>Atividades Concluídas:</b>", f"{completed_interactions} de {total_interactions}"],
        ["<b>Taxa de Conclusão:</b>", f"{int((completed_interactions / total_interactions * 100) if total_interactions > 0 else 0)}%"],
        ["<b>Sequência Atual:</b>", f"{streak} dias consecutivos"],
    ]
    
    stats_table = Table(stats_data, colWidths=[2.5*inch, 3*inch])
    stats_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
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
    
    # Busca últimas atividades (últimas 10)
    recent_interactions = db.query(Interaction).filter(
        Interaction.user_id == student_id
    ).order_by(Interaction.created_at.desc()).limit(10).all()
    
    if recent_interactions:
        activities_data = [["<b>Atividade</b>", "<b>Status</b>", "<b>Tempo (min)</b>", "<b>Data</b>"]]
        
        for interaction in recent_interactions:
            content = db.query(Content).filter(Content.id == interaction.content_id).first()
            content_title = content.title if content else "Atividade"
            
            status = "✓ Concluída" if interaction.completed else "Em Andamento"
            time_spent = f"{interaction.time_spent}" if interaction.time_spent else "-"
            date = interaction.created_at.strftime("%d/%m/%Y")
            
            activities_data.append([
                content_title[:40] + "..." if len(content_title) > 40 else content_title,
                status,
                time_spent,
                date
            ])
        
        activities_table = Table(activities_data, colWidths=[2.5*inch, 1.5*inch, 1*inch, 1.5*inch])
        activities_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
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
            import json
            interests_list = json.loads(student.interests)
            interests_text = ", ".join(interests_list)
        except:
            interests_text = student.interests
    
    elements.append(Paragraph(f"<b>Temas de Interesse:</b> {interests_text}", normal_style))
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
    elements.append(Paragraph(f"<i>Gerado em {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}</i>", footer_style))
    
    # Constrói o PDF
    doc.build(elements)
    
    # Retorna o buffer posicionado no início
    pdf_buffer.seek(0)
    return pdf_buffer
