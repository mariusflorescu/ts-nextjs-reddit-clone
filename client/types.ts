export interface User{
  username:string;
  email:string;
  createdAt:string;
  updatedAt:string;
}

export interface Comment {
  username:string;
  identifier:string;
  body:string;
  createdAt:string;
  updatedAt:string;
}
export interface Post {
  identifier: string;
  username:string;
  title:string;
  slug:string;
  body?:string;
  subName:string;
  createdAt:string;
  updatedAt:string;
  comments:Comment[];
  url:string;
  userVote?:number;
  commentCnt:number;
  voteScore?:number;
}

export interface Sub{
  name: string;
  title: string;
  description:string;
  username:string;
  createdAt: string;
  updatedAt: string;
  posts?: Post[];
  imageUrl:string;
  bannerUrl:string;
}