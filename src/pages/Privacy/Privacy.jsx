import { Link } from 'react-router-dom';
import Eyebrow from '../../components/ui/Eyebrow';
import SurfaceCard from '../../components/ui/SurfaceCard';

export default function Privacy() {
  return (
    <div className="animate-fade-in min-h-screen p-5 lg:p-8 pb-12">
      <div className="max-w-2xl mx-auto flex flex-col gap-5">
        <div>
          <Eyebrow color="#00F5D4">🔒 PRIVACIDAD</Eyebrow>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>
            Política de privacidad
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text2)' }}>
            Última actualización: julio 2026
          </p>
        </div>

        <SurfaceCard className="p-5 space-y-4 prose-sm">
          <section>
            <h2 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
              1. Qué datos recopilamos
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
              Eggmotion almacena la información que vos proporcionás al registrarte (nombre, email,
              país, idioma y zona horaria), tus check-ins emocionales, entradas del diario, frases
              favoritas y preferencias de la app.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
              2. Cómo usamos tus datos
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
              Usamos tus datos para ofrecerte el seguimiento emocional, estadísticas personalizadas,
              el diario y la frase del día según tu zona horaria. No vendemos ni compartimos tus
              datos personales con terceros con fines comerciales.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
              3. Análisis con IA
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
              Podés activar o desactivar el análisis con IA desde Configuración → Privacidad y datos.
              Cuando está activo, el texto de tus check-ins y entradas de diario puede enviarse a
              Google Gemini para generar insights y patrones. No es un diagnóstico médico. Stickers
              y dibujos del diario no se envían. Si lo desactivás, dejamos de enviar datos nuevos;
              los insights guardados se ocultan pero no se borran hasta que elimines tu cuenta.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
              4. Tus derechos
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
              Podés exportar una copia de tus datos o eliminar tu cuenta en cualquier momento desde
              Configuración → Privacidad y datos. La eliminación borra de forma permanente tu
              perfil, check-ins, diario y favoritos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
              5. Seguridad
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
              Las contraseñas se almacenan con hash seguro. Las sesiones usan tokens de acceso y
              renovación. Te recomendamos usar una contraseña única y no compartir tus credenciales.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
              6. Contacto
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
              Para consultas sobre privacidad, escribinos a{' '}
              <a href="mailto:privacidad@eggmotion.app" style={{ color: '#00F5D4' }}>
                privacidad@eggmotion.app
              </a>
              .
            </p>
          </section>
        </SurfaceCard>

        <Link
          to="/settings"
          className="font-pixel text-[8px] press-effect inline-block"
          style={{ color: 'var(--text2)' }}
        >
          ← VOLVER A CONFIGURACIÓN
        </Link>
      </div>
    </div>
  );
}
