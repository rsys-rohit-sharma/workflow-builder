import { config } from 'dotenv';
import { mongoMigrateCli } from 'mongo-migrate-ts';
import path from 'path';

if (process.env.LOCAL === 'true') {
    const envPath = path.resolve(__dirname).split(`services/`);
    config({ path: `${envPath[0]}.env` });
}

/**
 * Reference: https://www.npmjs.com/package/mongo-migrate-ts
 * -----------------------------------------------------------------------------------------
 * -----------------------------------------------------------------------------------------
 * pnpm run migrate:create -n CreateWorkspaceTemplate
 * Usage: index new [options]
 *
 * Create a new migration file under migrations directory
 *
 * Options:
 *  -n, --name <name>           The migration name
 *  -t, --template-file <path>  The template file to use
 *  -h, --help                  Display help for command
 *
 * -----------------------------------------------------------------------------------------
 * -----------------------------------------------------------------------------------------
 * Usage: index down [options]
 *
 * Undo migrations
 *
 * Options:
 *  -l, --last  Undo the last applied migration
 *  -a, --all   Undo all applied migrations
 *  -h, --help  Display help for command
 */

const setupAndRunMigrations = async (): Promise<void> => {
    try {
        mongoMigrateCli({
            uri: process.env.DB_HOST,
            database: process.env.DB_NAME,
            migrationsDir: __dirname,
            migrationsCollection: 'changelog',
            migrationNameTimestampFormat: 'yyyyMMddHHmmss',
        });
    } catch (error) {
        console.error('Error setting up migrations:', error);
        process.exit(1);
    }
};

(async () => {
    await setupAndRunMigrations();
})();
