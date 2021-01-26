import { Expose } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from '../users/user.entity';
@Entity()
export class Cats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  gender: string;

  @ManyToOne(() => Users, (user) => user.cats)
  user: Users;

  @Expose()
  get junctionCat(): string {
    return `${this.id} | ${this.name} | ${this.gender}`;
  }
}
