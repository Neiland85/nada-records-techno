# Guía para Subir Videos - Nada Records

## Cómo Subir Tus Video-Clips

### Opción 1: Upload Directo en la Aplicación
1. Ve a la sección "Video-Clips de Neiland" en la parte inferior de la tienda
2. Haz clic en el botón "Subir Video" en la esquina superior derecha
3. Selecciona el track para el cual quieres subir el video
4. Haz clic en "Subir" o "Cambiar" y selecciona tu archivo de video
5. El video se cargará automáticamente y estará disponible para reproducir

### Opción 2: Archivos Locales (Para Desarrollo)
Si tienes los archivos de video localmente, puedes colocarlos en:
```
src/assets/video/
├── soy-de-gestion-clip.mp4
├── la-ambicion-del-nada-clip.mp4
└── resonancia-mental-clip.mp4
```

Luego actualiza las URLs en el código para usar estos archivos.

## Formatos de Video Compatibles
- **MP4** (Recomendado)
- **WebM**
- **MOV**
- **AVI**

## Especificaciones Recomendadas
- **Resolución**: 1920x1080 (Full HD) o 1280x720 (HD)
- **Aspect Ratio**: 16:9
- **Duración**: 2-5 minutos para clips promocionales
- **Tamaño de archivo**: Máximo 50MB por video
- **Bitrate**: 5-10 Mbps para buena calidad
- **Frame Rate**: 24fps o 30fps

## Características Actuales del Video Banner

### ✅ Funcionalidades Implementadas
- Upload de videos directamente desde la aplicación
- Reproductor de video integrado con controles personalizados
- Navegación entre múltiples video-clips
- Modal de pantalla completa para ver videos
- Thumbnails usando las portadas de los discos
- Indicadores de duración
- Botones de navegación (anterior/siguiente)
- Puntos de navegación para múltiples videos
- Almacenamiento persistente de videos subidos

### 🎯 Información de Tracks Incluidos
1. **Soy de Gestión** - Track principal con portada oficial
2. **La Ambición del Nada** - Segundo track con portada oficial
3. Espacio preparado para futuros lanzamientos

### 🔧 Características Técnicas
- Validación de tipo de archivo (solo videos)
- Validación de tamaño (máximo 50MB)
- Manejo de errores con notificaciones
- Interfaz responsive para móviles
- Efectos 3D en botones
- Animaciones suaves con Framer Motion
- Almacenamiento con useKV para persistencia

### 📱 Responsive Design
- Diseño adaptativo para móviles y tablets
- Navegación táctil optimizada
- Controles de video accesibles
- Layout que se adapta al contenido

## Próximos Pasos Sugeridos
1. Sube tus video-clips reales usando el botón "Subir Video"
2. Considera crear videos cortos (2-3 minutos) para mejor engagement
3. Usa las portadas de tus discos como thumbnails
4. Añade descripciones atractivas para cada video-clip

## Notas Importantes
- Los videos se almacenan localmente en el navegador
- Para producción, considera usar servicios como YouTube, Vimeo o un CDN
- Los videos grandes pueden afectar el rendimiento
- Recomendamos comprimir videos antes de subirlos

¡Tu video banner está listo para mostrar tus video-clips oficiales de Neiland!