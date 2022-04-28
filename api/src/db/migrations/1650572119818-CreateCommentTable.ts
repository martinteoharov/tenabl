import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class CreateCommentTable1650572119818 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'comment',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true
                },
                {
                    name: 'comment',
                    type: 'text',
                }
            ]
        }), true)

        await queryRunner.addColumn('comment', new TableColumn({
            name: 'userId',
            type: 'varchar'
        }));

        await queryRunner.addColumn('comment', new TableColumn({
            name: 'publicationId',
            type: 'varchar'
        }));

        await queryRunner.createForeignKey('comment', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE'
        }));

        await queryRunner.createForeignKey('comment', new TableForeignKey({
            columnNames: ['publicationId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'publication',
            onDelete: 'CASCADE'
        }));
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('comment');    // Revert changes if needed
    }

}
