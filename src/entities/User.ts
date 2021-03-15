import { IsEmail, Length } from "class-validator";
import {Entity, Column, Index, BeforeInsert, OneToMany} from "typeorm";
import bcrypt from "bcrypt";
import { Exclude } from 'class-transformer'

import MyEntity from './MyEntity'
import Post from "./Post";
//TODO: pass error messages

@Entity("users")
export default class User extends MyEntity{
    constructor(user: Partial<User>){
        super();
        Object.assign(this,user);
    }

    @Index()
    @Length(4,12, {message:'Must be at least 4 characters long'})
    @Column({unique:true})
    username:string;

    @Index()
    @IsEmail(undefined, {message:"Must be a valid email"})
    @Length(1,255,{message:'Must not be empty'})
    @Column({unique: true})
    email:string;

    @Exclude()
    @Column()
    @Length(6,18, {message:'Must be at least 6 characters long'})
    password:string;

    
    @OneToMany(() => Post, post => post.user)
    posts: Post[];
    
    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password,6);
    }
}
