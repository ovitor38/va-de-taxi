import { IsUUID } from 'class-validator';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'movies' })
export class MovieEntity {
  @PrimaryGeneratedColumn()
  @IsUUID()
  @Generated('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ length: 200 })
  title: string;

  @Column({ name: 'released_date' })
  released: Date;

  @Column()
  director: string;

  @Column({ type: 'time' })
  duration: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @ManyToOne(() => UserEntity, (user) => user.movie)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' }) // Especifica o nome da coluna na tabela atual
  user: UserEntity;

  constructor(movie?: Partial<MovieEntity>) {
    this.id = movie?.id;
    this.userId = movie?.userId;
    this.title = movie?.title;
    this.released = movie?.released;
    this.director = movie?.director;
    this.duration = movie?.duration;
  }
}
