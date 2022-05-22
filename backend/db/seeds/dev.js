var bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
  // truncate all existing tables
  await knex.raw('TRUNCATE TABLE "user" CASCADE');
  await knex.raw('TRUNCATE TABLE role CASCADE');
  await knex.raw('TRUNCATE TABLE ticket CASCADE');

  // insert seed data
  await knex('role').insert([
    {
      name: 'Admin',
    },
    {
      name: 'Operation Manager',
    },
    {
      name: 'Client',
    }
  ]);

  await knex('user').insert([
    {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: bcrypt.hashSync('test123', 8),
      roleId: 1,
    },
    {
      name: 'Operation Manager 1',
      email: 'opm1@gmail.com',
      password: bcrypt.hashSync('test123', 8),
      roleId: 2,
    },
    {
      name: 'Operation Manager 2',
      email: 'opm2@gmail.com',
      password: bcrypt.hashSync('test123', 8),
      roleId: 2,
    },
    {
      name: 'Client 1',
      email: 'client1@gmail.com',
      password: bcrypt.hashSync('test123', 8),
      roleId: 3,
    },
    {
      name: 'Client 2',
      email: 'client2@gmail.com',
      password: bcrypt.hashSync('test123', 8),
      roleId: 3,
    },
    {
      name: 'Client 3',
      email: 'client3@gmail.com',
      password: bcrypt.hashSync('test123', 8),
      roleId: 3,
    },
    {
      name: 'Client 4',
      email: 'client4@gmail.com',
      password: bcrypt.hashSync('test123', 8),
      roleId: 3,
    },
  ]);

  return knex('ticket').insert([
    {
      title: 'Product Delay',
      description: 'Test Tickets',
      status: 'In Progress',
      assignTo: 2,
      userId: 4,
    },
    {
      title: 'Product Broken',
      description: 'Test Tickets',
      userId: 4,
    },
    {
      title: 'Shipment issue',
      description: 'Test Tickets',
      userId: 5,
    },
    {
      title: 'Item issue',
      description: 'Test Tickets',
      userId: 5,
    },
    {
      title: 'product issue',
      description: 'Test Tickets',
      status: 'Closed',
      userId: 5,
    },
  ]);
};
