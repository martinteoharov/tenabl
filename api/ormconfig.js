const isProduction = process.env.ENV == 'production';
const subpath = path => isProduction ? `bin/api/src/db/${path}.js`
    : `src/db/${path}.ts`;

module.exports = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.DB_DATABASE,
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