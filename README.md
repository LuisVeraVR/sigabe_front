# Frontend para Sistema de Gestión de Biblioteca

Este proyecto es el frontend para un sistema de gestión de biblioteca que permite administrar un catálogo de libros.

## Requisitos previos

- Node.js v14.0.0 o superior
- npm v6.0.0 o superior
- Backend API en ejecución (ver instrucciones del backend)

## Instalación

1. Clonar el repositorio:

```bash
git clone <URL-del-repositorio>
cd frontend
```

2. Instalar dependencias:

```bash
npm install
```

## Iniciar la aplicación

Para iniciar la aplicación en modo desarrollo:

```bash
npm start
```

La aplicación se abrirá automáticamente en http://localhost:3001 y se conectará al backend que debe estar ejecutándose en http://localhost:3000.

## Características

- Listado de libros con filtros y búsqueda
- Formulario para añadir nuevos libros
- Edición de libros existentes
- Eliminación de libros
- Visualización de detalles de libros

## Estructura del proyecto

- `src/models`: Tipos y interfaces para los datos
- `src/services`: Servicios para conectarse con la API backend
- `src/components`: Componentes reutilizables (Navbar, BookCard)
- `src/pages`: Páginas principales (BookList, BookForm)

## Desarrollo con Git Flow

Este proyecto sigue la metodología Git Flow:

- `main`: Versión de producción
- `develop`: Rama de desarrollo principal
- `feature/*`: Ramas para nuevas características
- `release/*`: Ramas para preparar releases
- `hotfix/*`: Ramas para correcciones urgentes

## Build para producción

Para generar una build de producción:

```bash
npm run build
```

## Contacto

Para cualquier pregunta o sugerencia, por favor abrir un issue en el repositorio.