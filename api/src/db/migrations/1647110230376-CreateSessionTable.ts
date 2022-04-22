import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CreateSessionTable1647110230376 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'session',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true
                },
                {
                    name: 'refreshToken',
                    type: 'varchar'
                },
                {
                    name: 'started',
                    type: 'timestamp',
                }
            ]
        }), true)

        await queryRunner.addColumn('session', new TableColumn({
            name: 'userId',
            type: 'varchar'
        }));

        await queryRunner.createForeignKey('session', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE'
        }));
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('session');    // Revert changes if needed
    }

}