import { CONFIG } from '../config/config';
import { ConfigService } from './../config/config.service';

const configService = new ConfigService();

const verifyRegistrationSuccessText = '✅ <b>EL REGISTRO SE HA COMPLETADO CON ÉXITO!</b>\n' +
  '\n' +
  '⚠️Para acceder a las señales en el canal VIP, debes realizar un depósito en la plataforma Binomo por cualquier monto a partir de <b>$25</b>. Haga clic en el botón de depósito en la esquina superior derecha.'
  '\n' +
  '💰Se aceptan varios métodos de pago, ¡así que no tendrás ningún problema!\n' +
  '\n' +
  '🎁Bono por primer depósito <b>+100%</b> usando el código promocional <b>GOTRADE</b>.\n' +
  '\n' +
  '✅Después de realizar su depósito, haga clic en el botón “<b>VERIFICAR DEPÓSITO</b>”.\n' +
  '\n' +
  '📩<b>Si tienes alguna pregunta escríbeme.</b>';

const verifyRegistrationFailedText = '❌<b>LA INSCRIPCIÓN NO ESTÁ COMPLETA!</b>\n' +
  '\n' +
  '📲Primero, debe registrarse en el sitio.\n' +
  '\n' +
  '1.📍Haga clic en el botón "<b>REGISTRO</b>". La cuenta debe ser NUEVA, si ya tenía una cuenta, entonces necesita crear una nueva.\n' +
  '\n' +
  '2.📍Después del REGISTRO, haga clic en el botón "<b>VERIFICAR REGISTRO</b>".\n' +
  '\n' +
  '‼️<b>Si el bot te escribió “EL REGISTRO NO ESTÁ COMPLETO”, intenta confirmarlo nuevamente haciendo clic en el botón “VERIFICAR REGISTRO” después de 10 minutos.</b>👇\n' +
  '\n' +
  '✅<b>Si te has registrado y después de más de 10 minutos el bot no lo reconoce, escríbeme</b>📩';

const verifyDepositSuccessText = '🔥<b>FELICIDADES</b>🔥\n' +
  '\n' +
  '🤝🏼Bienvenido al equipo!🤝🏼\n' +
  '\n' +
  '✅ Has obtenido acceso al canal VIP.\n' +
  '\n' +
  'Si tienes alguna pregunta, siempre puedes escribirme y obtener ayuda. Que tenga un buen día.';

const verifyDepositFailedText = '❌<b>NO HAS REALIZADO EL DEPÓSITO.</b>\n' +
  '\n' +
  '⚠️Para poder acceder a las señales en el bot VIP, es necesario que realices un depósito de <b>$25</b> o más. Haga clic en el botón "<b>DEPÓSITO</b>".\n' +
  '\n' +
  '📍Si has realizado un depósito, intenta verificarlo nuevamente presionando el botón "<b>VERIFICAR DEPÓSITO</b>" después de 10 minutos. Si el problema persiste, escríbeme.\n' +
  '\n' +
  '✅Después de hacer el depósito, haz clic en el botón "<b>VERIFICAR DEPÓSITO</b>".';

const replyText = '❌<b>MENSAJE NO ENVIADO</b>❌\n' +
    '\n' +
    '📩 <b>SI NECESITAS AYUDA ESCRÍBEME AQUÍ</b> - <a>@AlexcortesBot</a> 📲';

const aboutMe = `👋🏼Hola, mi nombre es Alex, soy un trader y analista profesional con educación superior. En mi blog muestro cómo gano dinero en el mercado financiero y enseño a la gente. Tengo un canal VIP con señales privadas, con el cual mis suscriptores ganan desde 3000$ mensuales.💰🤑.\n` +
  '\n' +
  '🚀Únete a mi canal VIP y gana dinero con nosotros!';

const welcomeMessage = '<b>Ahora responderé las preguntas más comunes ⬇️</b>\n' +
  '\n' +
  '<b>▪️Cómo gano dinero?</b>\n' +
  '- Mi empresa se dedica al trading, evaluamos todos los riesgos y apostamos por una disminución o aumento del valor de las acciones. También tenemos nuestra propia gente en diferentes empresas que nos dan información sobre si las acciones subirán o bajarán.📊💼\n' +
  '\n' +
  '<b>▪️Con cuánto dinero puedo empezar?</b>\n' +
  `- Monto mínimo <b>100-200 ${configService.get(CONFIG.CURRENCY)}</b>. Cuanto mayor sea tu depósito, más ganarás.💸\n` +
  '\n' +
  '<b>▪️Soy nuevo y no sé nada sobre trading.</b>\n' +
  '- Doy a cada persona una formación completa y doy todas las instrucciones para el trabajo.📚\n' +
  '\n' +
  '<b>▪️Cuánto ganaré?</b>\n' +
  `- Ingreso diario de <b>100-700 ${configService.get(CONFIG.CURRENCY)}</b>🤑\n` +
  '\n' +
  '<b>▪️Es gratis?</b>\n' +
  '- Sí, por primera vez trabajamos gratis. Pero si le gusta el resultado, discutiremos las condiciones de cooperación.🆓\n' +
  '\n' +
  '<b>▪️Puedo perder dinero?</b>\n' +
  '- Si tienes un capital inicial cómodo + haces todo según las instrucciones, entonces no.🌟\n' +
  '\n' +
  `<b>⁉️Estás listo para ganar hoy 500-700 ${configService.get(CONFIG.CURRENCY)} sin riesgo?</b>\n` +
  '<b>📈 En caso afirmativo, únete a mi canal VIP y comienza a ganar dinero con mi equipo.</b>';

const registerText = '⚠️Para poder ganar dinero usando mis señales y obtener acceso al canal VIP, debes completar una serie de acciones.\n' +
  '\n' +
  '✅ <b>ES GRATIS!</b> ✅\n' +
  '\n' +
  '❌<b>Sin estas acciones no podrás acceder al canal VIP</b>❌\n' +
  '\n' +
  '📲Primero, debe registrarse en el sitio.\n' +
  '\n' +
  '1.📍Haga clic en el botón "<b>REGISTRO</b>". La cuenta debe ser NUEVA, si ya tenía una cuenta, entonces necesita crear una nueva.\n' +
  '\n' +
  '2.📍Después del REGISTRO, haga clic en el botón "<b>VERIFICAR REGISTRO</b>".\n' +
  '\n' +
  '<b>📩Si tienes alguna pregunta escríbeme.</b>';

const texts = {
  verifyRegistration: {
    success: verifyRegistrationSuccessText,
    failed: verifyRegistrationFailedText
  },
  verifyDeposit: {
    success: verifyDepositSuccessText,
    failed: verifyDepositFailedText
  },
  replyText,
  aboutMe,
  welcomeMessage,
  registerText
};

export default texts;
