import {MigrationInterface, QueryRunner, Table, TableIndex, TableColumn, TableForeignKey } from "typeorm";

export class CreatePasswordTable1646318966532 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "password",
            columns: [
                {
                    name: "userId",
                    type: "varchar",
                    isPrimary: true,
                },
                {
                    name: "hash",
                    type: "varchar",
                }
            ]
        }), true)

        const foreignKey = new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
            onDelete: "CASCADE"
        });
        
        await queryRunner.createForeignKey("password", foreignKey); // Create foreign key
    }

    
    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("password");    // Revert changes if needed
    }

}
