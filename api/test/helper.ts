import Fastify from 'fastify';
//import fp from 'fastify-plugin';
//import { App } from '../src/index';

export const build = async () => {
  const app = Fastify();

  beforeAll(async () => {
    //void app.register(fp(App), config()); // Idk how to fix this
    await app.ready();
  });

  afterAll(() => app.close());

  return app;
};

const config = () => {
    return {};
};
