# Cash Manager - Frontend

Aplicación web construida con **Angular 18 + Bootstrap** para el sistema de gestión Cash Manager.

## Stack Tecnológico

- **Angular** 18.x
- **Bootstrap** 5 + ngx-bootstrap
- **ng-select** (Dropdowns)
- **ngx-toastr** (Notificaciones)
- **ngx-pagination** (Paginación)
- **SweetAlert2** (Diálogos de confirmación)
- **jwt-decode** (Decodificación de tokens)

## Funcionalidades

### Sistema de autenticación
- Login con email/password
- JWT token almacenado en localStorage
- Guard de rutas protegidas
- Cambio de contraseña

### Sistema de roles y permisos
- Menú dinámico basado en rol del usuario (Module > SubModule)
- Permisos por submódulo: INSERT, UPDATE, DELETE, STATUS
- Permisos codificados en base64

### Vistas CRUD
- **Panel**: Gestión de Módulos, SubMódulos y Roles (con asignación de permisos)
- **Usuarios**: CRUD con asignación de rol y empresa
- **Empresas**: CRUD con cambio de estado

### Sistema de temas (personalizable por usuario)
- **Modo**: Light / Dark
- **Colores**: 8 colores primarios (indigo, blue, pink, red, orange, green, teal, cyan)
- **Orientación del menú**: Vertical, Horizontal, Compacto
- **Dirección**: LTR / RTL
- Se guarda por usuario en la base de datos
- Acceso desde el dropdown del usuario > "Personalizar Tema"

### Sidebar (3 modos)
- **Vertical**: Sidebar lateral clásico con módulos desplegables
- **Horizontal**: Navbar superior con dropdowns
- **Compacto**: Solo iconos, se expande suavemente con hover

## Configuración

### Environment

Archivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  // Local
  // endpoint: 'http://localhost:54750',
  // Remoto
  endpoint: 'https://cash-manager-back.onrender.com',
};
```

## Instalación

```bash
npm install
```

## Ejecución

```bash
# Desarrollo (puerto 4760)
npm start

# Build producción
npm run build
```

## Deploy en Firebase

```bash
# 1. Asegurar que environment apunta a Render
# 2. Build de producción
npm run build

# 3. Login en Firebase (solo la primera vez)
firebase login

# 4. Deploy
firebase deploy --only hosting
```

- **Proyecto Firebase**: `cash-manager-b2416`
- **URL**: `https://cash-manager-b2416.web.app`

## Estructura del proyecto

```
src/app/
├── app.module.ts
├── app-routing.module.ts
├── authentication/                    # Login, recuperar contraseña
│   ├── components/login/
│   ├── interface/
│   └── service/
├── modules/
│   ├── home/                          # Dashboard principal
│   └── configuration/                 # Módulo de configuración
│       ├── panel/                     # Gestión módulos, submódulos, roles
│       │   ├── components/
│       │   │   ├── edit-module/
│       │   │   ├── edit-subModule/
│       │   │   ├── edit-role/
│       │   │   └── edit-menu-permissions/
│       │   └── services/panel.service.ts
│       ├── users/                     # Gestión de usuarios
│       │   └── components/edit-user/
│       └── companies/                 # Gestión de empresas
│           └── components/edit-company/
└── shared/
    ├── sidebar/                       # Sidebar con 3 modos
    ├── settings-panel/                # Panel de personalización de tema
    ├── services/
    │   ├── theme.service.ts           # Servicio de temas
    │   ├── user-state.service.ts      # Estado reactivo del usuario
    │   ├── permission.service.ts      # Permisos por vista
    │   ├── error.service.ts           # Manejo de errores
    │   └── sweetAlert.service.ts      # Diálogos de confirmación
    ├── interface/
    │   ├── menu.interface.ts
    │   └── permission.interface.ts
    ├── data/const.ts                  # Iconos FontAwesome, constantes
    └── routes/content-routes.ts       # Rutas del contenido principal
```

## Conexiones

| Servicio | URL | Uso |
|----------|-----|-----|
| Backend (Render) | `https://cash-manager-back.onrender.com` | API REST |
| Frontend (Firebase) | `https://cash-manager-b2416.web.app` | Aplicación web |
| Base de datos (TiDB) | `gateway01.us-east-1.prod.aws.tidbcloud.com:4000` | MySQL compatible |

## Credenciales de prueba

- **Email**: `picojohn@hotmail.com`
- **Password**: `Admin123`
