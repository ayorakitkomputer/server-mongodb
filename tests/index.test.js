const {MongoClient} = require('mongodb');
const request = require('supertest')
const app = require('../app')
const uri =
	"mongodb+srv://pietro:iniFieldPasswordUntukMongoDb@cluster0.gc9uw.mongodb.net/partspicker?retryWrites=true&w=majority"
const mongoDbName = "testing-partspicker"

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true // baru
    });
    db = await connection.db(mongoDbName);
  });

  afterAll(async () => {
    // await db.collection('cpu').remove()
    await connection.close();
    // await db.close();
  });

  it('should insert a doc into collection', async () => {

    const cpu = db.collection('cpu')
    // const Cpu = require("../models/CPU");

    const mockCpu = {
      _id: 'wow',
      name: "TESTING",
      image: "https://hargadunia.com/resources/products/img_uploads/aW1nX05WSURJQV9HZUZvMTE6MzM6MjY.jpg",
      manufacturer: "TESTING",
      tdp: 111,
      socket: "kakakkau",
      igpu: false,
      price: 100000,
      stock: 45
    }

    await cpu.insertOne(mockCpu);

    const insertedCpu = await cpu.findOne({_id: 'wow'});

    expect(insertedCpu).toEqual(mockCpu);
    await cpu.deleteOne({_id: 'wow'});

    
  });
});

describe('creating a Cpu | success test', () => {
  test('creating a Cpu', (done) => {
    request(app)
    .post('/cpu')
    .set('access_token', access_token)
    .send({
      _id: 'wow',
      name: "TESTING",
      image: "https://hargadunia.com/resources/products/img_uploads/aW1nX05WSURJQV9HZUZvMTE6MzM6MjY.jpg",
      manufacturer: "TESTING",
      tdp: 111,
      socket: "kakakkau",
      igpu: false,
      price: 100000,
      stock: 45
    })
    .end(function(err, res) {
      if (err) {
          return done(err)
      }

      // Cpu = res.body.Cpu
      expect(res.status).toBe(201)
      // expect(res.body).toHaveProperty('message', 'Successfully created a product')
      // expect(res.body).toHaveProperty('status-code', 201)
      // done()
    })
  })
})