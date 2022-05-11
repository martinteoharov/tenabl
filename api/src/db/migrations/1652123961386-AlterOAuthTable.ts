import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterOAuthTable1652123961386 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('oauth', new TableColumn({
            name: 'github_auth_username',
            type: 'varchar'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> { // Undo migration
        await queryRunner.dropColumn('oauth', 'github_auth_username');
    }

}
