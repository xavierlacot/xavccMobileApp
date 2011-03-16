// increment the number below each time you push a new model version
// (forces rebuild on phone)
var current_migration_version = 1;

// create the tables if required
joli.models.migrate(current_migration_version);
joli.models.initialize();
