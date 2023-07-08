import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  topic: string;

  @Column({ default: 'nopic.png' })
  photo: string;

  @ManyToOne(() => User, (user) => user.blogs)
  user: User;
}
