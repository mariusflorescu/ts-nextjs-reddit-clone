export interface User{
  username:string;
  email:string;
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
  url:string;
  userVote?:number;
  commentCnt:number;
  voteScore?:number;
}

export interface Sub{
  name: string;
  title: string;
  description:string;
  createdAt: string;
  updatedAt: string;
  posts?: Post[];
  imagineUrn:string;
  bannerUrn:string;
}