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
                    name: 'url',
                    type: 'varchar'
                },
                {
                    name: 'comment',
                    type: 'varchar',
                }
            ]
        }), true)

        await queryRunner.addColumn('comment', new TableColumn({
            name: 'userId',
            type: 'varchar'
        }));

        await queryRunner.createForeignKey('review', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE'
        }));
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('comment');    // Revert changes if needed
    }

}
