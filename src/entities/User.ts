import { hash } from "bcrypt";
import { Exclude } from "class-transformer";
import { IsEmail, Length } from "class-validator";
import {
  BeforeInsert,
  Column,
  Entity as TOEntity,
  Index,
  OneToMany,
} from "typeorm";
import { Entity } from "./Entity";
import { Post } from "./Post";

@TOEntity("users")
export class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
  @Index()
  @IsEmail(undefined, { message: "Must be a valid email address" })
  @Length(1, 255, { message: "Email is empty" })
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 255, { message: "Must be at least 3 characters long" })
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  @Length(6, 255, { message: "Must be at least 6 characters long" })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 6);
  }
}
