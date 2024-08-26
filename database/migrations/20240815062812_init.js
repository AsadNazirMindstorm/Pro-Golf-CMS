/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("tournament_table", function (table) {
      table.increments("tournament_id").primary(); // Auto-incrementing primary key
      table.uuid("id").unique().notNullable(); // Unique UUID for the tournament
      table.string("title").notNullable(); // Title of the tournament
      table.string("league").notNullable(); // League associated with the tournament
      table.date("start_datetime").notNullable(); // Start date
      table.date("end_datetime").notNullable(); // End date
      table.integer("user_play_time").notNullable(); // User play time
      table.integer("total_play_time").notNullable(); // Total play time
      table.integer("hole_count").notNullable(); // Number of holes
      table.string("icon");
      table.boolean('isRandom').notNullable();
      table.timestamps(true, true); // Created at and updated at timestamps
    })
    .createTable("hole_data_table", function (table) {
      table.increments("hole_data_id").primary(); // Auto-incrementing primary key
      table.integer("hole_id").notNullable(); // Hole identifier
      table.string("course_id").notNullable(); // Course identifier
      table.integer("tee_position").notNullable(); // Tee position
      table.specificType("wind_direction", "TEXT[]"); // Array of wind directions
      table.string("wind_speed");
      table
        .integer("tournament_id")
        .unsigned()
        .notNullable() // Foreign key
        .references("tournament_id")
        .inTable("tournament_table")
        .onDelete("CASCADE"); // On delete cascade
      table.timestamps(true, true); // Created at and updated at timestamps
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("hole_data_table")
    .dropTableIfExists("tournament_table");
};
