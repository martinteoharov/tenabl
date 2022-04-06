import { build } from '../../src/index';

describe('root tests', () => {
  let app:any;

  beforeAll(async () => {
    app = await build();
  })

  test('user validation successful', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { first_name: "Kur", last_name: "Pedal", username: "kurpedal", email: "kurkopedal@gmail.com", password: "P@ssword1", accepted_terms: true }
    })

    expect(res.statusCode).toEqual(200)
  })

  test('user validation unsuccessful: bad name', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { last_name: "Pedal", username: "Kurpedal", email: "kurkopedal@gmail.com", password: "P@ssword1", accepted_terms: true }
    })

    expect(res.statusCode).toEqual(400)
  })

  test('user validation unsuccessful: bad email', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { first_name: "Kur", last_name: "Pedal", username: "Kurpedal", email: "kurkopedal", password: "P@ssword1", accepted_terms: true }
  })

    expect(res.statusCode).toEqual(400)
  })

  test('user validation unsuccessful: bad password', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { first_name: "Kur", last_name: "Pedal", username: "Kurpedal", email: "kurkopedal@gmail.com", password: "password", accepted_terms: true }
  })

    expect(res.statusCode).toEqual(400)
  })

})
