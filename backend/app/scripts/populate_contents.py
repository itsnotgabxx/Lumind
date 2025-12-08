"""
Script para popular o banco de dados com conteúdos educacionais
Executar: python -m app.scripts.populate_contents
"""
import sys
import os

# Adiciona o diretório pai ao path para importar app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.db.database import SessionLocal
from app.models.content_model import Content
import json

db = SessionLocal()

# Lista de conteúdos com URLs VERIFICADAS E FUNCIONAIS
contents = [
    # ==============================================================================
    # 1. CONTEÚDOS TIPO "TEXT" (20 ITENS)
    # ==============================================================================
    {
        "title": "Buracos Negros: Os Monstros do Universo",
        "description": "Entenda o que são esses objetos misteriosos onde a gravidade é infinita.",
        "type": "text",
        "content": """Você já imaginou um lugar no espaço onde a gravidade é tão forte que nada consegue escapar dela? Nem mesmo a luz! Esses são os **Buracos Negros**.

⚫ **O Horizonte de Eventos**: Pense nisso como a "borda". Se você cruzar essa linha, jamais voltará. É como cair em uma cachoeira onde a água desce mais rápido do que você consegue nadar.

🌟 **Espaguetificação**: Se você chegasse muito perto de um buraco negro, a gravidade nos seus pés seria muito mais forte do que na sua cabeça. Seu corpo seria esticado como um fio de macarrão!

🕰️ **Distorção do Tempo**: Perto de um buraco negro, o tempo passa mais devagar. Uma hora lá poderia significar anos na Terra.

🔭 **Como os vemos?**: Eles são invisíveis, mas vemos o brilho do gás e da poeira que giram ao redor deles antes de serem engolidos.

🌌 **Tipos de Buracos Negros**: Existem buracos negros pequenos (formados por estrelas) e supermassivos (milhões de vezes maiores que o Sol) no centro das galáxias.

Estudar buracos negros nos ajuda a entender o próprio tecido do espaço-tempo e os limites da física como conhecemos!""",
        "image_url": "images/buraco-negro.webp",
        "tags": json.dumps(["espaço", "astronomia", "física"]),
        "difficulty": "Difícil",
        "duration": "15 min",
        "content_data": None
    },
    {
        "title": "Inteligência Artificial no Dia a Dia",
        "description": "Como o YouTube e o Instagram sabem do que você gosta?",
        "type": "text",
        "content": """A **Inteligência Artificial (IA)** não é apenas robôs de filmes. Ela está no seu bolso agora mesmo!

🧠 **Aprendizado de Máquina**: A IA aprende como uma criança. Se você mostrar milhões de fotos de gatos para um computador, ele "aprende" o que é um gato procurando padrões.

📱 **Recomendação**: Sabe quando o TikTok te mostra exatamente o vídeo que você queria ver? Isso é uma IA analisando tudo o que você curtiu antes para prever seu gosto.

🚗 **Carros Autônomos**: Carros que dirigem sozinhos usam câmeras e sensores para "ver" a rua e tomar decisões em milissegundos, mais rápido que um humano.

🎨 **IA Criativa**: Hoje existem IAs que pintam quadros, escrevem músicas e até roteiros de filmes. Elas aprendem analisando milhares de obras humanas.

⚖️ **Ética da IA**: Com tanto poder, surgem questões: a IA pode ser preconceituosa? Quem é responsável se um carro autônomo causa um acidente?

O futuro será repleto de IAs trabalhando conosco, não contra nós. É importante entender como elas funcionam!""",
        "image_url": "images/inteligencia-artificial.webp",
        "tags": json.dumps(["tecnologia", "inovação", "futuro"]),
        "difficulty": "Médio",
        "duration": "12 min",
        "content_data": None
    },
    {
        "title": "A Internet das Árvores",
        "description": "Descubra como as árvores conversam entre si pelo subsolo.",
        "type": "text",
        "content": """As árvores parecem solitárias, mas no subsolo existe uma rede enorme chamada **Wood Wide Web**.

🍄 **Fungos Amigos**: As raízes das árvores se conectam através de fungos. As árvores dão açúcar para os fungos e os fungos trazem água e nutrientes para as árvores.

🆘 **Sinais de Perigo**: Se uma árvore é atacada por insetos, ela avisa as vizinhas pela rede subterrânea! As vizinhas então produzem substâncias químicas para se proteger antes do ataque chegar.

👵 **Árvores-Mãe**: As árvores mais velhas e grandes ajudam as mais novas, enviando nutrientes extra para as mudas que estão crescendo na sombra.

🌳 **Cooperação**: Em vez de competir, as árvores da floresta trabalham juntas para manter toda a comunidade saudável.

🔬 **Descoberta Recente**: Cientistas descobriram isso usando isótopos radioativos para rastrear o movimento de nutrientes entre árvores!

A natureza é muito mais conectada e inteligente do que imaginávamos!""",
        "image_url": "images/floresta-conexao.webp",
        "tags": json.dumps(["natureza", "biologia", "meio ambiente"]),
        "difficulty": "Fácil",
        "duration": "10 min",
        "content_data": None
    },
    {
        "title": "Lógica de Programação: O Básico",
        "description": "Aprenda a pensar como um computador sem digitar código.",
        "type": "text",
        "content": """Programar é a arte de dar ordens para uma máquina que obedece tudo ao pé da letra.

🥪 **Algoritmo**: É uma receita. Para fazer um sanduíche, você precisa seguir passos exatos: pegar pão, passar manteiga, adicionar recheio, fechar. Se inverter a ordem, dá errado!

🔄 **Loops (Repetição)**: Em vez de dizer "lave o prato 1, lave o prato 2, lave o prato 3...", na programação dizemos: "Enquanto houver pratos sujos, continue lavando".

🔀 **Condicionais (Se...)**: "SE estiver chovendo, leve guarda-chuva. SENÃO, vá de boné". Jogos são feitos de milhares dessas pequenas decisões.

📦 **Variáveis**: São caixas onde guardamos informações. Exemplo: pontos = 100. Quando você pega uma moeda no jogo: pontos = pontos + 10.

🐛 **Debugging**: Até programadores profissionais cometem erros (bugs). Metade do tempo é gasto procurando por que o código não funciona!

A programação ensina você a quebrar problemas grandes em pedaços pequenos e resolver um de cada vez.""",
        "image_url": "images/programacao-logica.webp",
        "tags": json.dumps(["programação", "lógica", "tecnologia"]),
        "difficulty": "Médio",
        "duration": "15 min",
        "content_data": None
    },
    {
        "title": "Egito Antigo: Além das Pirâmides",
        "description": "Como viviam os egípcios há 3000 anos atrás?",
        "type": "text",
        "content": """O Egito Antigo foi uma das civilizações mais incríveis da história, durando mais de 3000 anos!

🌊 **O Rio Nilo**: Tudo dependia do rio. Quando ele enchia anualmente, deixava a terra fértil para plantar. Os egípcios amavam tanto o rio que criaram um calendário baseado nas cheias.

🐱 **Gatos Sagrados**: Os gatos eram adorados porque caçavam ratos (que comiam o grão armazenado) e cobras venenosas. Machucar um gato era considerado um crime gravíssimo!

💄 **Maquiagem para Todos**: Homens e mulheres usavam maquiagem preta ao redor dos olhos. Além de bonito, a tinta protegia contra o sol forte e afastava insetos.

📜 **Hieróglifos**: A escrita egípcia usava mais de 700 símbolos diferentes. Só escribas treinados por anos sabiam ler e escrever.

⚰️ **Mumificação**: Eles acreditavam em vida após a morte, por isso preservavam os corpos. O processo levava 70 dias!

O Egito nos deixou um legado incrível em matemática, medicina e arquitetura que influencia o mundo até hoje.""",
        "image_url": "images/egito-antigo.webp",
        "tags": json.dumps(["história", "civilizações", "cultura"]),
        "difficulty": "Médio",
        "duration": "18 min",
        "content_data": None
    },
    {
        "title": "A Química na Cozinha",
        "description": "Por que o bolo cresce e o ovo endurece?",
        "type": "text",
        "content": """Sua cozinha é um laboratório de química onde reações fascinantes acontecem todos os dias!

🍞 **O Fermento Mágico**: O fermento químico (bicarbonato de sódio) solta gás carbônico (CO2) quando esquenta. Essas milhões de bolhas de gás ficam presas na massa e fazem o bolo crescer e ficar fofinho.

🥚 **Transformação do Ovo**: O ovo líquido tem proteínas enroladas como novelos de lã. O calor "desenrola" essas proteínas e as faz grudar umas nas outras, criando uma estrutura sólida.

🔥 **Reação de Maillard**: É o que deixa a carne e o pão douradinhos e deliciosos quando assam. É uma reação complexa entre aminoácidos (das proteínas) e açúcares quando aquecidos acima de 140°C.

🧂 **Sal e Ponto de Ebulição**: Adicionar sal na água faz ela ferver em temperatura ligeiramente maior, cozinhando o macarrão mais rápido!

🍦 **Sorvete e Congelamento**: O sal abaixa o ponto de congelamento, por isso usamos sal e gelo para fazer sorvete caseiro.

Entender a química torna você um cozinheiro melhor e explica por que certas receitas funcionam!""",
        "image_url": "images/quimica-cozinha.webp",
        "tags": json.dumps(["ciência", "culinária", "química"]),
        "difficulty": "Fácil",
        "duration": "10 min",
        "content_data": None
    },
    {
        "title": "Música e o Cérebro",
        "description": "Por que sentimos vontade de dançar?",
        "type": "text",
        "content": """A música ativa quase todo o seu cérebro ao mesmo tempo, mais do que qualquer outra atividade!

🧠 **Recompensa e Prazer**: Ouvir música libera dopamina, o mesmo neurotransmissor liberado quando comemos chocolate ou ganhamos um presente. Por isso música "vicia"!

🥁 **Ritmo Automático**: Nosso cérebro tenta prever a próxima batida da música. Quando acerta, sentimos prazer. Por isso nosso pé bate sozinho no ritmo!

📚 **Memória Musical**: Você consegue lembrar letras de músicas de anos atrás, mas esquece o que estudou ontem. Isso acontece porque música ativa múltiplas áreas do cérebro simultaneamente.

🎵 **Música e Estudo**: Estudos mostram que música clássica ou instrumental pode melhorar concentração e retenção de informação. Mas música com letra pode atrapalhar!

🧩 **Aprender Instrumento**: Tocar um instrumento cria novas conexões neurais e melhora habilidades matemáticas e linguísticas.

A música é uma das ferramentas mais poderosas para treinar e modificar o cérebro!""",
        "image_url": "images/musica-cerebro.webp",
        "tags": json.dumps(["música", "neurociência", "arte"]),
        "difficulty": "Médio",
        "duration": "12 min",
        "content_data": None
    },
    {
        "title": "Van Gogh: Cores e Emoção",
        "description": "A história do pintor que via o mundo de forma diferente.",
        "type": "text",
        "content": """Vincent van Gogh não pintava as coisas como uma foto. Ele pintava como ele **sentia** o mundo.

🌻 **Obsessão pelo Amarelo**: Era a cor favorita dele, representando felicidade, amizade e o sol do sul da França. A série "Os Girassóis" é um dos trabalhos mais famosos.

🌌 **Noite Estrelada**: As curvas dramáticas no céu mostram a turbulência emocional de Van Gogh. Ele pintou de memória enquanto estava internado.

🎨 **Técnica Empasto**: Ele usava camadas grossas de tinta, aplicando com espátula. Você consegue ver as pinceladas mesmo em reproduções!

😢 **Vida Difícil**: Sofreu de problemas mentais, foi rejeitado pela sociedade artística e vendeu apenas UM quadro em vida. Achava que era um fracasso.

💔 **Relacionamentos**: Teve um relacionamento difícil com o pintor Gauguin que terminou no famoso incidente onde cortou a própria orelha.

✨ **Legado Póstumo**: Morreu aos 37 anos sem reconhecimento. Hoje suas obras valem milhões e inspiram artistas do mundo todo.

Van Gogh nos ensina que arte verdadeira vem do coração, não da perfeição técnica.""",
        "image_url": "images/van-gogh.webp",
        "tags": json.dumps(["arte", "história da arte", "biografia"]),
        "difficulty": "Médio",
        "duration": "15 min",
        "content_data": None
    },
    {
        "title": "O Corpo de um Atleta",
        "description": "Como a ciência cria medalhistas olímpicos.",
        "type": "text",
        "content": """Ser um campeão olímpico exige muito mais que talento natural. Exige ciência, tecnologia e dedicação extrema!

🧬 **Genética Vantajosa**: Nadadores costumam ter braços mais longos e pés maiores (nadadeiras naturais!). Corredores de velocidade têm mais fibras musculares de contração rápida.

🧠 **Mente de Aço**: Atletas treinam o cérebro para aguentar pressão intensa e ignorar sinais de dor. Eles praticam visualização: imaginam a vitória em detalhes antes de competir.

💤 **Sono Sagrado**: O músculo não cresce durante o treino, ele cresce durante o sono profundo! Atletas de elite dormem 9-10 horas por dia.

🍽️ **Nutrição Precisa**: Cada atleta tem um nutricionista calculando exatamente quantas calorias, proteínas e carboidratos precisa por dia.

📊 **Tecnologia**: Sensores medem batimentos, oxigenação do sangue, força aplicada. Tudo é otimizado através de dados.

🧘 **Recuperação**: Massagens, crioterapia (banho de gelo), alongamento e yoga são tão importantes quanto o treino.

Por trás de cada medalha há anos de ciência aplicada e sacrifício.""",
        "image_url": "images/atleta-ciencia.webp",
        "tags": json.dumps(["esportes", "biologia", "saúde"]),
        "difficulty": "Fácil",
        "duration": "12 min",
        "content_data": None
    },
    {
        "title": "Xadrez: Ginástica para o Cérebro",
        "description": "Estratégia, tática e paciência no tabuleiro.",
        "type": "text",
        "content": """O Xadrez é chamado de "esporte da mente" porque treina raciocínio, paciência e planejamento.

👑 **Objetivo Simples, Execução Complexa**: O objetivo é dar xeque-mate no Rei adversário. Mas existem trilhões de combinações possíveis de jogadas!

🧠 **Pensamento Antecipado**: Jogadores iniciantes pensam na próxima jogada. Intermediários pensam 3 jogadas à frente. Mestres conseguem visualizar sequências de 10+ jogadas!

⚡ **Padrões e Táticas**: Existem "truques" famosos como o garfo (atacar duas peças ao mesmo tempo) e espeto (forçar uma peça a sair revelando outra atrás).

🤖 **Humanos vs Máquinas**: Desde 1997, computadores jogam melhor que qualquer humano. Mas isso não diminui o valor de aprender xadrez!

🏆 **Benefícios Comprovados**: Estudos mostram que xadrez melhora concentração, memória, criatividade e até notas na escola.

📚 **Nunca Para de Ensinar**: Mesmo grandes mestres continuam aprendendo padrões novos após décadas jogando.

O xadrez é um jogo onde a melhor "arma" é seu cérebro bem treinado!""",
        "image_url": "images/xadrez-estrategia.webp",
        "tags": json.dumps(["xadrez", "estratégia", "jogos"]),
        "difficulty": "Médio",
        "duration": "15 min",
        "content_data": None
    },
    {
        "title": "Fibonacci: O Código da Natureza",
        "description": "A matemática escondida nas flores e conchas.",
        "type": "text",
        "content": """Existe uma sequência matemática que aparece misteriosamente por toda a natureza: **1, 1, 2, 3, 5, 8, 13, 21, 34, 55...**

🔢 **A Regra**: Cada número é a soma dos dois anteriores. Simples, mas poderoso!

🌻 **Pétalas de Flores**: Conte as pétalas de flores que você encontrar. A maioria terá 3, 5, 8, 13 ou 21 pétalas (números de Fibonacci)!

🐚 **Espirais Perfeitas**: Conchas do mar, girassóis, galáxias... todos crescem em espirais que seguem a proporção de Fibonacci.

🍍 **Abacaxi e Pinha**: Os gomos formam espirais. Se contar, você encontrará números de Fibonacci nas espirais que vão para direita e para esquerda!

📐 **Proporção Áurea**: Dividindo um número de Fibonacci pelo anterior, você chega cada vez mais perto de 1,618... a "proporção divina" usada em arte e arquitetura.

🎨 **Na Arte**: Leonardo da Vinci, Dalí e outros artistas usaram Fibonacci conscientemente em suas obras.

Isso mostra que a matemática não é algo inventado por humanos - ela é a linguagem que o universo usa para se construir!""",
        "image_url": "images/fibonacci-natureza.webp",
        "tags": json.dumps(["matemática", "natureza", "curiosidades"]),
        "difficulty": "Difícil",
        "duration": "14 min",
        "content_data": None
    },
    {
        "title": "Dicas para Aprender Inglês",
        "description": "Como poliglotas aprendem idiomas tão rápido?",
        "type": "text",
        "content": """Você não precisa ter um "dom" especial para falar inglês fluentemente. Precisa das técnicas certas!

👶 **Imersão Total**: Mude o idioma do celular, redes sociais e jogos para inglês. Assista filmes e séries com áudio original (pode usar legenda em inglês no começo).

🗣️ **Fale Errado e Aprenda**: O medo de errar é seu maior inimigo. Bebês falam errado por anos antes de falar certo! Tente falar sozinho, narrar seu dia em voz alta.

📝 **Consistência > Intensidade**: Estudar 15 minutos TODO DIA é infinitamente melhor que estudar 5 horas uma vez por semana. Seu cérebro precisa de repetição espaçada.

🎵 **Música e Letras**: Escolha músicas que você gosta e leia a letra enquanto ouve. Cante junto! É divertido e eficaz.

📱 **Apps de Conversação**: Use apps como Tandem ou HelloTalk para conversar com nativos que querem aprender português. É uma troca!

📚 **Leia Simples Primeiro**: Comece com livros infantis ou quadrinhos em inglês. Não pule para Shakespeare!

🎯 **Foco no Útil**: Aprenda primeiro o vocabulário que você VAI usar (redes sociais, jogos, séries). Deixe vocabulário formal para depois.

A chave é transformar inglês em parte da sua rotina, não uma "matéria chata".""",
        "image_url": "images/ingles-dicas.webp",
        "tags": json.dumps(["idiomas", "inglês", "estudos"]),
        "difficulty": "Fácil",
        "duration": "10 min",
        "content_data": None
    },
    {
        "title": "Tectônica de Placas: A Terra em Movimento",
        "description": "Por que a terra treme e os vulcões explodem?",
        "type": "text",
        "content": """O chão sob seus pés parece sólido, mas na verdade estamos em jangadas gigantes de pedra que flutuam e se movem!

🧩 **Continentes que Encaixam**: Se você juntar a América do Sul e a África, elas se encaixam perfeitamente! Há 200 milhões de anos eram um único supercontinente chamado Pangeia.

🌍 **Placas Tectônicas**: A crosta terrestre está quebrada em cerca de 15 placas gigantes que deslizam sobre o manto derretido abaixo.

🌋 **Nascimento de Vulcões**: Quando duas placas colidem, uma pode afundar sob a outra. A rocha derrete e sobe como lava. É assim que nascem vulcões!

💥 **Terremotos**: Quando placas raspam uma na outra lateralmente, a tensão acumulada é liberada de repente, fazendo a terra tremer violentamente.

🇧🇷 **Por que o Brasil é Calmo?**: Estamos bem no meio da Placa Sul-Americana, longe das bordas onde acontecem terremotos e erupções.

🗻 **Montanhas Crescendo**: O Himalaia (onde fica o Everest) ainda está crescendo! A Índia continua colidindo com a Ásia a 5cm por ano.

Nosso planeta é um organismo vivo em constante transformação!""",
        "image_url": "images/tectonica-placas.webp",
        "tags": json.dumps(["geografia", "ciência", "terra"]),
        "difficulty": "Médio",
        "duration": "15 min",
        "content_data": None
    },
    {
        "title": "A Jornada do Herói: O Roteiro Universal",
        "description": "O segredo de Harry Potter, Star Wars e Rei Leão.",
        "type": "text",
        "content": """Quase todas as histórias épicas da humanidade seguem o mesmo roteiro de 12 etapas chamado **Jornada do Herói**.

🏠 **Mundo Comum**: O herói vive uma vida normal e entediante (Harry Potter morando embaixo da escada, Luke na fazenda).

📞 **O Chamado**: Algo acontece que muda tudo (carta de Hogwarts, holograma da Princesa Leia).

🙅 **Recusa do Chamado**: O herói tem medo e tenta negar o destino.

🧙 **Encontro com o Mentor**: Aparece um sábio para ensinar e dar confiança (Dumbledore, Obi-Wan, Rafiki).

🚪 **Cruzando o Limiar**: O herói deixa o mundo conhecido e entra na aventura (plataforma 9¾, saindo de Tatooine).

🐉 **Provações e Aliados**: Ele enfrenta desafios, faz amigos e inimigos.

💀 **Provação Suprema**: O herói enfrenta a morte ou seu maior medo e quase perde.

🏆 **Recompensa**: Ele descobre uma força interior ou poder novo.

🔙 **O Retorno**: Ele volta para casa transformado e mais maduro.

📖 **Exemplos Infinitos**: Matrix, Moana, Senhor dos Anéis, Homem-Aranha... todos usam essa estrutura!

Conhecer isso te torna um leitor (e escritor) muito melhor!""",
        "image_url": "images/jornada-heroi.webp",
        "tags": json.dumps(["literatura", "escrita", "cinema"]),
        "difficulty": "Médio",
        "duration": "12 min",
        "content_data": None
    },
    {
        "title": "Vida no Fundo do Mar: Zona Abissal",
        "description": "Monstros que brilham na escuridão total.",
        "type": "text",
        "content": """A mais de 1000 metros de profundidade existe um mundo alienígena, escuro e misterioso onde vivem criaturas bizarras.

🌑 **Escuridão Total**: A luz do sol não chega. É completamente escuro, frio (2°C) e a pressão esmagaria um humano instantaneamente.

💡 **Bioluminescência Mágica**: Muitos animais produzem a própria luz química! Alguns usam para atrair parceiros, outros para hipnotizar presas.

🦷 **Adaptações Extremas**: Peixes têm bocas gigantes e dentes pontiagudos como agulhas. Quando a comida é rara, você precisa garantir que nada escape!

🎣 **Peixe-Pescador Abissal**: A fêmea tem uma "lanterna" brilhante pendurada na cabeça para atrair comida. O macho é minúsculo e gruda na fêmea, virando parte dela!

🦑 **Lulas Gigantes**: Elas existem! Podem ter 13 metros de comprimento. Só recentemente conseguimos filmá-las.

🔬 **Descobertas Recentes**: Conhecemos apenas 5% do fundo do oceano. Centenas de espécies novas são descobertas todo ano!

🐙 **Vida Sem Sol**: Perto de fontes hidrotermais (vulcões submarinos), bactérias criam energia de químicos em vez de luz. É um ecossistema completamente independente do sol!

O oceano profundo é o lugar menos explorado da Terra - mais misterioso que o espaço!""",
        "image_url": "images/fundo-mar.webp",
        "tags": json.dumps(["animais", "biologia", "oceano"]),
        "difficulty": "Médio",
        "duration": "15 min",
        "content_data": None
    },
    {
        "title": "Fotografe Melhor com o Celular",
        "description": "Dicas simples para fotos dignas de Instagram.",
        "type": "text",
        "content": """Você não precisa de câmera cara para tirar fotos incríveis. Só precisa conhecer alguns truques!

☀️ **Golden Hour é Ouro**: A melhor luz natural é 1 hora depois do nascer do sol e 1 hora antes do pôr do sol. A luz é suave, dourada e mágica. Evite sol do meio-dia que cria sombras duras e feias.

📏 **Regra dos Terços**: Ative a grade na câmera do celular. Em vez de colocar o assunto no centro, coloque nas interseções das linhas. Fica muito mais interessante!

👁️ **Olhe o Fundo**: Antes de tirar a foto, olhe o que tem atrás do seu assunto. Um poste saindo da cabeça da pessoa estraga tudo!

📐 **Linhas Guia**: Use ruas, cercas, prédios para criar linhas que guiam o olhar até o assunto principal.

🧼 **Limpe a Lente**: Parece bobo, mas gordura do dedo deixa a foto embaçada. Limpe sempre!

📸 **Tire Muitas Fotos**: Fotógrafos profissionais tiram centenas de fotos e escolhem as 10 melhores. Não espere acertar na primeira!

🎨 **Edição Simples**: Apps gratuitos como Snapseed ou VSCO podem melhorar muito suas fotos. Ajuste brilho, contraste e saturação.

🌟 **Modo Retrato**: Use para fotos de pessoas. Borra o fundo e deixa o rosto em foco, igual câmeras profissionais.

A fotografia é sobre capturar emoções e momentos, não equipamento caro!""",
        "image_url": "images/fotografia-celular.webp",
        "tags": json.dumps(["fotografia", "arte", "tecnologia"]),
        "difficulty": "Fácil",
        "duration": "10 min",
        "content_data": None
    },
    {
        "title": "Como Funcionam as Vacinas?",
        "description": "Ensinando seu exército interno a lutar.",
        "type": "text",
        "content": """A vacina é como um simulador de batalha para o exército de defesa do seu corpo.

🛡️ **Sistema Imunológico**: Você tem bilhões de células especializadas patrulhando seu corpo 24/7 procurando invasores (vírus, bactérias).

🎭 **O Treinamento**: A vacina mostra uma "foto" do inimigo para seus soldados. Pode ser o vírus morto, enfraquecido ou apenas um pedaço dele (como a "armadura" do vírus).

📝 **Células de Memória**: Depois do "treino", algumas células guardam a informação do inimigo por anos ou até pela vida toda!

⚡ **Resposta Rápida**: Se o vírus real aparecer, seu corpo já sabe exatamente como destruí-lo. Antes que você fique doente, o inimigo já foi eliminado.

💉 **Tipos de Vacina**: Existem vacinas de vírus morto, vírus atenuado (enfraquecido), de pedaços do vírus, e até de mRNA (as mais modernas).

🌍 **Imunidade de Rebanho**: Quando muitas pessoas estão vacinadas, até quem não pode tomar vacina fica protegido porque o vírus não consegue se espalhar.

🏆 **Sucesso Histórico**: Vacinas erradicaram a varíola (que matava milhões) e quase eliminaram a pólio do planeta.

Vacinas são uma das maiores conquistas da ciência médica!""",
        "image_url": "images/vacinas-ciencia.webp",
        "tags": json.dumps(["ciência", "saúde", "biologia"]),
        "difficulty": "Médio",
        "duration": "10 min",
        "content_data": None
    },
    {
        "title": "A Peste Negra: A Pandemia Medieval",
        "description": "Quando a Europa perdeu 1/3 da sua população.",
        "type": "text",
        "content": """Entre 1347 e 1353, uma doença misteriosa matou cerca de 75-200 milhões de pessoas na Europa, Ásia e Norte da África.

🐀 **O Culpado Invisível**: Ninguém sabia na época, mas eram pulgas de ratos que carregavam a bactéria *Yersinia pestis*. A falta de higiene nas cidades medievais criou o ambiente perfeito.

☠️ **Sintomas Terríveis**: Manchas pretas na pele (por isso "peste negra"), febre altíssima, bubões (inchaços dolorosos). A pessoa morria em poucos dias.

👨‍⚕️ **Médicos da Peste**: Usavam máscaras com bico de pássaro cheio de ervas aromáticas, achando que a doença vinha do "ar ruim". Não funcionava, mas a máscara se tornou símbolo da peste.

🙏 **Flagelantes**: Grupos percorriam cidades se chicoteando, achando que era castigo divino. Isso só espalhou mais a doença.

💰 **Mudança Social**: Com tanta gente morta, faltou mão de obra. Camponeses sobreviventes puderam exigir melhores salários e condições, enfraquecendo o sistema feudal.

🏛️ **Impacto Cultural**: A arte ficou mais sombria. Surgiu a dança macabra (esqueletos dançando) representando que a morte leva todos.

🔬 **Descoberta Tardia**: Só em 1894 descobriram a bactéria responsável. Hoje é tratável com antibióticos.

A Peste Negra mudou completamente a sociedade europeia e ajudou a iniciar o Renascimento.""",
        "image_url": "images/peste-negra.webp",
        "tags": json.dumps(["história", "idade média", "saúde"]),
        "difficulty": "Difícil",
        "duration": "15 min",
        "content_data": None
    },
    {
        "title": "Morar em Marte: Missão (Im)Possível?",
        "description": "Os desafios do Planeta Vermelho.",
        "type": "text",
        "content": """Marte é o planeta mais "parecido" com a Terra no sistema solar, mas lá seria extremamente perigoso!

🌡️ **Frio Mortal**: A temperatura média é -60°C. Pode chegar a -140°C no inverno! Você precisaria de aquecimento 24/7.

💨 **Ar Irrespirável**: A atmosfera é 95% CO2 (gás carbônico). Sem capacete, você desmaiaria em 15 segundos e morreria em minutos.

☢️ **Radiação Intensa**: Marte não tem campo magnético nem camada de ozônio para bloquear radiação solar e cósmica. Viver na superfície causaria câncer rapidamente.

⚖️ **Gravidade Baixa**: Apenas 38% da gravidade da Terra. Seus músculos e ossos enfraqu eceriam com o tempo.

💧 **Água Escassa**: Existe água congelada nos polos e subsolo, mas precisaria ser extraída e purificada.

🏠 **Casas Subterrâneas**: Para sobreviver, teríamos que viver em habitats fechados, provavelmente enterrados para proteção contra radiação.

🌱 **Cultivar Comida**: Seria possível em estufas especiais com solo marciano tratado. No filme "Perdido em Marte" isso é retratado.

🚀 **Viagem de 7 Meses**: Só podemos ir a Marte quando os planetas estão alinhados, a cada 2 anos. É uma viagem sem volta por muito tempo.

Apesar dos desafios, Elon Musk e a SpaceX planejam mandar humanos para Marte na década de 2030!""",
        "image_url": "images/marte-colonizacao.webp",
        "tags": json.dumps(["espaço", "futuro", "astronomia"]),
        "difficulty": "Médio",
        "duration": "15 min",
        "content_data": None
    },

    # ==============================================================================
    # 2. CONTEÚDOS TIPO "VIDEO" (7 ITENS)
    # ==============================================================================
    {
        "title": "Microscópio Caseiro a Laser",
        "description": "Veja microrganismos projetados na parede com um laser e uma seringa.",
        "type": "video",
        "content": None,
        "source": "https://www.youtube.com/watch?v=7HAdiWkltvA",
        "image_url": "images/microscopio-laser.webp",
        "tags": json.dumps(["ciência", "experimento", "biologia"]),
        "difficulty": "Médio",
        "duration": "10 min",
        "content_data": None
    },
    {
        "title": "História das Vacinas",
        "description": "Entenda como surgiram as vacinas e por que elas são importantes.",
        "type": "video",
        "content": None,
        "source": "https://www.youtube.com/watch?v=ENttrlq3zmg",
        "image_url": "images/historia-vacinas.webp",
        "tags": json.dumps(["ciência", "história", "saúde"]),
        "difficulty": "Médio",
        "duration": "8 min",
        "content_data": None
    },
    {
        "title": "Qual o Tamanho do Universo?",
        "description": "Uma viagem do átomo até as maiores galáxias conhecidas.",
        "type": "video",
        "content": None,
        "source": "https://www.youtube.com/watch?v=BAo1h2115tU",
        "image_url": "images/tamanho-universo.webp",
        "tags": json.dumps(["espaço", "física", "astronomia"]),
        "difficulty": "Fácil",
        "duration": "12 min",
        "content_data": None
    },
    {
        "title": "A História do Brasil Animada",
        "description": "O resumo mais divertido da história do nosso país.",
        "type": "video",
        "content": None,
        "source": "https://www.youtube.com/watch?v=fq2CtqUXZeI",
        "image_url": "images/historia-brasil-animada.webp",
        "tags": json.dumps(["história", "brasil", "geografia"]),
        "difficulty": "Médio",
        "duration": "15 min",
        "content_data": None
    },
    {
        "title": "Curso de Hardware: O Computador",
        "description": "Gustavo Guanabara explica o que é um computador por dentro.",
        "type": "video",
        "content": None,
        "source": "https://www.youtube.com/watch?v=zpK_MqEMgu4",
        "image_url": "images/hardware-computador.webp",
        "tags": json.dumps(["tecnologia", "programação", "hardware"]),
        "difficulty": "Médio",
        "duration": "10 min",
        "content_data": None
    },
    {
        "title": "3 Regras para Não Errar no Xadrez",
        "description": "Dicas essenciais para começar a jogar bem.",
        "type": "video",
        "content": None,
        "source": "https://www.youtube.com/watch?v=264JnaF8m0s",
        "image_url": "images/xadrez-regras.webp",
        "tags": json.dumps(["xadrez", "jogos", "tutorial"]),
        "difficulty": "Fácil",
        "duration": "12 min",
        "content_data": None
    },
    {
        "title": "O Incrível Mundo das Formigas",
        "description": "Veja como é um formigueiro por dentro.",
        "type": "video",
        "content": None,
        "source": "https://www.youtube.com/watch?v=sN99x_Rjf90",
        "image_url": "images/formigas.webp",
        "tags": json.dumps(["natureza", "animais", "biologia"]),
        "difficulty": "Fácil",
        "duration": "14 min",
        "content_data": None
    },

    # ==============================================================================
    # 3. CONTEÚDOS TIPO "VIDEO" ADICIONAIS (4 ITENS)
    # ==============================================================================
    {
        "title": "O Sistema Solar é Alinhado?",
        "description": "Manual do Mundo explica se os planetas giram mesmo no mesmo plano.",
        "type": "video",
        "content": None,
        "source": "https://www.youtube.com/watch?v=RDF1LCTTVM0",
        "image_url": "images/sistema-solar-alinhado.webp",
        "tags": json.dumps(["espaço", "astronomia", "sistema solar"]),
        "difficulty": "Fácil",
        "duration": "10 min",
        "content_data": None
    },
    {
        "title": "Como Funciona o Wi-Fi?",
        "description": "Entenda como a internet viaja pelo ar invisivelmente.",
        "type": "video",
        "content": None,
        "source": "https://www.youtube.com/watch?v=Z3bwoDdP_OE",
        "image_url": "images/wifi-funciona.webp",
        "tags": json.dumps(["tecnologia", "internet", "curiosidades"]),
        "difficulty": "Médio",
        "duration": "12 min",
        "content_data": None
    },
    {
        "title": "O Que Acontece no Cérebro Quando Ouvimos Música?",
        "description": "Minutos Psíquicos explica a relação entre som e emoção.",
        "type": "video",
        "content": None,
        "source": "https://www.youtube.com/watch?v=uvFX9BYEkvE",
        "image_url": "images/musica-cerebro-video.webp",
        "tags": json.dumps(["música", "ciência", "cérebro"]),
        "difficulty": "Médio",
        "duration": "10 min",
        "content_data": None
    },
    {
        "title": "Aprenda a Criar Jogos em 15 Minutos",
        "description": "Um guia rápido para começar a programar seus próprios games.",
        "type": "video",
        "content": None,
        "source": "https://www.youtube.com/watch?v=uKHLJjD0u_o",
        "image_url": "images/criar-jogos-tutorial.webp",
        "tags": json.dumps(["programação", "jogos", "tutorial"]),
        "difficulty": "Difícil",
        "duration": "15 min",
        "content_data": None
    },

    # ==============================================================================
    # 4. CONTEÚDOS TIPO "INTERACTIVE_GAME" (4 ITENS)
    # ==============================================================================
    {
        "title": "CodeCombat: RPG de Programação",
        "description": "Controle seu herói escrevendo código Python de verdade.",
        "type": "interactive_game",
        "content": None,
        "source": None,
        "image_url": "images/codecombat.webp",
        "tags": json.dumps(["programação", "jogos", "lógica"]),
        "difficulty": "Médio",
        "duration": "30 min",
        "content_data": json.dumps({"game_type": "embedded", "game_url": "https://codecombat.com/play"})
    },
    {
        "title": "GeoGuessr (Versão Free)",
        "description": "Onde você está no mundo? Descubra pelas fotos.",
        "type": "interactive_game",
        "content": None,
        "source": None,
        "image_url": "images/geoguessr.webp",
        "tags": json.dumps(["geografia", "mundo", "jogos"]),
        "difficulty": "Difícil",
        "duration": "15 min",
        "content_data": json.dumps({"game_type": "embedded", "game_url": "https://www.geoguessr.com/"})
    },
    {
        "title": "Scratch MIT",
        "description": "Crie seus próprios jogos e animações.",
        "type": "interactive_game",
        "content": None,
        "source": None,
        "image_url": "images/scratch.webp",
        "tags": json.dumps(["programação", "arte", "criatividade"]),
        "difficulty": "Fácil",
        "duration": "45 min",
        "content_data": json.dumps({"game_type": "embedded", "game_url": "https://scratch.mit.edu/projects/editor/"})
    },
    {
        "title": "Lichess: Aprenda Xadrez",
        "description": "Exercícios interativos de tática.",
        "type": "interactive_game",
        "content": None,
        "source": None,
        "image_url": "images/lichess.webp",
        "tags": json.dumps(["xadrez", "estratégia", "lógica"]),
        "difficulty": "Médio",
        "duration": "20 min",
        "content_data": json.dumps({"game_type": "embedded", "game_url": "https://lichess.org/learn"})
    }
]

# Script de Inserção
try:
    print(f"🔄 Iniciando inserção de {len(contents)} conteúdos...")
    print(f"📊 Tipos: {sum(1 for c in contents if c['type']=='text')} textos, "
          f"{sum(1 for c in contents if c['type']=='video')} vídeos, "
          f"{sum(1 for c in contents if c['type']=='interactive_game')} jogos\n")
    
    added = 0
    skipped = 0
    
    for content_data in contents:
        # Verifica se já existe pelo título
        exists = db.query(Content).filter(Content.title == content_data["title"]).first()
        if not exists:
            content = Content(**content_data)
            db.add(content)
            added += 1
            print(f"✅ Adicionado: {content_data['title']} ({content_data['type']})")
        else:
            skipped += 1
            print(f"⏭️  Já existe: {content_data['title']}")
            
    db.commit()
    print(f"\n{'='*70}")
    print(f"✅ Processo concluído!")
    print(f"📝 {added} conteúdos adicionados")
    print(f"⏭️  {skipped} conteúdos já existiam")
    print(f"💾 Total no banco: {db.query(Content).count()} conteúdos")
    print(f"{'='*70}")

except Exception as e:
    print(f"\n❌ Erro crítico: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()
