# NestJs Advanced Boilerplate

Readymade Nest Js Boilerplate with Advanced Features Setup

![Nest.js Logo](https://cdn.icon-icons.com/icons2/2699/PNG/512/nestjs_logo_icon_169927.png)

## For more customization or assistance, check out my Fiverr service: [https://www.fiverr.com/s/WpKKPR](https://www.fiverr.com/s/WpKKPR)

Connect with me on LinkedIn: [https://www.linkedin.com/in/janen-r/](https://www.linkedin.com/in/janen-r/)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/janen-r/nestjs-boilerplate-advanced.git
    ```

2. Navigate to the project folder:

    ```bash
    cd nestjs-boilerplate-advanced
    ```

3. Move the `.env.example` file to `.env`:

    ```bash
    mv .env.example .env
    ```

4. Install dependencies:

    ```bash
    npm install
    ```

5. Run the application in development mode:

    ```bash
    npm run start:dev
    ```

Access the application at [http://localhost:3000](http://localhost:3000).

## Configuration Checklist

- [x] Mongodb ( Mongoose)
- [x] Redis
- [x] Jwt
- [x] Cookie
- [x] Session
- [x] CORS
- [x] Logger ( Winston )
- [x] Swagger
- [x] Mail ( Node mailer + hbs )
- [x] File Upload ( Multer )
- [x] Socket ( Secured with Jwt token validation )
- [x] Cron
- [x] Input Validations ( DTO - class validator)

## Application APIs

- **Auth - /user/**
  - [x] login
  - [x] register
  - [x] me
  - [x] logout

- **Admin - /admin/**
  - [x] users

- **Fileupload - /upload/**
  - [x] file
  - [x] read

## Authentication Details

- Jwt token for Header Authorization
- Check `jwt.strategy.ts` for 2 strategies: `jwt`, `jwt-admin`
- Cookie session enabled

## Socket

- Jwt token needs to be sent in headers authorization for validation.

## Removing a Config

To remove a config from the application, remove the specific module from `app.module.ts`.

---

For more customization or assistance, check out my Fiverr service: [https://www.fiverr.com/s/WpKKPR](https://www.fiverr.com/s/WpKKPR)

Connect with me on LinkedIn: [LinkedIn Profile](https://www.linkedin.com/in/janen-r/)