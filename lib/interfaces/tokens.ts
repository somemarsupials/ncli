export interface ArgumentToken {
  type: "argument";
  value: string;
}

export interface FlagToken {
  type: "flag";
  name: string;
}

export interface ParameterToken {
  type: "parameter";
  name: string;
  value: string;
}

export type Token = ArgumentToken | FlagToken | ParameterToken;
