import {Entity, Column, Index, ManyToOne, JoinColumn, OneToMany} from "typeorm";

import MyEntity from './MyEntity'
import Post from "./Post";
import User from "./User";
//TODO: pass error messages

@Entity("subs")
export default class Sub extends MyEntity{
  constructor(sub: Partial<Sub>){
    super();
    Object.assign(this,sub);
  }

  @Index()
  @Column({unique:true})
  name:string

  @Column()
  title:string

  @Column({type:'text',nullable:true})
  description:string
  
  @Column({nullable:true})
  imagineUrn:string

  @Column({nullable:true})
  bannerUrn:string

  @Column()
  username:string;

  @ManyToOne(() => User)
  @JoinColumn({name:"username", referencedColumnName:"username"})
  user: User;

  @OneToMany(() => Post, post=> post.sub)
  posts: Post[];
}
