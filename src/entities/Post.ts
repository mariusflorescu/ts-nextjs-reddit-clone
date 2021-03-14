import {Entity, Column, Index, ManyToOne, JoinColumn, BeforeInsert, OneToMany} from "typeorm";
import { make62BaseId, slugify } from "../utils/base62";
import Comment from "./Comment";

import MyEntity from './MyEntity'
import Sub from "./Sub";
import User from "./User";
//TODO: pass error messages

@Entity("posts")
export default class Post extends MyEntity{
  constructor(post: Partial<Post>){
    super();
    Object.assign(this,post);
  }

  @Index()
  @Column()
  identifier: string; //62 base

  @Column()
  title: string;

  @Index()
  @Column()
  slug:string;

  @Column({nullable:true,type:'text'})
  body:string;
    
  @Column()
  subName: string;

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({name:"username", referencedColumnName:"username"})
  user: User;

  @ManyToOne(() => Sub, sub => sub.posts)
  @JoinColumn({name:"subName", referencedColumnName:"name"})
  sub: Sub;

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @BeforeInsert()
  makeIdAndSlug(){
    this.identifier = make62BaseId(6);
    this.slug = slugify(this.title);
  }
}
