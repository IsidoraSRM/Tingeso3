# Historias de Usuario - KartingRM (Formato Corto)

## HU-01: Validación de Campos Obligatorios
Como usuario quiero validación de campos obligatorios para evitar errores.

Escenario 1:  
Dado que estoy en el formulario  
Y no completé la fecha  
Cuando intento avanzar  
Entonces veo error y no puedo continuar

Escenario 2:  
Dado que faltan campos obligatorios  
Y intento crear reserva  
Cuando hago clic en crear  
Entonces veo qué campos faltan

## HU-02: Validación de Email
Como usuario quiero validación de email para asegurar comunicación.

Escenario 1:  
Dado que escribo "correo-inválido"  
Y cambio de campo  
Cuando el sistema valida  
Entonces veo mensaje de error inmediato

Escenario 2:  
Dado que escribo "test@ejemplo.com"  
Y cambio de campo  
Cuando reviso el campo  
Entonces no hay errores

## HU-03: Validación de RUT
Como usuario quiero validación de RUT para asegurar datos correctos.

Escenario 1:  
Dado que escribo "123456789" (sin guión)  
Y cambio de campo  
Cuando valida el sistema  
Entonces veo "Formato inválido. Use: 12345678-9"

Escenario 2:  
Dado que escribo "12345678-9"  
Y cambio de campo  
Cuando reviso el campo  
Entonces no hay errores

## HU-04: Validación de Teléfono
Como usuario quiero validación de teléfono para asegurar número correcto.

Escenario 1:  
Dado que escribo "12345" (5 dígitos)  
Y cambio de campo  
Cuando valida el sistema  
Entonces veo "Debe tener exactamente 9 dígitos"

Escenario 2:  
Dado que escribo "912345678"  
Y cambio de campo  
Cuando reviso el campo  
Entonces no hay errores

## HU-05: Bloqueo de Avance con Errores
Como usuario quiero que se impida avanzar con errores para evitar reservas incorrectas.

Escenario 1:  
Dado que tengo errores de validación  
Y intento avanzar  
Cuando hago clic en "Siguiente"  
Entonces veo alerta y permanezco en el paso

Escenario 2:  
Dado que todos los campos son válidos  
Y intento avanzar  
Cuando hago clic en "Siguiente"  
Entonces avanzo exitosamente

## HU-06: Autocompletado de Grupo
Como usuario quiero autocompletar clientes adicionales para agilizar reservas grupales.

Escenario 1:  
Dado que tengo reserva para +1 persona  
Y completé Cliente 1  
Cuando veo opción autocompletar  
Entonces puedo activarla

Escenario 2:  
Dado que activo autocompletado  
Y hay clientes adicionales  
Cuando reviso sus datos  
Entonces tienen valores por defecto, RUT vacío

## HU-07: Modal de Ayuda Contextual
Como usuario quiero ver información de reservas grupales para entender reglas.

Escenario 1:  
Dado que elijo autocompletar  
Y hago clic en la opción  
Cuando aparece el modal  
Entonces veo info sobre RUT y descuentos

Escenario 2:  
Dado que leo el modal  
Y hago clic en "Entendido"  
Cuando acepto  
Entonces se activa autocompletado y cierra modal

## HU-08: Botón Cancelar
Como usuario quiero cancelar el proceso para volver al inicio.

Escenario:  
Dado que estoy en cualquier paso  
Y quiero cancelar  
Cuando hago clic en "Cancelar"  
Entonces regreso a página de inicio

## HU-09: Feedback Visual de Errores
Como usuario quiero ver errores en tiempo real para corregirlos inmediatamente.

Escenario 1:  
Dado que un campo tiene error  
Y está enfocado  
Cuando reviso visualmente  
Entonces veo borde rojo y mensaje específico

Escenario 2:  
Dado que corrijo un error  
Y el campo es válido  
Cuando cambio de campo  
Entonces el error desaparece

## HU-10: Duración Extendida de Alertas
Como usuario quiero alertas con tiempo suficiente para leer mensajes completos.

Escenario:  
Dado que el sistema muestra alerta  
Y aparece en pantalla  
Cuando espero sin hacer nada  
Entonces permanece visible por 8+ segundos


---

## Casos de Prueba para Selenium IDE

### CP-01: Email Inválido
```
1. Abrir formulario reserva
2. Completar: fecha, duración, cantidad → Siguiente
3. Cliente 1: email = "email-inválido" → Tab
4. Verificar: mensaje error visible
```

### CP-02: RUT Obligatorio en Grupos
```
1. Reserva para 2 personas
2. Cliente 1: completar todos los datos
3. Activar autocompletado → Entendido
4. Crear reserva sin RUT en Cliente 2
5. Verificar: error RUT faltante
```

### CP-03: Cancelación
```
1. Iniciar reserva → completar algunos campos
2. Clic "Cancelar"
3. Verificar: redirección a home
```

### CP-04: Bloqueo con Errores
```
1. Formulario con errores de validación
2. Clic "Siguiente"
3. Verificar: alerta visible + permanece en paso
```

### CP-05: Autocompletado Grupal
```
1. Reserva 3+ personas
2. Cliente 1 completo → opción autocompletar "Sí"
3. Modal → "Entendido"
4. Verificar: Cliente 2,3... con datos copiados, RUT vacío
```

### CP-06: Visualización de Calendario
```
1. Acceder a /rack → esperar carga
2. Verificar: calendario visible con reservas marcadas
3. Cambiar a vista semanal
4. Verificar: horarios 10:00-23:00 visibles
```

### CP-07: Tooltip de Reservas
```
1. Calendario con reservas → hover sobre evento
2. Verificar: tooltip con ID, horarios, tamaño grupo
3. Mover a otro evento
4. Verificar: información actualizada
```

### CP-08: Navegación de Calendario
```
1. Vista mensual → clic "anterior"
2. Verificar: mes previo cargado
3. Clic "hoy"
4. Verificar: regresa a fecha actual
```

### CP-09: Selección de Fechas para Reporte
```
1. Acceder a reportes → dejar fechas vacías
2. Clic "Generar Reporte"
3. Verificar: error "selecciona ambas fechas"
4. Fecha inicial > fecha final → Generar
5. Verificar: error "fecha inicial no puede ser posterior"
```

### CP-10: Generación de Reporte de Vueltas
```
1. Fechas válidas → seleccionar "Reporte por Vueltas/Tiempo"
2. Clic "Generar Reporte"
3. Verificar: navegación a /laps-report
4. Esperar carga → verificar tabla con datos
5. Clic "Volver" → verificar regreso a selección
```

### CP-11: Manejo de Errores en Reportes
```
1. Generar reporte con error de conexión
2. Verificar: mensaje error + botón "Reintentar"
3. Clic "Reintentar"
4. Verificar: intento de recarga
```

### CP-12: Formato de Datos Monetarios
```
1. Reporte cargado exitosamente
2. Verificar: formato "$X,XXX" en todas las celdas
3. Revisar fila totales
4. Verificar: gran total resaltado y diferenciado
```

---

# RACK/CALENDARIO - Historias de Usuario

## HU-11: Visualización del Calendario
Como administrador quiero ver un calendario con las reservas para gestionar disponibilidad.

Escenario 1:  
Dado que accedo al rack/calendario  
Y hay reservas en el sistema  
Cuando se carga la vista  
Entonces veo el calendario con eventos marcados

Escenario 2:  
Dado que veo el calendario mensual  
Y quiero más detalle  
Cuando cambio a vista semanal  
Entonces veo horarios específicos y duración

## HU-12: Información de Reservas en Calendario
Como administrador quiero ver detalles de reservas para conocer información específica.

Escenario 1:  
Dado que hay una reserva en el calendario  
Y paso el cursor sobre ella  
Cuando aparece el tooltip  
Entonces veo ID, hora inicio/fin, y tamaño grupo

Escenario 2:  
Dado que veo múltiples reservas  
Y están en diferentes fechas  
Cuando navego por el calendario  
Entonces cada evento muestra su información correspondiente

## HU-13: Navegación del Calendario
Como administrador quiero navegar fácilmente por fechas para revisar diferentes períodos.

Escenario 1:  
Dado que estoy en vista mensual  
Y quiero ver el mes anterior  
Cuando hago clic en "anterior"  
Entonces navego al mes previo manteniendo datos

Escenario 2:  
Dado que estoy viendo fechas pasadas  
Y quiero volver al presente  
Cuando hago clic en "hoy"  
Entonces regreso a la fecha actual

## HU-14: Cambio de Vistas del Calendario
Como administrador quiero alternar entre vistas para diferentes niveles de detalle.

Escenario:  
Dado que estoy en vista mensual  
Y quiero ver detalles de horarios  
Cuando selecciono vista semanal  
Entonces veo horarios de 10:00-23:00 con reservas detalladas

---

# REPORTES POR VUELTAS - Historias de Usuario

## HU-15: Selección de Período de Reporte
Como administrador quiero seleccionar fechas para reportes para analizar períodos específicos.

Escenario 1:  
Dado que quiero generar un reporte  
Y no selecciono fechas  
Cuando intento generar  
Entonces veo error "selecciona ambas fechas"

Escenario 2:  
Dado que selecciono fecha inicial posterior a final  
Y intento generar reporte  
Cuando hago clic en generar  
Entonces veo error "fecha inicial no puede ser posterior"

## HU-16: Selección de Tipo de Reporte
Como administrador quiero elegir tipo de reporte para obtener información específica.

Escenario 1:  
Dado que selecciono "Reporte por Vueltas/Tiempo"  
Y tengo fechas válidas  
Cuando genero el reporte  
Entonces navego a vista de reporte de vueltas

Escenario 2:  
Dado que selecciono "Reporte por Tamaño de Grupo"  
Y tengo fechas válidas  
Cuando genero el reporte  
Entonces navego a vista de reporte grupal

## HU-17: Visualización de Reporte por Vueltas
Como administrador quiero ver ingresos por categoría de vueltas para analizar rentabilidad.

Escenario 1:  
Dado que genero reporte de vueltas  
Y hay datos en el período  
Cuando se carga el reporte  
Entonces veo tabla con categorías, meses y totales

Escenario 2:  
Dado que el reporte se está cargando  
Y hay demora en la respuesta  
Cuando espero  
Entonces veo indicador de "Cargando datos del reporte..."

## HU-18: Navegación en Reporte de Vueltas
Como administrador quiero navegar desde el reporte para volver a configurar nuevos reportes.

Escenario:  
Dado que estoy viendo un reporte de vueltas  
Y quiero generar otro reporte  
Cuando hago clic en "Volver"  
Entonces regreso a la selección de reportes

## HU-19: Manejo de Errores en Reportes
Como administrador quiero gestión de errores clara para solucionar problemas.

Escenario 1:  
Dado que hay error al cargar reporte  
Y veo mensaje de error  
Cuando hago clic en "Reintentar"  
Entonces se vuelve a intentar cargar los datos

Escenario 2:  
Dado que no hay datos para el período  
Y el reporte se carga exitosamente  
Cuando reviso el contenido  
Entonces veo "No hay datos disponibles para el rango seleccionado"

## HU-20: Formato de Datos en Reporte
Como administrador quiero datos bien formateados para fácil lectura y análisis.

Escenario 1:  
Dado que veo el reporte cargado  
Y hay valores monetarios  
Cuando reviso las cifras  
Entonces veo formato "$X,XXX" con separadores de miles

Escenario 2:  
Dado que hay fila de totales  
Y reviso los montos finales  
Cuando veo el gran total  
Entonces está resaltado y bien diferenciado
