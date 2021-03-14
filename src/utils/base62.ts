export function make62BaseId(length:number) : string {
  let res = "";
  let chars = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";

  const char_lenght = chars.length

  for(let i=0;i<length;++i){
    res += chars.charAt(Math.floor(Math.random() * char_lenght))
  }

  return res;
} 

export function slugify(str:string) : string {
  str = str.trim();
  str = str.toLowerCase();

  const from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaaaeeeeiiiioooouuuunc------";

  for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  return str
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "")
      .replace(/-/g, '_');
}