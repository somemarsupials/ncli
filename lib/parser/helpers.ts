export const createBigrams = (argv: string[]): string[][] => {
  return argv.map((item, index, array) => {
    return [item, array[index + 1]];
  });
};

interface ArgType {
  isFlag: boolean;
  value: string;
}

interface ClassifiedArgType extends ArgType {}

export const classifyArg = (arg: string): ArgType => {
  return isFlag(arg)
    ? {
        isFlag: true,
        value: stripFlagDashes(arg)
      }
    : {
        isFlag: false,
        value: arg
      };
};
export const isFlag = (arg: string): boolean => {
  return arg.startsWith("-") || arg.startsWith("--");
};

export const stripFlagDashes = (flag: string): string => {
  return flag.replace(/^-+/g, "");
};
