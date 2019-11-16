export type Arguments = string[];
export type Flags = string[];
export type Parameters = Record<string, string>;

export interface HandlerArguments {
  arguments: Arguments;
  flags: Flags;
  parameters: Parameters;
}
