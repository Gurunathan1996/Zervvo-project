import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from './Book';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "Unique id of the author",
  })
  id: number;

  @Column({
    type: "varchar",
    name: "name",
    length: 200,
    comment: "Name of the author",
  })
  name: string;

  @Column({ type: 'text', nullable: true, comment: 'Author bio-data' })
  bio?: string;

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

  @OneToMany(() => Book, (book) => book.author, { cascade: ["insert"] })
  books: Book[];

}
