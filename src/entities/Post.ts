import { Exclude, Expose } from "class-transformer";
import {Entity, Column, Index, ManyToOne, JoinColumn, BeforeInsert, OneToMany} from "typeorm";
import { make62BaseId, slugify } from "../utils/base62";
import Comment from "./Comment";

import MyEntity from './MyEntity'
import Sub from "./Sub";
import User from "./User";
import Vote from "./Vote";
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
  
  @Column()
  username:string

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({name:"username", referencedColumnName:"username"})
  user: User;

  @ManyToOne(() => Sub, sub => sub.posts)
  @JoinColumn({name:"subName", referencedColumnName:"name"})
  sub: Sub;

  @Exclude()
  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @Exclude()
  @OneToMany(() => Vote, vote => vote.post)
  votes: Vote[];

  @Expose() get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  @Expose() get commentCnt():number{
    return this.comments?.length;
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce((prev,current) => prev+(current.value||0),0)
  }

  protected userVote: number
  setUserVote(user: User) {
    const index = this.votes?.findIndex((v) => v.username === user.username)
    this.userVote = index > -1 ? this.votes[index].value : 0
  }

  @BeforeInsert()
  makeIdAndSlug(){
    this.identifier = make62BaseId(6);
    this.slug = slugify(this.title);
  }
}
