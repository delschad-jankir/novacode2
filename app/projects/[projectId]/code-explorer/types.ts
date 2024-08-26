// types.ts
export type TFiles = {
    name: string;
    type?: string;  // Include type if it is part of your data
    children?: TFiles[];
  };