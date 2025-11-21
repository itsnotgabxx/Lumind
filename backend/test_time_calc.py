#!/usr/bin/env python3
"""
Teste para verificar o cálculo de time_spent
"""

# Simular o que está chegando
time_spent_values = [
    30,  # Primeiro envio (30 segundos)
    60,  # Segundo envio (60 segundos totais)
    90,  # Terceiro envio (90 segundos totais)
    318916537513754  # Valor gigante que está sendo recebido
]

print("Testando cálculos:")
for ts in time_spent_values:
    minutes = ts // 60 if ts > 0 else 0
    print(f"time_spent={ts} → {minutes} minutos (horas: {minutes // 60}h {minutes % 60}min)")

print("\n" + "="*60)
print("Análise do valor gigante 318916537513754:")
print("="*60)

huge_value = 318916537513754
print(f"Valor: {huge_value}")
print(f"Em minutos: {huge_value // 60}")
print(f"Em horas: {huge_value // 3600}")
print(f"Em dias: {huge_value // 86400}")
print(f"Em anos: {huge_value // (365 * 86400)}")

# Verificar se é milissegundos
import time
now_ms = int(time.time() * 1000)
print(f"\nTempo atual em milissegundos: {now_ms}")
print(f"Valor gigante em segundos: {huge_value / 1000}")

# Talvez seja Date.now() (milissegundos) sendo passado diretamente?
print(f"\n🤔 Se fosse Date.now(): {huge_value} ms")
print(f"   Em segundos: {huge_value / 1000} s")
print(f"   Em minutos: {huge_value / 60000} min")
print(f"   Em horas: {huge_value / 3600000} h")
