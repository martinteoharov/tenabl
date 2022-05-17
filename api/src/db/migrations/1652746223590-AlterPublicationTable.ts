import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterPublicationTable1652746223590 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('publication', new TableColumn({
            name: 'title',
            type: 'varchar'
        }));
        await queryRunner.addColumn('publication', new TableColumn({
            name: 'description',
            type: 'varchar'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> { // Undo migration
        await queryRunner.dropColumn('publication', 'title');
        await queryRunner.dropColumn('publication', 'description');
    }

}
