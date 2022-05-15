import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterUserTable1652123961387 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user', 'accepted_terms');
    }

    public async down(queryRunner: QueryRunner): Promise<void> { // Undo migration
        await queryRunner.addColumn('user', new TableColumn({
            name: 'accepted_terms',
            type: 'varchar'
        }));
    }

}
