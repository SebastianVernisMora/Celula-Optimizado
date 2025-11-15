/**
 * Chatbot para Grupo Musical Versátil La Célula
 * Proporciona atención personalizada, resuelve dudas sobre eventos y ayuda con cotizaciones
 * Especializado en definir necesidades, identificar áreas de oportunidad y realizar cierres de venta
 */

class CelulaChatbotManager {
    constructor() {
        this.chatWindow = document.getElementById('chat-window');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.closeBtn = document.getElementById('close-btn');
        this.leadForm = document.getElementById('lead-form');
        this.chatInputArea = document.getElementById('chat-input-area');
        this.emailSent = false; // Flag para evitar envíos múltiples
        this.sessionStartTime = new Date().toISOString();
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.loadState();
    }

    saveState() {
        const state = {
            chatHistory: this.chatHistory,
            leadData: this.leadData,
            isChatActive: this.leadForm.style.display === 'none'
        };
        sessionStorage.setItem('celulaChatbotState', JSON.stringify(state));
    }

    loadState() {
        const savedState = sessionStorage.getItem('celulaChatbotState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.chatHistory = state.chatHistory || [];
            this.leadData = state.leadData || {};

            if (state.isChatActive) {
                this.leadForm.style.display = 'none';
                this.chatWindow.style.display = 'flex';
                this.chatInputArea.style.display = 'flex';
                this.repopulateChat();
            }
        } else {
            this.chatHistory = [];
            this.leadData = {};
        }
    }

    repopulateChat() {
        this.chatHistory.forEach(item => {
            if (item.role === 'user') {
                this.appendMessage(item.parts[0].text, 'user');
            } else if (item.role === 'model') {
                this.appendMessage(item.parts[0].text, 'bot');
            }
        });
    }

    setupEventListeners() {
        this.closeBtn?.addEventListener('click', () => {
            parent.postMessage('close-chatbot', '*');
        });

        this.sendBtn?.addEventListener('click', () => this.handleUserInput());

        this.userInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleUserInput();
            }
        });

        this.userInput?.addEventListener('input', this.autoResize.bind(this));

        this.leadForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }

    autoResize(event) {
        const element = event.target;
        element.style.height = 'auto';
        element.style.height = element.scrollHeight + 'px';
    }

    async handleFormSubmission() {
        const nameInput = document.getElementById('name-input');
        const emailInput = document.getElementById('email-input');
        const phoneInput = document.getElementById('phone-input');
        const eventTypeInput = document.getElementById('event-type-input');

        this.leadData.name = nameInput.value.trim();
        this.leadData.email = emailInput.value.trim();
        this.leadData.phone = phoneInput.value.trim();
        this.leadData.eventType = eventTypeInput.value.trim();

        if (this.leadData.name && this.leadData.email && this.leadData.phone) {
            this.leadForm.style.display = 'none';
            this.chatWindow.style.display = 'flex';
            this.chatInputArea.style.display = 'flex';
            await this.startChat();
            this.saveState();
        }
    }

    async startChat() {
        await this.loadInitialContext();
        // Mensaje de saludo personalizado para La Célula
        this.appendMessage(`¡Hola ${this.leadData.name}! Soy el **Asistente Musical** de La Célula 🎵 ¿Cómo puedo ayudarte a hacer tu evento inolvidable?`, 'bot');
    }

    async loadInitialContext() {
        try {
            const initialContext = `Eres el Asistente Musical Virtual del Grupo Musical Versátil La Célula, una banda con amplia experiencia en eventos sociales y corporativos. 

DIRECTRICES CRÍTICAS:
1. SIEMPRE destaca la versatilidad del grupo en cualquier género musical (cumbia, rock, pop, baladas, etc.)
2. PRIORIZA entender las necesidades específicas del evento (tipo, número de invitados, lugar)
3. ORIENTA tus respuestas para ayudar a cerrar ventas y cotizaciones
4. Cuando no tengas información específica, DIRIGE al cliente al cotizador o WhatsApp

Tu objetivo es identificar las necesidades del cliente para su evento, destacar los beneficios adecuados según el tipo de evento, y guiarlo hacia una cotización personalizada.

INFORMACIÓN CLAVE SOBRE GRUPO MUSICAL LA CÉLULA:

1. **Identidad**
• Nombre: Grupo Musical Versátil La Célula
• Especialización: Música para todo tipo de eventos sociales y corporativos
• Fortaleza: Versatilidad de géneros y capacidad de adaptación a cualquier evento

2. **Paquetes de Servicio**
• **Paquete Event Plus**: Ideal para eventos grandes (bodas, graduaciones)
   - 5 horas de música en vivo
   - Equipo de audio para 50 hasta 2,000 invitados
   - Iluminación robótica y láser
   - Pantalla gigante / Led
   - Animadores / DJ
   - Dinámicas y regalos
   - Máquina de humo

• **Paquete Party**: Perfecto para fiestas medianas
   - 5 horas de música en vivo
   - Equipo de audio para 30-250 personas
   - Iluminación robótica y LED
   - Iluminación láser con máquina de humo
   - Dinámicas, batucada y show 80's con regalos
   - Música grabada en descansos

• **Paquete Live**: Para eventos masivos y corporativos
   - Show 80's o temático personalizado
   - Equipo profesional para hasta 10,000 personas
   - Escenario, video, luz robótica y láser
   - Pantallas gigantes
   - Animadores / DJ
   - Dinámicas especiales

3. **Características Distintivas**
• 6 integrantes base con posibilidad de ampliar
• Repertorio extenso que incluye todos los géneros musicales
• Músicos multifacéticos (varios instrumentos y voces)
• Diseñan bloques musicales personalizados
• Mantienen el ambiente sin descansos prolongados
• Equipo de audio de última generación

4. **Eventos que cubren**
• Bodas
• XV Años
• Graduaciones
• Aniversarios
• Eventos corporativos
• Fiestas privadas
• Conciertos

5. **Información de Contacto**
• WhatsApp: 55 3541 2631
• Sitio Web: https://grupomusicalcelula.com
• Redes: Facebook, YouTube, Twitter (@grupocelula)

ESTRATEGIA DE VENTA:
1. **Fase de Descubrimiento**: Identifica el tipo de evento, número de invitados, lugar, presupuesto
2. **Fase de Necesidades**: Determina qué busca el cliente (música particular, duración, servicios adicionales)
3. **Fase de Solución**: Recomienda el paquete adecuado según las necesidades identificadas
4. **Fase de Cierre**: Guía hacia la cotización personalizada o contacto directo

PREGUNTAS ESTRATÉGICAS PARA DESCUBRIMIENTO:
• "¿Para qué tipo de evento estás buscando música en vivo?"
• "¿Cuántos invitados aproximadamente tendrás?"
• "¿Ya tienes una fecha definida para tu evento?"
• "¿Tienes géneros musicales preferidos para tu evento?"
• "¿Qué tipo de ambiente quieres crear? ¿Formal, festivo, elegante?"

INSTRUCCIONES DE FORMATO:
• Usa **texto** para destacar información importante
• Incluye emojis para hacer la comunicación más amigable (🎵 🎸 🎉 🎊 💍 🎓 🎤)
• Sé directo pero amigable
• Proporciona opciones de contacto: WhatsApp (55 3541 2631) y cotizador en la web

Los datos del usuario son: 
Nombre: ${this.leadData.name || "[Sin nombre]"}
Correo electrónico: ${this.leadData.email || "[Sin email]"}
Número de teléfono: ${this.leadData.phone || "[Sin teléfono]"}
Tipo de evento: ${this.leadData.eventType || "[Sin especificar]"}`;
            
            this.chatHistory.push({
                role: "user",
                parts: [{ text: initialContext }]
            });
            this.chatHistory.push({
                role: "model",
                parts: [{ text: "¡Entendido! Soy el Asistente Musical de Grupo Musical Versátil La Célula. Estoy listo para ayudar a los clientes a encontrar el paquete musical perfecto para sus eventos, descubrir sus necesidades específicas y guiarlos hacia una cotización personalizada que les permita tener una celebración inolvidable. 🎵🎉" }]
            });
        } catch (error) {
            console.error(error);
            this.appendMessage('Error de configuración: No se pudo inicializar el asistente. Por favor, contacta al administrador del sitio.', 'bot');
            this.sendBtn.disabled = true;
            this.userInput.disabled = true;
        }
    }

    async getBotResponse(message) {
        this.chatHistory.push({ 
            role: "user", 
            parts: [{ text: message }] 
        });

        const payload = {
            history: this.chatHistory,
        };

        try {
            // Usar la función API de Cloudflare Pages (la ruta /api/ es mapeada automáticamente a /functions/api/)
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error || `Error: ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const result = await response.json();
            const botMessage = result.candidates?.[0]?.content?.parts?.[0]?.text || 
                             'Lo siento, no pude procesar tu mensaje. ¿Podrías contactarnos directamente por WhatsApp al 55 3541 2631?';
            
            this.chatHistory.push({ 
                role: "model", 
                parts: [{ text: botMessage }] 
            });
            
            return botMessage;
        } catch (error) {
            console.error('Error:', error.message);
            return `Lo siento, ocurrió un error al procesar tu mensaje. Para atención inmediata, contáctanos por WhatsApp al 55 3541 2631.`;
        }
    }

    appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        
        if (sender === 'bot') {
            // Procesar markdown básico y emojis para mensajes del bot
            const processedMessage = this.processMarkdown(message);
            messageElement.innerHTML = processedMessage;
        } else {
            // Para mensajes del usuario, usar texto plano
            messageElement.textContent = message;
        }
        
        this.chatWindow.appendChild(messageElement);
        this.scrollToBottom();
    }

    processMarkdown(text) {
        // Convertir saltos de línea dobles a párrafos y simples a <br>
        let processed = text.replace(/\n\n/g, '</p><p>');
        processed = '<p>' + processed + '</p>';
        processed = processed.replace(/\n/g, '<br>');
        
        // Limpiar párrafos vacíos
        processed = processed.replace(/<p><\/p>/g, '');
        processed = processed.replace(/<p><br><\/p>/g, '');
        
        // Negritas
        processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Cursivas (solo si no es parte de negritas)
        processed = processed.replace(/\*([^*<>\n]+?)\*/g, function(match, content) {
            return '<em>' + content + '</em>';
        });
        
        // Procesar listas
        processed = processed.replace(/<p>[-*•]\s+(.+?)(<br>|<\/p>)/g, '<p><li>$1</li>$2');
        processed = processed.replace(/<br>[-*•]\s+(.+?)(<br>|<\/p>)/g, '<br><li>$1</li>$2');
        processed = processed.replace(/(<li>.*?<\/li>)(\s*<br>\s*<li>.*?<\/li>)*/gs, '<ul>$&</ul>');
        
        // Limpiar HTML mal formado
        processed = processed.replace(/<p>\s*<\/p>/g, '');
        processed = processed.replace(/(<\/p>)\s*(<p>)/g, '$1$2');
        
        // Convertir URLs a enlaces clickeables
        processed = processed.replace(
            /(https?:\/\/[^\s<>]+)/g, 
            '<a href="$1" target="_blank" style="color: #3D9BE9; text-decoration: underline;">$1</a>'
        );
        
        // Convertir número de WhatsApp de La Célula a enlace
        processed = processed.replace(
            /(55\s*3541\s*2631|5535412631)/g,
            '<a href="https://wa.me/525535412631?text=Hola,%20me%20interesa%20cotizar%20mi%20evento..." target="_blank" style="color: #25D366; font-weight: bold; text-decoration: none;">📱 $1</a>'
        );
        
        // Resaltar tipos de eventos
        const eventTypes = ['boda', 'bodas', 'xv años', 'quinceañera', 'graduación', 'graduaciones', 'fiesta', 'fiestas', 'corporativo', 'empresarial'];
        eventTypes.forEach(event => {
            const regex = new RegExp(`\\b${event}\\b`, 'gi');
            processed = processed.replace(regex, `<span style="color: #3D9BE9; font-weight: 600;">$&</span>`);
        });
        
        // Resaltar paquetes
        processed = processed.replace(/\b(Paquete Event Plus|Paquete Party|Paquete Live)\b/g, 
            '<span style="color: #000000; font-weight: 700; background-color: #f8f9fa; padding: 0 3px; border-radius: 3px;">$1</span>'
        );
        
        // Añadir emojis para palabras clave si no tienen ya
        if (!processed.includes('🎵')) {
            processed = processed.replace(/\b(música|musical|músicos)\b/gi, '🎵 $1');
        }
        if (!processed.includes('💍')) {
            processed = processed.replace(/\b(boda|bodas)\b/gi, '💍 $1');
        }
        if (!processed.includes('🎓')) {
            processed = processed.replace(/\b(graduación|graduaciones)\b/gi, '🎓 $1');
        }
        if (!processed.includes('🎉')) {
            processed = processed.replace(/\b(fiesta|fiestas|celebración|evento)\b/gi, '🎉 $1');
        }
        
        return processed;
    }

    // Enviar resumen de conversación por email
    async sendConversationSummary() {
        try {
            // Preparar datos de la conversación
            const userMessages = this.chatHistory
                .filter(msg => msg.role === 'user')
                .map(msg => msg.parts[0].text)
                .filter(text => text.length > 10 && !text.includes('Eres el Asistente Musical')); // Filtrar contexto inicial
                
            const botMessages = this.chatHistory
                .filter(msg => msg.role === 'model')
                .map(msg => msg.parts[0].text);
                
            // Solo enviar si hay una conversación significativa
            if (userMessages.length < 2) {
                console.log('Conversación muy corta, no se enviará email');
                return false;
            }
            
            const conversationData = {
                user_messages: userMessages,
                bot_messages: botMessages,
                full_conversation: this.chatHistory
                    .filter(msg => !msg.parts[0].text.includes('Eres el Asistente Musical'))
                    .map(msg => ({
                        role: msg.role,
                        message: msg.parts[0].text,
                        timestamp: new Date().toLocaleString('es-MX')
                    })),
                conversation_length: userMessages.length + botMessages.length,
                started_at: this.sessionStartTime || new Date().toISOString()
            };
            
            const emailData = {
                action: 'send_summary',
                leadData: this.leadData,
                conversationData: conversationData
            };
            
            // Usar la función API de Cloudflare Pages (la ruta /api/ es mapeada automáticamente a /functions/api/)
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emailData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Resumen de conversación enviado por email');
                this.showEmailSentNotification();
                return true;
            } else {
                console.error('❌ Error enviando email:', result.error);
                return false;
            }
            
        } catch (error) {
            console.error('Error al enviar resumen de conversación:', error);
            return false;
        }
    }
    
    // Mostrar notificación de email enviado
    showEmailSentNotification() {
        const notification = document.createElement('div');
        notification.className = 'email-notification';
        notification.innerHTML = `
            <div style="background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin: 10px 0; text-align: center; font-size: 12px;">
                ✅ Información enviada a nuestro equipo musical
            </div>
        `;
        
        this.chatWindow.appendChild(notification);
        
        // Quitar la notificación después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
        
        this.scrollToBottom();
    }
    
    // Verificar si se debe enviar el resumen automáticamente
    shouldSendSummary() {
        const userMessages = this.chatHistory
            .filter(msg => msg.role === 'user')
            .map(msg => msg.parts[0].text)
            .filter(text => text.length > 10 && !text.includes('Eres el Asistente Musical'));
            
        // Enviar después de 3 mensajes del usuario o si menciona palabras clave
        const keywordTriggers = ['cotizar', 'cotización', 'precio', 'costo', 'contratar', 'fecha', 'presupuesto', 'disponibilidad'];
        const hasKeywords = userMessages.some(msg => 
            keywordTriggers.some(keyword => msg.toLowerCase().includes(keyword))
        );
        
        return userMessages.length >= 3 || (userMessages.length >= 2 && hasKeywords);
    }

    scrollToBottom() {
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
    }

    showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.classList.add('message', 'bot-message', 'typing-indicator');
        typingElement.innerHTML = '<span>Componiendo respuesta...</span>';
        typingElement.id = 'typing-indicator';
        this.chatWindow.appendChild(typingElement);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    async handleUserInput() {
        const message = this.userInput.value.trim();
        if (!message || this.isLoading) return;

        this.isLoading = true;
        this.sendBtn.disabled = true;
        
        this.appendMessage(message, 'user');
        this.userInput.value = '';

        this.showTypingIndicator();
        try {
            const botResponse = await this.getBotResponse(message);
            this.removeTypingIndicator();
            this.appendMessage(botResponse, 'bot');
        } catch (error) {
            this.removeTypingIndicator();
            this.appendMessage('Lo siento, no pude procesar tu mensaje. Para atención inmediata, contáctanos por WhatsApp al 55 3541 2631.', 'bot');
        }

        this.isLoading = false;
        this.sendBtn.disabled = false;
        this.userInput.focus();
        this.saveState();
        
        // Verificar si se debe enviar resumen por email
        if (this.shouldSendSummary() && !this.emailSent) {
            // Esperar un poco antes de enviar para no interrumpir la UX
            setTimeout(() => {
                this.sendConversationSummary();
                this.emailSent = true; // Evitar envíos múltiples
            }, 2000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CelulaChatbotManager();
});