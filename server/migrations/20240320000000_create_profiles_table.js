exports.up = async (knex) => {
  await knex.schema.createTable('profiles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().unique();
    table.string('prenom');
    table.string('objectif_sante');
    table.string('regime_particulier');
    table.string('autres_regimes');
    table.string('sexe');
    table.integer('age');
    table.decimal('taille');
    table.decimal('poids');
    table.decimal('budget_alimentaire');
    table.boolean('freemium').defaultTo(true);
    table.boolean('completed').defaultTo(false);
    table.jsonb('allergies');
    table.jsonb('preferences');
    table.string('photo_profil');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Clé étrangère vers la table auth.users de Supabase
    table.foreign('user_id').references('id').inTable('auth.users').onDelete('CASCADE');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('profiles');
};
