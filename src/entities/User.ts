import { IsEmail, Length } from "class-validator";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, CreateDateColumn, UpdateDateColumn, BeforeInsert} from "typeorm";
import bcrypt from "bcrypt";
import { classToPlain,Exclude } from 'class-transformer'
//TODO: pass error messages

@Entity("users")
export class User extends BaseEntity{
    constructor(user: Partial<User>){
        super();
        Object.assign(this,user);
    }

    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Length(4,12)
    @Column({unique:true})
    username:string;

    @Index()
    @IsEmail()
    @Column({unique: true})
    email:string;

    @Exclude()
    @Column()
    @Length(6,18)
    password:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password,6);
    }

    toJSON(){
        return classToPlain(this);
    }
}
