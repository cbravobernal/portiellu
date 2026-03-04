# Casa Rural - Web Base en Next.js

Estructura inicial para la web de la casa rural en Cangas de Onís:

- Landing con propuesta de valor
- Galería usando fotos locales
- Formulario de solicitud de reserva
- API `POST /api/reservas` con validacion basica
- SEO tecnico base (`robots`, `sitemap`, `JSON-LD`)

## Ejecutar en local

```bash
npm install
npm run dev
```

## Optimizar imagenes

Cuando agregues fotos nuevas, ejecuta:

```bash
npm run optimize:images
```

Genera versiones comprimidas en `/public/images/optimized`.

## Produccion (Vercel)

1. Subir el repositorio a GitHub.
2. Importarlo en Vercel.
3. Desplegar con valores por defecto.

## Siguiente paso recomendado

Conectar `app/api/reservas/route.ts` a:

- Email (Resend, SendGrid o SMTP) para recibir reservas por correo.
- O base de datos (Supabase/Postgres) para guardar solicitudes.
