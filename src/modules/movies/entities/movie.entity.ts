import { IsUUID } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'movies' })
export class MovieEntity {
  @PrimaryGeneratedColumn()
  @IsUUID()
  @Generated('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ name: 'release_date' })
  released: Date;

  @Column()
  director: string;

  @Column({ type: 'time' })
  duration: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  constructor(movie?: Partial<MovieEntity>) {
    this.id = movie?.id;
    this.title = movie?.title;
    this.released = movie?.released;
    this.director = movie?.director;
    this.duration = movie?.duration;
  }
}
