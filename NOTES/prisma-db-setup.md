# How to set up and run a project with Prisma as ORM and sqlite as dev database
## Setup
Libraries
```bash
npm install @prisma/client
npm install -D prisma
npm install pg
```
And *bcrypt* for security hashing
I use sqlite in local and PostgresSQL in production on Vercel. Sqlite is not good on Vercel because data are cleaned up every time, so they don't persist.

## Initialization
To initialize the Prisma Client, run this command:
```bash
npx prisma init
```
This command does two things:
1- it creates the `prisma/` folder in the project root
2- it generates a file `prisma/schema.prisma` with an empty template that points at the sqlite db file

```ts
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "sqlite" // or whatever database of my choice
  url      = env("DATABASE_URL")
}

```
Then we need to configure the models for the tables if using an SQL database

### Models
basic syntax
```sql
model ModelName {
  id        String   @id @default(cuid())   // primary key 
  field1    Type
  field2    Type?
  createdAt DateTime @default(now())
}
```

#### Prisma types
```sql
String	Text
Int	Numero integer
Float	Numero decimal
Boolean	true/false
DateTime	Timestamp
Json	JSON objects
```
Puoi anche usare:

`@unique` → campo unico (es. email)

`@relation` → per relazioni tra modelli

`@@unique([...])` → combinazione unica di più campi

### Generation of the db and migrations
To generate the Prisma Client. It corrects the types when modifying the schema
```bash
npx prisma generate
```
To generate the db and its migrations, run:
```bash
npx prisma migrate dev --name init
```