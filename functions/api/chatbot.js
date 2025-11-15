/**
 * Chatbot API para Grupo Musical La Célula usando Cloudflare Pages Functions
 * Este archivo debe colocarse en /functions/api/chatbot.js para funcionar con Cloudflare Pages
 */

export async function onRequest(context) {
  // Manejar CORS para solicitudes preflight
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400"
      },
      status: 204
    });
  }

  // Solo aceptar solicitudes POST
  if (context.request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método no permitido" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  try {
    // Obtener el cuerpo de la solicitud
    const requestData = await context.request.json();
    
    // Verificar que tenemos datos válidos
    if (!requestData || !requestData.history) {
      return new Response(JSON.stringify({ error: "Datos inválidos" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Obtener la clave API desde Cloudflare Secret
    const apiKey = context.env.API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key no configurada" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Procesar la solicitud - Dos opciones:
    
    // 1. Llamar a un servicio de IA externo como OpenAI
    // const response = await callExternalAIService(requestData.history, apiKey);
    
    // 2. O usar un sistema de reglas local para respuestas predefinidas
    const botResponse = generateLocalResponse(requestData.history);
    
    // Devolver la respuesta en el formato esperado por el frontend
    return new Response(JSON.stringify({
      candidates: [
        {
          content: {
            parts: [
              { text: botResponse }
            ]
          }
        }
      ]
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: `Error al procesar la solicitud: ${error.message}` }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

/**
 * Función para generar respuestas locales basadas en reglas
 */
function generateLocalResponse(history) {
  // Obtener el último mensaje del usuario
  let lastUserMessage = "";
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === "user") {
      lastUserMessage = history[i].parts[0].text;
      break;
    }
  }
  
  // Convertir a minúsculas para hacer coincidencias insensibles a mayúsculas
  const userMessageLower = lastUserMessage.toLowerCase();
  
  // Patrones para detectar intenciones específicas
  const patterns = {
    // Preguntas sobre servicios y paquetes
    'servicios|paquetes|ofrecen|tienen': [
      "¡Claro! 🎵 En **Grupo Musical La Célula** ofrecemos 3 paquetes principales:\n\n" +
      "1. **Paquete Event Plus**: Ideal para grandes eventos (50-2000 invitados), incluye 5 horas de música en vivo, iluminación, pantalla y animadores.\n\n" +
      "2. **Paquete Party**: Perfecto para eventos medianos (30-250 invitados), con 5 horas de música, iluminación y efectos especiales.\n\n" +
      "3. **Paquete Live**: Para eventos masivos o corporativos, con show temático personalizado y capacidad hasta 10,000 personas.\n\n" +
      "¿Cuál te interesa más para tu evento? 😊"
    ],
    
    // Preguntas sobre precios o cotizaciones
    'precio|costo|cotiz|cuanto|cuánto': [
      "Para ofrecerte una **cotización personalizada** 💰 necesitamos conocer algunos detalles de tu evento:\n\n" +
      "- ¿Qué tipo de evento estás planeando? (boda, XV años, corporativo, etc.)\n" +
      "- ¿Cuántos invitados aproximadamente tendrás?\n" +
      "- ¿Ya tienes fecha y lugar definidos?\n\n" +
      "Puedes proporcionarnos esta información aquí o contactarnos directamente por WhatsApp al **55 3541 2631** para una atención más rápida. ¡Estaremos encantados de ayudarte!"
    ],
    
    // Preguntas sobre música o repertorio
    'musica|cancion|repertorio|tocan|generos': [
      "¡Nuestra **versatilidad musical** es nuestra mayor fortaleza! 🎸🎹🎺\n\n" +
      "Nuestro repertorio incluye prácticamente todos los géneros:\n" +
      "- Cumbia, Salsa y música tropical\n" +
      "- Rock clásico y contemporáneo\n" +
      "- Pop en español e inglés\n" +
      "- Baladas y música romántica\n" +
      "- Música regional mexicana\n" +
      "- Jazz, Swing y música para ambientar\n" +
      "- Éxitos actuales y clásicos de todos los tiempos\n\n" +
      "Además, diseñamos bloques musicales personalizados para cada momento de tu evento. ¿Hay algún género en particular que te interese?"
    ],
    
    // Preguntas sobre bodas
    'boda|matrimonio|novia': [
      "¡Las **bodas** son nuestra especialidad! 💍✨\n\n" +
      "Ofrecemos experiencias musicales completas para cada momento de tu celebración:\n\n" +
      "- **Ceremonia**: Música elegante y emotiva\n" +
      "- **Recepción y coctel**: Ambientación sofisticada\n" +
      "- **Banquete**: Música suave de fondo\n" +
      "- **Fiesta**: ¡Todos a la pista de baile!\n\n" +
      "Nuestro **Paquete Party** es muy popular para bodas, pero podemos personalizar según tus necesidades y número de invitados. ¿Ya tienes fecha para tu boda? Me encantaría ayudarte a planificar la música perfecta."
    ],
    
    // Preguntas sobre XV años
    'xv|quince|quinceañera': [
      "¡Para **XV Años** creamos momentos inolvidables! 🎂👗\n\n" +
      "Nuestro servicio incluye:\n" +
      "- Música especial para el vals y ceremonias tradicionales\n" +
      "- Show 80's o temático a elección\n" +
      "- Dinámicas y animación para que todos tus invitados participen\n" +
      "- Efectos especiales y luces\n" +
      "- ¡Batucada para el momento de máxima diversión!\n\n" +
      "El **Paquete Party** es perfecto para la mayoría de las fiestas de XV años. ¿Ya tienes idea de qué tipo de música te gustaría para tu fiesta?"
    ],
    
    // Preguntas sobre eventos corporativos
    'corporativo|empresa|convención': [
      "Para **eventos corporativos** ofrecemos soluciones profesionales y versátiles. 🏢✨\n\n" +
      "Nuestros servicios incluyen:\n" +
      "- Música adaptada a la imagen de su empresa\n" +
      "- Shows temáticos personalizados\n" +
      "- Equipo técnico de primer nivel\n" +
      "- Puntualidad y profesionalismo\n" +
      "- Repertorio adecuado para cada momento del evento\n\n" +
      "El **Paquete Live** está diseñado especialmente para eventos corporativos grandes. ¿Podría contarme más sobre el tipo de evento que está organizando?"
    ],
    
    // Preguntas sobre disponibilidad o fechas
    'disponib|fecha|día|agenda|cuando|cuándo': [
      "Para verificar nuestra **disponibilidad** para tu fecha, necesitamos que nos indiques:\n\n" +
      "- ¿Qué día específico estás considerando?\n" +
      "- ¿En qué horario sería tu evento?\n" +
      "- ¿Qué tipo de evento estás planeando?\n\n" +
      "Te recomendamos reservar con 2-3 meses de anticipación, especialmente para temporada alta (diciembre-enero y mayo-junio). Puedes consultar disponibilidad inmediata por WhatsApp al **55 3541 2631** 📱"
    ],
    
    // Preguntas sobre el proceso de contratación
    'contrat|reserv|anticipo|apartado|proceso': [
      "El **proceso de contratación** es muy sencillo: 🎵📝\n\n" +
      "1. **Cotización personalizada** según tus necesidades\n" +
      "2. **Reserva** con un anticipo del 30%\n" +
      "3. **Confirmación** de detalles (horario, playlist especial, etc.)\n" +
      "4. **Pago** del saldo restante antes del evento\n" +
      "5. **¡Disfruta tu evento!** Nosotros nos encargamos de todo\n\n" +
      "Para comenzar, puedes usar nuestro cotizador en línea o contactarnos directamente por WhatsApp al **55 3541 2631**. ¿Te gustaría iniciar el proceso ahora?"
    ],
    
    // Preguntas sobre equipo/instrumentos/montaje
    'equipo|instrument|sonido|montaje': [
      "Contamos con **equipo profesional** para eventos de cualquier tamaño: 🎧🎚️\n\n" +
      "- Sistemas de sonido de alta fidelidad\n" +
      "- Iluminación profesional robotizada y láser\n" +
      "- Pantallas LED (según el paquete)\n" +
      "- Instrumentos profesionales\n" +
      "- Efectos especiales\n\n" +
      "Realizamos el **montaje completo** con anticipación para garantizar que todo funcione perfectamente. El tiempo de montaje varía según el paquete, pero generalmente necesitamos 2-3 horas antes del evento. ¿Tienes alguna necesidad técnica específica para tu evento?"
    ],
    
    // Saludos o inicios de conversación
    'hola|buenos dias|buenas tardes|buenas noches|saludos|buen día': [
      "¡Hola! 👋 Bienvenido al asistente virtual de **Grupo Musical Versátil La Célula**. Estoy aquí para ayudarte a encontrar la música perfecta para tu evento. ¿En qué puedo ayudarte hoy? ¿Buscas información sobre nuestros paquetes, disponibilidad o tienes alguna duda específica?"
    ],
    
    // Despedidas o agradecimientos
    'gracias|adios|adiós|hasta luego|bye|chao': [
      "¡Gracias por contactarnos! 🎵 Ha sido un placer ayudarte. Si tienes más preguntas, no dudes en escribirnos por WhatsApp al **55 3541 2631** o usar nuestro cotizador en línea. ¡Esperamos ser parte de tu evento especial! 🎉"
    ]
  };
  
  // Buscar coincidencias en los patrones
  for (const pattern in patterns) {
    const regex = new RegExp(`\\b(${pattern})\\b`, 'i');
    if (regex.test(userMessageLower)) {
      // Elegir una respuesta aleatoria dentro de las posibles para ese patrón
      const responses = patterns[pattern];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  // Si no hay coincidencia específica, usar respuestas genéricas
  const fallbackResponses = [
    "Gracias por tu mensaje. En **Grupo Musical La Célula** nos especializamos en hacer tu evento inolvidable con nuestra música versátil. 🎵\n\n¿Podrías contarme más sobre el tipo de evento que estás planeando? Así podré brindarte información más específica sobre nuestros paquetes.",
    
    "¡Qué interesante! Para ofrecerte la mejor recomendación, me gustaría saber: ¿estás planeando una boda 💍, XV años 🎂, evento corporativo 🏢 u otro tipo de celebración? Cada evento tiene necesidades específicas que podemos atender.",
    
    "Entiendo. Para ayudarte mejor, ¿podrías indicarme aproximadamente cuántas personas asistirán a tu evento? Esto me ayudará a recomendarte el paquete musical más adecuado para tus necesidades.",
    
    "Gracias por compartir esa información. 😊 Si quieres una **cotización personalizada**, puedes contactarnos directamente por WhatsApp al **55 3541 2631** o proporcionarme más detalles sobre tu evento aquí mismo.",
    
    "**Grupo Musical Versátil La Célula** tiene más de 10 años de experiencia creando ambientes musicales perfectos. ¿Hay algún género musical en particular que te gustaría incluir en tu evento?",
    
    "Me encantaría ayudarte a hacer tu evento especial. ¿Ya tienes una fecha definida? Podemos verificar nuestra disponibilidad y comenzar a planificar la música perfecta para tu celebración."
  ];
  
  // Elegir una respuesta genérica aleatoria
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}