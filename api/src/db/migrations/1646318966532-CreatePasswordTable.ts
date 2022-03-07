import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CreatePasswordTable1646318966532 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'password',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: "hash",
                    type: "varchar",
                }
            ]
        }), true)

        await queryRunner.addColumn('password', new TableColumn({
            name: 'userId',
            type: 'varchar'
        }));

        await queryRunner.createForeignKey('password', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE'
        }));
    }


    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('password');    // Revert changes if needed
    }

}
