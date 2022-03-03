const isProduction = process.env.ENV == 'production';
const subpath = path => isProduction ? `bin/api/src/db/${path}.js`
    : `src/db/${path}.ts`;

module.exports = {
    type: 'postgres',
    host: process.env.DB_HOST | 'localhost',
    port: process.env.DB_PORT | 5432,
    username: process.env.DB_USER | 'postgres',
    password: process.env.DB_PASSWD | 'postgres',
    database: process.env.DB_DATABASE | 'com2027_dev',
    synchronize: !isProduction,
    logging: true,
    entities: [subpath('entities/*')],
    migrations: [subpath('migrations/*')],
    subscribers: [subpath('subscribers/*')],
    cli: {
        entitiesDir: 'src/db/entities',
        migrationsDir: 'src/db/migrations',
        subscribersDir: 'src/db/subscribers',
    }
}