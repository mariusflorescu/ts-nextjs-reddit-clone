import {BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne} from 'typeorm'

import MyEntity from './MyEntity'
import Post from './Post';
import User from './User';

import { make62BaseId } from "../utils/base62";

@Entity('comments')
export default class Comment extends MyEntity {
  constructor(comment: Partial<Comment>){
    super();
    Object.assign(this,comment);
  }

  @Index()
  @Column()
  identifier:string;

  @Column()
  body:string;

  @Column()
  username:string;

  @ManyToOne(() => User)
  @JoinColumn({name: 'username',referencedColumnName:'username'})
  user:User

  @ManyToOne(() => Post, post => post.comments, {nullable:false})
  post:Post;

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = make62BaseId(8);
  }
}