export const makeId = (length: number): string => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let index = 0; index < length; index++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const slugify = (input: string): string => {
  // remove accents, swap ñ for n, etc
  const from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaaaeeeeiiiioooouuuunc------";

  for (let i = 0, l = from.length; i < l; i++) {
    input = input.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  return input
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-") // collapse dashes
    .replace(/^-+/, "") // trim - from start of text
    .replace(/-+$/, "") // trim - from end of text
    .replace(/-/g, "_");
};
