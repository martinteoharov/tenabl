import {MigrationInterface, QueryRunner, Table, TableIndex, TableColumn, TableForeignKey } from "typeorm";

export class CreateOAuthTable1646354852809 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "oauth",
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: "googleAuthToken",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "googleTokenType",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "googleRenewToken",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "googleExpiration",
                    type: "timestamp",
                    isNullable: true,
                }
            ]
        }), true)

        await queryRunner.addColumn('oauth', new TableColumn({
            name: 'userId',
            type: 'varchar'
        }));

        await queryRunner.createForeignKey('oauth', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE'
        }));
    }

    
    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("oauth");    // Revert changes if needed
    }

}