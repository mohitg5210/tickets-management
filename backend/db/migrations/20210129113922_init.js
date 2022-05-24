exports.up = function (knex) {
  return knex.schema
    .createTable('role', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.timestamps(true, true);
    })
    .createTable('user', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.integer('roleId').references('id').inTable('role');
      table.timestamps(true, true);
    })
    .createTable('ticket', (table) => {
      table.increments();
      table.string('title').notNullable(),
      table.string('description').nullable(),
      table.enu('status',['Open','In Progress', 'Closed']).defaultTo('Open'),
      table.integer('assignTo').nullable().references('id').inTable('user'),
      table.integer('userId').notNullable().references('id').inTable('user'),
      table.float('TimeTaken').nullable(),
      table.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('ticket')
    .dropTableIfExists('user')
    .dropTableIfExists('role');
};
