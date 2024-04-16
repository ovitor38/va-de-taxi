import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableMovies1713231366258 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS movies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT null,
        title VARCHAR NOT NULL,
        release_date DATE NOT NULL,
        director VARCHAR NOT NULL,
        duration TIME NOT null,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMPTZ,
        FOREIGN KEY (user_id) REFERENCES users(id)               
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE movies`);
  }
}
