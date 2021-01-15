import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Cats } from '../cats/cat.entity';
@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Cats, (cat) => cat.user)
  cats: Cats[];
}
