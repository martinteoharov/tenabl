import { FastifyReply, FastifyRequest } from 'fastify'
import * as t from 'io-ts'
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';
import { RouteGenericInterface } from 'fastify/types/route';

export function withSchema<T extends t.Type<any>, U extends any[] = [], V = any, W extends RouteGenericInterface = Record<string, unknown>>(
    schema: T,
    cb: (req: FastifyRequest<W>, rep: FastifyReply, body: t.TypeOf<T>, ...args: U) => V
): (req: FastifyRequest<W>, rep: FastifyReply, ...args: U) => V | void {
    return (req, rep, ...args) => pipe(req.body, schema.decode, fold(
        () => { rep.code(400).send({ error: "Tiq requesti na maika si shte gi prashtash piklio" }) },
        data => cb(req, rep, data, ...args)
    ))
}
