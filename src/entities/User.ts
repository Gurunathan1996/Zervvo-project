import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "Unique id of the user",
  })
  id: number;

  @Column({
    type: "varchar",
    name: "username",
    length: 200,
    comment: "Name of the user",
  })
  username: string;

  @Column({
    type: "varchar",
    name: "email",
    length: 200,
    comment: "Email of the user",
    unique: true,
    nullable: true
  })
  email: string;

  @Column({
    type: "varchar",
    name: "password",
    length: 100,
    nullable: true,
    comment: "Encrypted password hash",
  })
  password: string;

  @Column({ default: 'user' })
  role!: string;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp", {
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
