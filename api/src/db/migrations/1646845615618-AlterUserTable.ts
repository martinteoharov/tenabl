import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterUserTable1646845615618 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('user', new TableColumn({
            name: 'first_name',
            type: 'varchar'
        }));
        await queryRunner.addColumn('user', new TableColumn({
            name: 'last_name',
            type: 'varchar'
        }));
        await queryRunner.addColumn('user', new TableColumn({
            name: 'accepted_terms',
            type: 'varchar'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> { // Undo migration
        await queryRunner.dropColumn('user', 'first_name');
        await queryRunner.dropColumn('user', 'last_name');
        await queryRunner.dropColumn('user', 'accepted_terms');
    }

}
