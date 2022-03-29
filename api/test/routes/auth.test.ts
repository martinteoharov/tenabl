const { build } = require('../../src/index');

describe('root tests', () => {
  let app:any;

  beforeAll(async () => {
    app = await build();
  })

  test('user validation successful', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/register',
      payload: { first_name: "kur", last_name: "pedal", username: "kurpedal", email: "kurkopedal@gmail.com", password: "password", accepted_terms: true }
    })

    expect(res.statusCode).toEqual(200)
  })

  // test('user validation unsuccessful: bad name', async () => {
  //   const res = await app.inject({
  //     method: 'GET',
  //     url: '/'
  //   })

  //   expect(JSON.parse(res.payload)).toEqual({ root: true })
  // })

  // test('user validation unsuccessful: bad email', async () => {
  //   const res = await app.inject({
  //     method: 'GET',
  //     url: '/'
  //   })

  //   expect(JSON.parse(res.payload)).toEqual({ root: true })
  // })

  // test('user validation unsuccessful: bad password', async () => {
  //   const res = await app.inject({
  //     method: 'GET',
  //     url: '/'
  //   })

  //   expect(JSON.parse(res.payload)).toEqual({ root: true })
  // })

})
