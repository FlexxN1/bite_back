# Bite Back 🛒🛍

Es una SPA construida en React.js con el objetivo de simular una tienda virtual de comercio.

Recursos :

- [API-FakeStore](https://fakestoreapi.com/)

- [Figma Mobile Design](https://www.figma.com/proto/bcEVujIzJj5PNIWwF9pP2w/Platzi_YardSale?node-id=0%3A719&amp%3Bscaling=scale-down&amp%3Bpage-id=0%3A1&amp%3Bstarting-point-node-id=0%3A719)

- [Figma Desktop Design](https://www.figma.com/proto/bcEVujIzJj5PNIWwF9pP2w/Platzi_YardSale?node-id=5%3A2808[%E2%80%A6]ing=scale-down&amp;page-id=0%3A998&amp;starting-point-node-id=5%3A2808)

## View project 🚀🙋🏻‍♂️
## [Deploy](https://flexx-e-commerce.netlify.app/)

## Installation ⚖
Clone yardsales:
```
git clone https://github.com/FlexxN1/YardSale-i-Commerce.git
 ```

Install dependencies:
```
npm install
```

Local yardsales deploy:
```
npm run start
```

## License 🔐

Copyright © 2022 [Juan David Moreno](https://github.com/FlexxN1)

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed

---

## API local (incluida)

Se añadió una API HTTP sin dependencias externas (Node >= 18) en `server/server.js`.

### Ejecutar

```bash
npm install   # no instala nada extra, pero asegura package.json válido
npm run start # inicia API en http://localhost:3000
```

### Endpoints principales

- `GET /api/info` – metadatos y lista de endpoints
- `GET /api/health` – healthcheck
- `GET /api/users` – lista (query: `search`, `page`, `limit`)
- `GET /api/users/:id` – detalle
- `POST /api/users` – crear `{ name, email, age?, password? }`
- `PUT /api/users/:id` – reemplazar
- `PATCH /api/users/:id` – actualizar parcial
- `DELETE /api/users/:id` – eliminar

### Autenticación

- `POST /api/auth/register` – `{ name, email, password, age? }` → `{ token, user }`
- `POST /api/auth/login` – `{ email, password }` → `{ token, user }`
- `GET /api/auth/me` – header `Authorization: Bearer <token>` → `user`

> Los passwords se almacenan con `HMAC-SHA256` + `salt` (sin librerías). **No** es JWT; es un token HMAC simple para demo.
