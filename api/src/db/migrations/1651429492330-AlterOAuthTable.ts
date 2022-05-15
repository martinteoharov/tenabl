import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterOAuthTable1651429492330 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> { // Change ID column to varchar
        await queryRunner.dropColumn('oauth', 'google_token_type');
        await queryRunner.dropColumn('oauth', 'google_renew_token');
        await queryRunner.dropColumn('oauth', 'google_expiration');
        await queryRunner.dropColumn('oauth', 'google_auth_token');
        await queryRunner.addColumn('oauth', new TableColumn({
            name: 'google_auth_sub',
            type: 'varchar',
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> { // Undo migration
        await queryRunner.dropColumn('oauth', 'google_auth_sub');
        await queryRunner.addColumn('oauth', new TableColumn({
            name: 'google_token_type',
            type: 'varchar'
        }));
        await queryRunner.addColumn('oauth', new TableColumn({
            name: 'google_renew_token',
            type: 'varchar'
        }));
        await queryRunner.addColumn('oauth', new TableColumn({
            name: 'google_auth_token',
            type: 'varchar'
        }));
        await queryRunner.addColumn('oauth', new TableColumn({
            name: 'google_expiration',
            type: 'timestamp'
        }));
    }
}
