export const createBigrams = <T>(argv: T[]): T[][] => {
  return argv.map((item, index, array) => {
    return [item, array[index + 1]];
  });
};

export const isFlag = (arg: string): boolean => {
  return arg.startsWith("-") || arg.startsWith("--");
};

export const stripFlagDashes = (flag: string): string => {
  return flag.replace(/^-+/g, "");
};
