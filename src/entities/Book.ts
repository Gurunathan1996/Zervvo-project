import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Author } from './Author';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "Unique id of the books",
  })
  id: number;

  @Column({
    type: "varchar",
    name: "name",
    length: 255,
    comment: "Name of the book title",
  })
  title: string;

  @Column({
    type: "varchar",
    name: "genre",
    length: 255,
    comment: "Generation of the book",
  })
  genre?: string;

  @Column({
    type: "int",
    name: "publication_Year",
    comment: "Name of the book title",
    nullable: true
  })
  publicationYear?: number;

  @Column({
    type: "int",
    name: "author_id",
  })
  authorId: string;

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

  @ManyToOne(() => Author, (Author) => Author.books, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({
    name: "author_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "FK_books_author_id",
  })
  author: Author;
}
