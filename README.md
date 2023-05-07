# NodeJs REST API using Typescript + Prisma

## Requirments

- **Yarn** v1.22+
- **NodeJS** v16.12+

## Technology Stack

1. **Typescript**
2. **NodeJS** with **Express.js** framework
3. **REST API**
4. **MySQL** database
5. **Prisma** ODM
6. **JWT** Authentication
7. **Zod** schema validation
8. **Jest** Testing


## Get Started

1. Clone repository
2. Setup ENV File (read env example in `docs > .env.example` for setup)
3. Generate your own private key & public key using openssl
    - generate private key
        ```sh
        openssl genrsa -out private_key.pem 2048
        ```
    - generate public key
        ```sh
        openssl rsa -in private_key.pem -pubout -out public_key.pem
        ```
4. Open Command or Terminal and Write **yarn install**
5. Write **yarn db:migrate** in terminal to run prisma migration
6. Write **yarn db:setup** in terminal to run some setup for database
7. Commands :
    - Write **yarn dev** in terminal for development
    - Write **yarn start** in terminal for production
    - Write **yarn test** in terminal for testing